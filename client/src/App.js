import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Header from "./components/Header";
import RulesModal from "./components/RulesModal";
import HomeJoinCreate from "./components/HomeJoinCreate";
import LobbyScreen from "./components/LobbyScreen";
import RoleRevealScreen from "./components/RoleRevealScreen";
import CluePhaseScreen from "./components/CluePhaseScreen";
import DiscussionPhaseScreen from "./components/DiscussionPhaseScreen";
import VotingPhaseScreen from "./components/VotingPhaseScreen";
import MrWhiteGuessModal from "./components/MrWhiteGuessModal";
import RoundSummaryScreen from "./components/RoundSummaryScreen";
import GameOverScreen from "./components/GameOverScreen";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

function App() {
  const [socketId, setSocketId] = useState("");
  const [connected, setConnected] = useState(false);
  const [roomState, setRoomState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRules, setShowRules] = useState(false);

  const socketRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("Connected to game server:", newSocket.id);
      setConnected(true);
      setSocketId(newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
    });

    newSocket.on("room:state", (state) => {
      console.log("Received room state:", state.status, state);
      setRoomState(state);
      setLoading(false);
      setError("");
    });

    newSocket.on("chat:message", (msg) => {
      setRoomState((prev) => {
        if (!prev) return prev;
        const messages = prev.chatMessages || [];
        if (messages.some((m) => m.id === msg.id)) return prev;
        return {
          ...prev,
          chatMessages: [...messages, msg]
        };
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handlers for server communication
  const handleCreateRoom = ({ hostName, avatar }) => {
    if (!socketRef.current) return;
    setLoading(true);
    setError("");

    socketRef.current.emit("room:create", { hostName, avatar }, (res) => {
      if (!res.success) {
        setError(res.message || "Failed to create room");
        setLoading(false);
      } else {
        // Update URL query parameter without full reload
        const newUrl = `${window.location.pathname}?room=${res.room.code}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
      }
    });
  };

  const handleJoinRoom = ({ roomCode, playerName, avatar }) => {
    if (!socketRef.current) return;
    setLoading(true);
    setError("");

    socketRef.current.emit("room:join", { roomCode, playerName, avatar }, (res) => {
      if (!res.success) {
        setError(res.message || "Failed to join room");
        setLoading(false);
      } else {
        const newUrl = `${window.location.pathname}?room=${res.roomCode}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
      }
    });
  };

  const handleUpdateSettings = (settings) => {
    if (!socketRef.current || !roomState) return;
    socketRef.current.emit("room:update_settings", {
      roomCode: roomState.code,
      settings
    });
  };

  const handleAddBot = () => {
    if (!socketRef.current || !roomState) return;
    socketRef.current.emit("room:add_bot", { roomCode: roomState.code });
  };

  const handleKickPlayer = (targetId) => {
    if (!socketRef.current || !roomState) return;
    socketRef.current.emit("room:kick_player", {
      roomCode: roomState.code,
      targetId
    });
  };

  const handleStartGame = () => {
    if (!socketRef.current || !roomState) return;
    socketRef.current.emit("room:start", { roomCode: roomState.code }, (res) => {
      if (res && !res.success) {
        alert(res.message);
      }
    });
  };

  const handleRevealDone = () => {
    if (!socketRef.current || !roomState) return;
    socketRef.current.emit("game:reveal_done", { roomCode: roomState.code });
  };

  const handleForceStartClues = () => {
    if (!socketRef.current || !roomState) return;
    socketRef.current.emit("game:force_start_clues", { roomCode: roomState.code });
  };

  const handleSubmitClue = (clue) => {
    if (!socketRef.current || !roomState) return;
    socketRef.current.emit("game:submit_clue", {
      roomCode: roomState.code,
      clue
    });
  };

  const handleForceStartVoting = () => {
    if (!socketRef.current || !roomState) return;
    socketRef.current.emit("game:force_start_voting", { roomCode: roomState.code });
  };

  const handleCastVote = (targetId) => {
    if (!socketRef.current || !roomState) return;
    socketRef.current.emit("game:cast_vote", {
      roomCode: roomState.code,
      targetId
    });
  };

  const handleSubmitMrWhiteGuess = (guess) => {
    if (!socketRef.current || !roomState) return;
    socketRef.current.emit("game:mrwhite_guess", {
      roomCode: roomState.code,
      guess
    });
  };

  const handleNextRound = () => {
    if (!socketRef.current || !roomState) return;
    socketRef.current.emit("game:next_round", { roomCode: roomState.code });
  };

  const handleRematch = () => {
    if (!socketRef.current || !roomState) return;
    socketRef.current.emit("game:rematch", { roomCode: roomState.code });
  };

  const handleSendChatMessage = (message) => {
    if (!socketRef.current || !roomState) return;
    socketRef.current.emit("chat:send", {
      roomCode: roomState.code,
      message
    });
  };

  const handleLeaveRoom = () => {
    setRoomState(null);
    window.history.pushState({}, "", window.location.pathname);
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.connect();
    }
  };

  // Determine current game view
  const renderGameContent = () => {
    if (!roomState) {
      return (
        <HomeJoinCreate
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          loading={loading}
          error={error}
        />
      );
    }

    switch (roomState.status) {
      case "LOBBY":
        return (
          <LobbyScreen
            room={roomState}
            socketId={socketId}
            onUpdateSettings={handleUpdateSettings}
            onAddBot={handleAddBot}
            onKickPlayer={handleKickPlayer}
            onStartGame={handleStartGame}
          />
        );

      case "ROLE_REVEAL":
        return (
          <RoleRevealScreen
            room={roomState}
            socketId={socketId}
            onRevealDone={handleRevealDone}
            onForceStartClues={handleForceStartClues}
          />
        );

      case "CLUE_PHASE":
        return (
          <CluePhaseScreen
            room={roomState}
            socketId={socketId}
            onSubmitClue={handleSubmitClue}
          />
        );

      case "DISCUSSION_PHASE":
        return (
          <DiscussionPhaseScreen
            room={roomState}
            socketId={socketId}
            onForceStartVoting={handleForceStartVoting}
            onSendChatMessage={handleSendChatMessage}
          />
        );

      case "VOTING_PHASE":
        return (
          <VotingPhaseScreen
            room={roomState}
            socketId={socketId}
            onCastVote={handleCastVote}
          />
        );

      case "MRWHITE_GUESS":
        return (
          <>
            <VotingPhaseScreen
              room={roomState}
              socketId={socketId}
              onCastVote={() => {}}
            />
            <MrWhiteGuessModal
              room={roomState}
              socketId={socketId}
              onSubmitGuess={handleSubmitMrWhiteGuess}
            />
          </>
        );

      case "ROUND_SUMMARY":
        return (
          <RoundSummaryScreen
            room={roomState}
            socketId={socketId}
            onNextRound={handleNextRound}
          />
        );

      case "GAME_OVER":
        return (
          <GameOverScreen
            room={roomState}
            socketId={socketId}
            onRematch={handleRematch}
          />
        );

      default:
        return <div>Unknown game status: {roomState.status}</div>;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        room={roomState}
        onOpenRules={() => setShowRules(true)}
        onLeaveRoom={handleLeaveRoom}
      />

      {/* Connection notice if offline */}
      {!connected && (
        <div style={{
          background: "rgba(255, 165, 2, 0.2)",
          border: "1px solid var(--accent-yellow)",
          color: "var(--accent-yellow)",
          borderRadius: "14px",
          padding: "0.6rem 1rem",
          marginBottom: "1rem",
          textAlign: "center",
          fontWeight: 700,
          fontSize: "0.9rem"
        }}>
          📡 Connecting to game server...
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {renderGameContent()}
      </main>

      {/* Rules Modal */}
      <RulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />
    </div>
  );
}

export default App;
