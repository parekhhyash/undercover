const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const GameManager = require("./managers/gameManager");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

app.use(cors());
app.use(express.json());

// Initialize game manager
const gameManager = new GameManager(io);

// Non-blocking database check with short timeout
pool.query("SELECT NOW()")
  .then(res => {
    console.log("Database connected at:", res.rows[0].now);
  })
  .catch(err => {
    console.warn("Postgres DB not connected (running in high-performance in-memory mode):", err.message || err);
  });

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Undercover Game Server",
    activeRooms: gameManager.rooms.size
  });
});

// REST API for rooms
app.post("/api/rooms", (req, res) => {
  try {
    const { hostName, avatar } = req.body;
    if (!hostName) {
      return res.status(400).json({ message: "Host name is required" });
    }
    // Temporary host placeholder until socket connects
    const tempId = `init_${Date.now()}`;
    const room = gameManager.createRoom({
      hostName,
      avatar: avatar || "🕵️",
      socketId: tempId
    });

    res.status(201).json({
      roomCode: room.code,
      hostName,
      status: room.status
    });
  } catch (error) {
    console.error("Error creating room via REST:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

app.get("/api/rooms/:code", (req, res) => {
  const room = gameManager.getRoom(req.params.code);
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  res.json({
    code: room.code,
    status: room.status,
    playerCount: room.players.length,
    settings: room.settings
  });
});

// WebSocket Events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Create room
  socket.on("room:create", ({ hostName, avatar }, callback) => {
    try {
      const room = gameManager.createRoom({
        hostName: hostName || "Host",
        avatar: avatar || "🕵️",
        socketId: socket.id
      });
      socket.join(room.code);
      const state = gameManager.getSanitizedState(room, socket.id);
      if (typeof callback === "function") callback({ success: true, room: state });
      socket.emit("room:state", state);
    } catch (err) {
      console.error("room:create error:", err);
      if (typeof callback === "function") callback({ success: false, message: err.message });
    }
  });

  // Join room
  socket.on("room:join", ({ roomCode, playerName, avatar }, callback) => {
    try {
      const room = gameManager.joinRoom({
        roomCode,
        playerName: playerName || "Player",
        avatar: avatar || "🐱",
        socketId: socket.id
      });
      socket.join(room.code);
      if (typeof callback === "function") callback({ success: true, roomCode: room.code });
      gameManager.broadcastRoom(room);
    } catch (err) {
      console.error("room:join error:", err);
      if (typeof callback === "function") callback({ success: false, message: err.message });
    }
  });

  // Add bot
  socket.on("room:add_bot", ({ roomCode }, callback) => {
    try {
      const room = gameManager.addBot({ roomCode, socketId: socket.id });
      gameManager.broadcastRoom(room);
      if (typeof callback === "function") callback({ success: true });
    } catch (err) {
      if (typeof callback === "function") callback({ success: false, message: err.message });
    }
  });

  // Kick player
  socket.on("room:kick_player", ({ roomCode, targetId }, callback) => {
    try {
      const room = gameManager.kickPlayer({ roomCode, socketId: socket.id, targetId });
      gameManager.broadcastRoom(room);
      if (typeof callback === "function") callback({ success: true });
    } catch (err) {
      if (typeof callback === "function") callback({ success: false, message: err.message });
    }
  });

  // Update room settings
  socket.on("room:update_settings", ({ roomCode, settings }, callback) => {
    try {
      const room = gameManager.updateSettings({ roomCode, socketId: socket.id, settings });
      gameManager.broadcastRoom(room);
      if (typeof callback === "function") callback({ success: true });
    } catch (err) {
      if (typeof callback === "function") callback({ success: false, message: err.message });
    }
  });

  // Start game
  socket.on("room:start", ({ roomCode }, callback) => {
    try {
      const room = gameManager.startGame({ roomCode, socketId: socket.id });
      if (typeof callback === "function") callback({ success: true });
    } catch (err) {
      if (typeof callback === "function") callback({ success: false, message: err.message });
    }
  });

  // Role revealed / ready
  socket.on("game:reveal_done", ({ roomCode }) => {
    try {
      gameManager.playerRevealed({ roomCode, socketId: socket.id });
    } catch (err) {
      console.error("game:reveal_done error:", err);
    }
  });

  // Force start clues (host override)
  socket.on("game:force_start_clues", ({ roomCode }) => {
    try {
      gameManager.forceStartClues({ roomCode, socketId: socket.id });
    } catch (err) {
      console.error("game:force_start_clues error:", err);
    }
  });

  // Submit clue
  socket.on("game:submit_clue", ({ roomCode, clue }, callback) => {
    try {
      gameManager.submitClue({ roomCode, socketId: socket.id, clue });
      if (typeof callback === "function") callback({ success: true });
    } catch (err) {
      if (typeof callback === "function") callback({ success: false, message: err.message });
    }
  });

  // Force start voting (host override)
  socket.on("game:force_start_voting", ({ roomCode }) => {
    try {
      gameManager.forceStartVoting({ roomCode, socketId: socket.id });
    } catch (err) {
      console.error("game:force_start_voting error:", err);
    }
  });

  // Cast vote
  socket.on("game:cast_vote", ({ roomCode, targetId }) => {
    try {
      gameManager.castVote({ roomCode, socketId: socket.id, targetId });
    } catch (err) {
      console.error("game:cast_vote error:", err);
    }
  });

  // Mr. White Guess
  socket.on("game:mrwhite_guess", ({ roomCode, guess }, callback) => {
    try {
      gameManager.submitMrWhiteGuess({ roomCode, socketId: socket.id, guess });
      if (typeof callback === "function") callback({ success: true });
    } catch (err) {
      if (typeof callback === "function") callback({ success: false, message: err.message });
    }
  });

  // Next Round
  socket.on("game:next_round", ({ roomCode }, callback) => {
    try {
      gameManager.nextRound({ roomCode, socketId: socket.id });
      if (typeof callback === "function") callback({ success: true });
    } catch (err) {
      if (typeof callback === "function") callback({ success: false, message: err.message });
    }
  });

  // Rematch
  socket.on("game:rematch", ({ roomCode }, callback) => {
    try {
      gameManager.rematch({ roomCode, socketId: socket.id });
      if (typeof callback === "function") callback({ success: true });
    } catch (err) {
      if (typeof callback === "function") callback({ success: false, message: err.message });
    }
  });

  // Chat message
  socket.on("chat:send", ({ roomCode, message }) => {
    try {
      gameManager.addChatMessage({ roomCode, socketId: socket.id, message });
    } catch (err) {
      console.error("chat:send error:", err);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    gameManager.handleDisconnect(socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🎮 Undercover Game Server running on port ${PORT}`);
});
