const generateCode = require("../utils/generateCode");
const { getRandomWordPair, MR_WHITE_BLUFF_CLUES } = require("../utils/wordPairs");

const BOT_NAMES = [
  { name: "Sherlock Fox", avatar: "🦊" },
  { name: "Agent Panda", avatar: "🐼" },
  { name: "Detective Bear", avatar: "🐻" },
  { name: "Sneaky Cat", avatar: "🐱" },
  { name: "Mystery Owl", avatar: "🦉" },
  { name: "Ninja Bunny", avatar: "🐰" },
  { name: "Inspector Dog", avatar: "🐶" },
  { name: "Shadow Koala", avatar: "🐨" },
  { name: "Clever Lion", avatar: "🦁" },
  { name: "Spooky Ghost", avatar: "👻" }
];

class GameManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomCode -> roomData
    this.playerRoomMap = new Map(); // socketId -> roomCode
    this.timers = new Map(); // roomCode -> timerTimeout
  }

  getRoom(roomCode) {
    if (!roomCode) return null;
    return this.rooms.get(roomCode.toUpperCase().trim()) || null;
  }

  getRoomBySocket(socketId) {
    const code = this.playerRoomMap.get(socketId);
    return code ? this.getRoom(code) : null;
  }

  clearRoomTimer(roomCode) {
    if (this.timers.has(roomCode)) {
      clearTimeout(this.timers.get(roomCode));
      this.timers.delete(roomCode);
    }
  }

  setRoomTimer(roomCode, fn, delayMs) {
    this.clearRoomTimer(roomCode);
    const timeout = setTimeout(() => {
      this.timers.delete(roomCode);
      fn();
    }, delayMs);
    this.timers.set(roomCode, timeout);
  }

  createRoom({ hostName, avatar, socketId }) {
    let roomCode;
    do {
      roomCode = generateCode();
    } while (this.rooms.has(roomCode));

    const room = {
      code: roomCode,
      hostId: socketId,
      status: "LOBBY", // LOBBY, ROLE_REVEAL, CLUE_PHASE, DISCUSSION_PHASE, VOTING_PHASE, MRWHITE_GUESS, ROUND_SUMMARY, GAME_OVER
      settings: {
        rounds: 3,
        undercoverCount: 1,
        mrWhiteCount: 1,
        clueTimeLimit: 30, // seconds per clue turn
        discussionTimeLimit: 45 // seconds for debate
      },
      currentRound: 0,
      usedPairs: [],
      words: {
        civilianWord: "",
        undercoverWord: "",
        category: ""
      },
      players: [
        {
          id: socketId,
          name: hostName || "Host",
          avatar: avatar || "🕵️",
          isHost: true,
          isBot: false,
          score: 0,
          isAlive: true,
          hasRevealed: false,
          role: null,
          word: null,
          clues: []
        }
      ],
      turnOrder: [],
      currentTurnIndex: 0,
      turnTimer: 0,
      cluesThisRound: [],
      votes: {}, // voterId -> targetId
      eliminationHistory: [],
      eliminatedPlayer: null,
      roundWinner: null,
      winReason: "",
      roundScoresEarned: {},
      chatMessages: []
    };

    this.rooms.set(roomCode, room);
    this.playerRoomMap.set(socketId, roomCode);
    return room;
  }

  joinRoom({ roomCode, playerName, avatar, socketId }) {
    const room = this.getRoom(roomCode);
    if (!room) {
      throw new Error("Room not found. Please check your room code.");
    }
    if (room.status !== "LOBBY") {
      throw new Error("Game is currently in progress. Please wait for the next game.");
    }
    if (room.players.length >= 12) {
      throw new Error("Room is already full (maximum 12 players).");
    }

    // Check duplicate socket
    const existingIndex = room.players.findIndex(p => p.id === socketId);
    if (existingIndex !== -1) {
      room.players[existingIndex].name = playerName || room.players[existingIndex].name;
      room.players[existingIndex].avatar = avatar || room.players[existingIndex].avatar;
      return room;
    }

    // Ensure unique display name
    let finalName = (playerName || "Player").trim();
    let counter = 2;
    while (room.players.some(p => p.name.toLowerCase() === finalName.toLowerCase())) {
      finalName = `${playerName} ${counter++}`;
    }

    room.players.push({
      id: socketId,
      name: finalName,
      avatar: avatar || "🐱",
      isHost: false,
      isBot: false,
      score: 0,
      isAlive: true,
      hasRevealed: false,
      role: null,
      word: null,
      clues: []
    });

    this.playerRoomMap.set(socketId, room.code);
    return room;
  }

  addBot({ roomCode, socketId }) {
    const room = this.getRoom(roomCode);
    if (!room) throw new Error("Room not found");
    if (room.hostId !== socketId) throw new Error("Only the host can add bots");
    if (room.status !== "LOBBY") throw new Error("Cannot add bots while game is active");
    if (room.players.length >= 12) throw new Error("Maximum 12 players reached");

    // Pick an unused bot name & avatar
    const usedNames = new Set(room.players.map(p => p.name));
    const availableBots = BOT_NAMES.filter(b => !usedNames.has(b.name));
    const botChoice = availableBots.length > 0
      ? availableBots[Math.floor(Math.random() * availableBots.length)]
      : { name: `Bot Agent ${room.players.length + 1}`, avatar: "🤖" };

    const botId = `bot_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    room.players.push({
      id: botId,
      name: botChoice.name,
      avatar: botChoice.avatar,
      isHost: false,
      isBot: true,
      score: 0,
      isAlive: true,
      hasRevealed: true,
      role: null,
      word: null,
      clues: []
    });

    return room;
  }

  kickPlayer({ roomCode, socketId, targetId }) {
    const room = this.getRoom(roomCode);
    if (!room) throw new Error("Room not found");
    if (room.hostId !== socketId) throw new Error("Only the host can kick players");
    if (targetId === room.hostId) throw new Error("Host cannot be kicked");

    room.players = room.players.filter(p => p.id !== targetId);
    this.playerRoomMap.delete(targetId);
    return room;
  }

  updateSettings({ roomCode, socketId, settings }) {
    const room = this.getRoom(roomCode);
    if (!room) throw new Error("Room not found");
    if (room.hostId !== socketId) throw new Error("Only the host can change settings");
    if (room.status !== "LOBBY") throw new Error("Settings can only be changed in the lobby");

    if (settings.rounds !== undefined) {
      room.settings.rounds = Math.max(1, Math.min(10, parseInt(settings.rounds, 10) || 3));
    }
    if (settings.undercoverCount !== undefined) {
      room.settings.undercoverCount = Math.max(1, Math.min(4, parseInt(settings.undercoverCount, 10) || 1));
    }
    if (settings.mrWhiteCount !== undefined) {
      room.settings.mrWhiteCount = Math.max(0, Math.min(3, parseInt(settings.mrWhiteCount, 10) || 0));
    }
    if (settings.clueTimeLimit !== undefined) {
      room.settings.clueTimeLimit = Math.max(15, Math.min(120, parseInt(settings.clueTimeLimit, 10) || 30));
    }
    if (settings.discussionTimeLimit !== undefined) {
      room.settings.discussionTimeLimit = Math.max(20, Math.min(180, parseInt(settings.discussionTimeLimit, 10) || 45));
    }

    return room;
  }

  startGame({ roomCode, socketId }) {
    const room = this.getRoom(roomCode);
    if (!room) throw new Error("Room not found");
    if (room.hostId !== socketId) throw new Error("Only the host can start the game");

    const minRequired = room.settings.undercoverCount + room.settings.mrWhiteCount + 1;
    if (room.players.length < minRequired) {
      throw new Error(`You need at least ${minRequired} players for this setup (${room.settings.undercoverCount} Undercover + ${room.settings.mrWhiteCount} Mr. White + at least 1 Civilian). Add bots or invite friends!`);
    }

    // Reset game-wide stats
    room.currentRound = 0;
    room.usedPairs = [];
    room.players.forEach(p => {
      p.score = 0;
    });

    this.startRound(room);
    return room;
  }

  startRound(room) {
    this.clearRoomTimer(room.code);
    room.currentRound += 1;
    room.status = "ROLE_REVEAL";
    room.votes = {};
    room.cluesThisRound = [];
    room.eliminationHistory = [];
    room.eliminatedPlayer = null;
    room.roundWinner = null;
    room.winReason = "";
    room.roundScoresEarned = {};

    // Get fresh word pair
    const wordData = getRandomWordPair(room.usedPairs);
    room.usedPairs.push(wordData.pairKey);
    room.words = {
      civilianWord: wordData.civilianWord,
      undercoverWord: wordData.undercoverWord,
      category: wordData.category,
      civilianBotClues: wordData.civilianBotClues,
      undercoverBotClues: wordData.undercoverBotClues
    };

    // Assign roles randomly
    const totalPlayers = room.players.length;
    const uCount = Math.min(room.settings.undercoverCount, Math.floor((totalPlayers - 1) / 2));
    const wCount = Math.min(room.settings.mrWhiteCount, Math.floor((totalPlayers - uCount - 1) / 2));
    const cCount = totalPlayers - uCount - wCount;

    const rolePool = [
      ...Array(uCount).fill("UNDERCOVER"),
      ...Array(wCount).fill("MR_WHITE"),
      ...Array(cCount).fill("CIVILIAN")
    ];

    // Shuffle roles (Fisher-Yates)
    for (let i = rolePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rolePool[i], rolePool[j]] = [rolePool[j], rolePool[i]];
    }

    // Assign to players
    room.players.forEach((player, idx) => {
      player.isAlive = true;
      player.hasRevealed = player.isBot; // bots automatically ready
      player.role = rolePool[idx];
      if (player.role === "CIVILIAN") {
        player.word = room.words.civilianWord;
      } else if (player.role === "UNDERCOVER") {
        player.word = room.words.undercoverWord;
      } else {
        player.word = null; // Mr. White has no word!
      }
      player.clues = [];
    });

    this.broadcastRoom(room);
  }

  playerRevealed({ roomCode, socketId }) {
    const room = this.getRoom(roomCode);
    if (!room || room.status !== "ROLE_REVEAL") return;

    const player = room.players.find(p => p.id === socketId);
    if (player) {
      player.hasRevealed = true;
    }

    const allReady = room.players.every(p => p.hasRevealed);
    if (allReady) {
      this.startCluePhase(room);
    } else {
      this.broadcastRoom(room);
    }
  }

  forceStartClues({ roomCode, socketId }) {
    const room = this.getRoom(roomCode);
    if (!room || room.status !== "ROLE_REVEAL") return;
    if (room.hostId !== socketId) throw new Error("Only the host can proceed");
    this.startCluePhase(room);
  }

  startCluePhase(room) {
    this.clearRoomTimer(room.code);
    room.status = "CLUE_PHASE";

    // Alive players shuffled for turn order
    const alivePlayers = room.players.filter(p => p.isAlive);
    const shuffledOrder = [...alivePlayers];
    for (let i = shuffledOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOrder[i], shuffledOrder[j]] = [shuffledOrder[j], shuffledOrder[i]];
    }

    room.turnOrder = shuffledOrder.map(p => p.id);
    room.currentTurnIndex = 0;

    this.broadcastRoom(room);
    this.setupTurn(room);
  }

  setupTurn(room) {
    this.clearRoomTimer(room.code);

    if (room.currentTurnIndex >= room.turnOrder.length) {
      // All alive players gave their clues for this cycle!
      this.startDiscussionPhase(room);
      return;
    }

    const currentTurnPlayerId = room.turnOrder[room.currentTurnIndex];
    const currentPlayer = room.players.find(p => p.id === currentTurnPlayerId);

    if (!currentPlayer || !currentPlayer.isAlive) {
      // Skip dead or invalid
      room.currentTurnIndex++;
      this.setupTurn(room);
      return;
    }

    // If current player is an AI bot, generate clue automatically
    if (currentPlayer.isBot) {
      const botThinkMs = 1500 + Math.random() * 2000;
      this.setRoomTimer(room.code, () => {
        this.executeBotClue(room, currentPlayer);
      }, botThinkMs);
    } else {
      // Set turn timer countdown for human
      const timeLimitMs = (room.settings.clueTimeLimit || 30) * 1000;
      this.setRoomTimer(room.code, () => {
        // Time expired, auto-pass or auto-submit
        this.submitClue({
          roomCode: room.code,
          socketId: currentPlayer.id,
          clue: "Hmm... 🤔",
          autoPassed: true
        });
      }, timeLimitMs);
    }

    this.broadcastRoom(room);
  }

  executeBotClue(room, botPlayer) {
    let clueText = "Interesting...";
    const usedClues = new Set(room.cluesThisRound.map(c => c.clue.toLowerCase()));

    if (botPlayer.role === "CIVILIAN") {
      const pool = (room.words.civilianBotClues || []).filter(c => !usedClues.has(c.toLowerCase()));
      clueText = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : "Essential";
    } else if (botPlayer.role === "UNDERCOVER") {
      const pool = (room.words.undercoverBotClues || []).filter(c => !usedClues.has(c.toLowerCase()));
      clueText = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : "Popular";
    } else {
      // Mr. White bluffs
      const pool = MR_WHITE_BLUFF_CLUES.filter(c => !usedClues.has(c.toLowerCase()));
      clueText = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : "Nice";
    }

    this.submitClue({
      roomCode: room.code,
      socketId: botPlayer.id,
      clue: clueText
    });
  }

  submitClue({ roomCode, socketId, clue, autoPassed }) {
    const room = this.getRoom(roomCode);
    if (!room || room.status !== "CLUE_PHASE") return;

    const currentTurnPlayerId = room.turnOrder[room.currentTurnIndex];
    if (currentTurnPlayerId !== socketId) {
      return; // Not this player's turn
    }

    const player = room.players.find(p => p.id === socketId);
    if (!player) return;

    const cleanClue = (clue || (autoPassed ? "Passed ⏱️" : "Mystery")).trim();
    const clueEntry = {
      id: `clue_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      playerId: player.id,
      playerName: player.name,
      avatar: player.avatar,
      clue: cleanClue,
      timestamp: Date.now()
    };

    room.cluesThisRound.push(clueEntry);
    player.clues.push(cleanClue);

    // Advance turn
    room.currentTurnIndex++;
    this.setupTurn(room);
  }

  startDiscussionPhase(room) {
    this.clearRoomTimer(room.code);
    room.status = "DISCUSSION_PHASE";

    const discDurationMs = (room.settings.discussionTimeLimit || 45) * 1000;
    this.setRoomTimer(room.code, () => {
      this.startVotingPhase(room);
    }, discDurationMs);

    this.broadcastRoom(room);
  }

  forceStartVoting({ roomCode, socketId }) {
    const room = this.getRoom(roomCode);
    if (!room || room.status !== "DISCUSSION_PHASE") return;
    if (room.hostId !== socketId) throw new Error("Only the host can start voting early");
    this.startVotingPhase(room);
  }

  startVotingPhase(room) {
    this.clearRoomTimer(room.code);
    room.status = "VOTING_PHASE";
    room.votes = {};

    // Schedule AI bot votes
    const aliveBots = room.players.filter(p => p.isAlive && p.isBot);
    const aliveTargets = room.players.filter(p => p.isAlive);

    aliveBots.forEach((bot, idx) => {
      setTimeout(() => {
        if (room.status !== "VOTING_PHASE") return;
        // Bot votes for someone else
        const validTargets = aliveTargets.filter(t => t.id !== bot.id);
        if (validTargets.length > 0) {
          const target = validTargets[Math.floor(Math.random() * validTargets.length)];
          this.castVote({
            roomCode: room.code,
            socketId: bot.id,
            targetId: target.id
          });
        }
      }, 1500 + idx * 800);
    });

    // 45s timer for all votes
    this.setRoomTimer(room.code, () => {
      this.concludeVoting(room);
    }, 45000);

    this.broadcastRoom(room);
  }

  castVote({ roomCode, socketId, targetId }) {
    const room = this.getRoom(roomCode);
    if (!room || room.status !== "VOTING_PHASE") return;

    const voter = room.players.find(p => p.id === socketId);
    const target = room.players.find(p => p.id === targetId);

    if (!voter || !voter.isAlive) return;
    if (!target || !target.isAlive) return;
    if (voter.id === target.id) return; // Cannot vote for yourself

    room.votes[voter.id] = target.id;

    // Check if all alive players have voted
    const alivePlayers = room.players.filter(p => p.isAlive);
    const allVoted = alivePlayers.every(p => !!room.votes[p.id]);

    if (allVoted) {
      this.clearRoomTimer(room.code);
      this.concludeVoting(room);
    } else {
      this.broadcastRoom(room);
    }
  }

  concludeVoting(room) {
    this.clearRoomTimer(room.code);

    // Tally votes
    const tally = {};
    Object.values(room.votes).forEach(targetId => {
      tally[targetId] = (tally[targetId] || 0) + 1;
    });

    let maxVotes = 0;
    let candidates = [];
    Object.entries(tally).forEach(([targetId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        candidates = [targetId];
      } else if (count === maxVotes) {
        candidates.push(targetId);
      }
    });

    // If nobody voted or tie with 0 votes, pick a random alive player or announce no elimination
    let eliminatedId = null;
    if (candidates.length === 1 && maxVotes > 0) {
      eliminatedId = candidates[0];
    } else if (candidates.length > 1) {
      // Tie breaker: random among tied suspects
      eliminatedId = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      const alive = room.players.filter(p => p.isAlive);
      eliminatedId = alive[Math.floor(Math.random() * alive.length)].id;
    }

    const eliminatedPlayer = room.players.find(p => p.id === eliminatedId);
    if (!eliminatedPlayer) {
      return;
    }

    room.eliminatedPlayer = {
      id: eliminatedPlayer.id,
      name: eliminatedPlayer.name,
      avatar: eliminatedPlayer.avatar,
      role: eliminatedPlayer.role,
      voteCount: maxVotes
    };

    eliminatedPlayer.isAlive = false;
    room.eliminationHistory.push(room.eliminatedPlayer);

    // Check if eliminated player is Mr. White
    if (eliminatedPlayer.role === "MR_WHITE") {
      room.status = "MRWHITE_GUESS";
      this.broadcastRoom(room);

      if (eliminatedPlayer.isBot) {
        // Bot Mr. White attempts a guess
        this.setRoomTimer(room.code, () => {
          // 40% chance bot Mr White guesses correctly if civilian clue matched
          const isLucky = Math.random() < 0.45;
          const guess = isLucky ? room.words.civilianWord : "Banana";
          this.submitMrWhiteGuess({
            roomCode: room.code,
            socketId: eliminatedPlayer.id,
            guess
          });
        }, 3000);
      } else {
        // Human Mr. White gets 35 seconds to guess
        this.setRoomTimer(room.code, () => {
          this.submitMrWhiteGuess({
            roomCode: room.code,
            socketId: eliminatedPlayer.id,
            guess: "" // time expired
          });
        }, 35000);
      }
      return;
    }

    // Normal check
    this.checkWinConditions(room);
  }

  submitMrWhiteGuess({ roomCode, socketId, guess }) {
    const room = this.getRoom(roomCode);
    if (!room || room.status !== "MRWHITE_GUESS") return;
    this.clearRoomTimer(room.code);

    const mrWhite = room.players.find(p => p.id === socketId && p.role === "MR_WHITE");
    if (!mrWhite) return;

    const normalizedGuess = (guess || "").trim().toLowerCase();
    const normalizedTarget = room.words.civilianWord.trim().toLowerCase();

    // Check match
    const isCorrect = normalizedGuess === normalizedTarget ||
      (normalizedGuess.length > 3 && normalizedTarget.includes(normalizedGuess));

    if (isCorrect) {
      // Mr. White wins!
      room.roundWinner = "MR_WHITE";
      room.winReason = `${mrWhite.name} (Mr. White) correctly guessed the Civilians' secret word "${room.words.civilianWord}"! 🎩🎯`;
      this.awardScores(room, "MR_WHITE", mrWhite.id);
      room.status = "ROUND_SUMMARY";
      this.broadcastRoom(room);
      return;
    } else {
      // Mr. White guessed wrong
      room.winReason = `${mrWhite.name} (Mr. White) guessed "${guess || "nothing"}", which was incorrect! The secret word was "${room.words.civilianWord}".`;
      // Check normal win condition
      this.checkWinConditions(room);
    }
  }

  checkWinConditions(room) {
    const aliveUndercovers = room.players.filter(p => p.isAlive && p.role === "UNDERCOVER").length;
    const aliveMrWhites = room.players.filter(p => p.isAlive && p.role === "MR_WHITE").length;
    const aliveCivilians = room.players.filter(p => p.isAlive && p.role === "CIVILIAN").length;

    // 1. Civilians win if all Undercovers & Mr. White are eliminated
    if (aliveUndercovers === 0 && aliveMrWhites === 0) {
      room.roundWinner = "CIVILIANS";
      room.winReason = "Civilians successfully eliminated all Undercovers and Mr. White! 🛡️🎉";
      this.awardScores(room, "CIVILIANS");
      room.status = "ROUND_SUMMARY";
      this.broadcastRoom(room);
      return;
    }

    // 2. Undercovers win if Undercovers >= surviving Civilians
    if (aliveUndercovers >= aliveCivilians) {
      room.roundWinner = "UNDERCOVER";
      room.winReason = "Undercover players outnumber or equal surviving Civilians! Infiltration complete! 🕵️‍♂️💥";
      this.awardScores(room, "UNDERCOVER");
      room.status = "ROUND_SUMMARY";
      this.broadcastRoom(room);
      return;
    }

    // 3. Mr. White survival win if only 2 players left and Mr White is alive
    if (aliveCivilians + aliveUndercovers === 1 && aliveMrWhites >= 1) {
      room.roundWinner = "MR_WHITE";
      room.winReason = "Mr. White survived unnoticed to the very end! Pure deception! 🎩✨";
      this.awardScores(room, "MR_WHITE");
      room.status = "ROUND_SUMMARY";
      this.broadcastRoom(room);
      return;
    }

    // Game continues! Start another clue phase with remaining alive players
    this.startCluePhase(room);
  }

  awardScores(room, winnerRole, specialWinnerId = null) {
    room.roundScoresEarned = {};

    room.players.forEach(player => {
      let points = 0;

      if (winnerRole === "CIVILIANS") {
        if (player.role === "CIVILIAN") {
          points = player.isAlive ? 6 : 3;
        }
      } else if (winnerRole === "UNDERCOVER") {
        if (player.role === "UNDERCOVER") {
          points = player.isAlive ? 10 : 5;
        }
      } else if (winnerRole === "MR_WHITE") {
        if (player.role === "MR_WHITE") {
          points = specialWinnerId === player.id ? 12 : 15;
        }
      }

      player.score += points;
      room.roundScoresEarned[player.id] = points;
    });
  }

  nextRound({ roomCode, socketId }) {
    const room = this.getRoom(roomCode);
    if (!room) throw new Error("Room not found");
    if (room.hostId !== socketId) throw new Error("Only the host can start the next round");

    if (room.currentRound >= room.settings.rounds) {
      // Game Over!
      room.status = "GAME_OVER";
      this.broadcastRoom(room);
    } else {
      this.startRound(room);
    }
  }

  rematch({ roomCode, socketId }) {
    const room = this.getRoom(roomCode);
    if (!room) throw new Error("Room not found");
    if (room.hostId !== socketId) throw new Error("Only the host can start a rematch");

    room.status = "LOBBY";
    room.currentRound = 0;
    room.usedPairs = [];
    room.players.forEach(p => {
      p.score = 0;
      p.isAlive = true;
      p.hasRevealed = false;
      p.role = null;
      p.word = null;
      p.clues = [];
    });

    this.broadcastRoom(room);
  }

  addChatMessage({ roomCode, socketId, message }) {
    const room = this.getRoom(roomCode);
    if (!room) return;
    const player = room.players.find(p => p.id === socketId);
    if (!player) return;

    const chatItem = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      senderId: player.id,
      senderName: player.name,
      avatar: player.avatar,
      text: (message || "").trim(),
      timestamp: Date.now()
    };

    room.chatMessages.push(chatItem);
    if (room.chatMessages.length > 50) {
      room.chatMessages.shift();
    }

    this.io.to(room.code).emit("chat:message", chatItem);
  }

  handleDisconnect(socketId) {
    const room = this.getRoomBySocket(socketId);
    if (!room) return;

    this.playerRoomMap.delete(socketId);

    // If lobby, remove player
    if (room.status === "LOBBY") {
      room.players = room.players.filter(p => p.id !== socketId);

      // If host disconnected, assign new host or delete room if empty
      if (room.players.length === 0) {
        this.clearRoomTimer(room.code);
        this.rooms.delete(room.code);
        return;
      }

      if (room.hostId === socketId) {
        // Pick first human player as host
        const firstHuman = room.players.find(p => !p.isBot) || room.players[0];
        firstHuman.isHost = true;
        room.hostId = firstHuman.id;
      }

      this.broadcastRoom(room);
    } else {
      // In-game disconnect: mark as disconnected or eliminated if current turn
      const player = room.players.find(p => p.id === socketId);
      if (player) {
        player.isDisconnected = true;
        // If it was this player's clue turn, advance
        if (room.status === "CLUE_PHASE" && room.turnOrder[room.currentTurnIndex] === socketId) {
          this.submitClue({
            roomCode: room.code,
            socketId,
            clue: "Disconnected 👋",
            autoPassed: true
          });
        }
      }
      this.broadcastRoom(room);
    }
  }

  /**
   * Sanitizes room state so players only see their own secret role & word,
   * unless in ROUND_SUMMARY or GAME_OVER where all are revealed!
   */
  getSanitizedState(room, socketId) {
    const isRevealAll = room.status === "ROUND_SUMMARY" || room.status === "GAME_OVER";

    return {
      code: room.code,
      hostId: room.hostId,
      status: room.status,
      settings: room.settings,
      currentRound: room.currentRound,
      words: isRevealAll
        ? {
            civilianWord: room.words.civilianWord,
            undercoverWord: room.words.undercoverWord,
            category: room.words.category
          }
        : {
            category: room.words.category
          },
      players: room.players.map(p => {
        const isSelf = p.id === socketId;
        return {
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          isHost: p.isHost,
          isBot: p.isBot,
          score: p.score,
          isAlive: p.isAlive,
          hasRevealed: p.hasRevealed,
          role: (isSelf || isRevealAll) ? p.role : null,
          word: (isSelf || isRevealAll) ? p.word : null,
          clues: p.clues,
          isDisconnected: p.isDisconnected
        };
      }),
      turnOrder: room.turnOrder,
      currentTurnIndex: room.currentTurnIndex,
      currentTurnPlayerId: room.turnOrder[room.currentTurnIndex] || null,
      cluesThisRound: room.cluesThisRound,
      votes: isRevealAll || room.status === "VOTING_PHASE"
        ? room.votes
        : {},
      votedPlayerIds: Object.keys(room.votes),
      eliminatedPlayer: room.eliminatedPlayer,
      eliminationHistory: room.eliminationHistory,
      roundWinner: room.roundWinner,
      winReason: room.winReason,
      roundScoresEarned: room.roundScoresEarned,
      chatMessages: room.chatMessages
    };
  }

  broadcastRoom(room) {
    // Send customized state to each socket in the room so secrets remain confidential
    room.players.forEach(player => {
      if (!player.isBot) {
        const state = this.getSanitizedState(room, player.id);
        this.io.to(player.id).emit("room:state", state);
      }
    });
  }
}

module.exports = GameManager;
