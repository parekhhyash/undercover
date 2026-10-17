import React, { useState, useEffect } from "react";
import sounds from "../utils/soundEffects";

const AVATARS = ["🕵️", "🐱", "🦊", "🤖", "🐻", "👽", "🐼", "🦁", "🐨", "🥷", "🧙", "🐲", "🐰", "👻", "🏴‍☠️", "⭐"];

export default function HomeJoinCreate({ onCreateRoom, onJoinRoom, loading, error }) {
  const [activeTab, setActiveTab] = useState("create"); // 'create' or 'join'
  const [playerName, setPlayerName] = useState(localStorage.getItem("undercover_player_name") || "");
  const [selectedAvatar, setSelectedAvatar] = useState(
    localStorage.getItem("undercover_player_avatar") || AVATARS[0]
  );
  const [gameMode, setGameMode] = useState("ONLINE"); // 'ONLINE' or 'OFFLINE'
  const [roomCode, setRoomCode] = useState("");

  // Check URL query parameters for ?room=CODE
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("room") || params.get("code");
    if (roomParam) {
      setRoomCode(roomParam.toUpperCase());
      setActiveTab("join");
    }
  }, []);

  const handleAvatarSelect = (avatar) => {
    sounds.playPop();
    setSelectedAvatar(avatar);
    localStorage.setItem("undercover_player_avatar", avatar);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setPlayerName(val);
    localStorage.setItem("undercover_player_name", val);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    sounds.playPop();
    const finalName = playerName.trim() || "Host Agent";
    onCreateRoom({ hostName: finalName, avatar: selectedAvatar, gameMode });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    sounds.playPop();
    const cleanCode = roomCode.trim().toUpperCase();
    if (!cleanCode) return;
    const finalName = playerName.trim() || "Agent";
    onJoinRoom({ roomCode: cleanCode, playerName: finalName, avatar: selectedAvatar });
  };

  return (
    <div style={{ maxWidth: "520px", margin: "1rem auto", width: "100%" }}>
      {/* Hero Welcome Card */}
      <div className="glass-panel" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>🕵️‍♂️🔍🎭</div>
        <h1 style={{ fontSize: "2.2rem", marginBottom: "0.4rem" }}>Undercover</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
          The ultimate social deduction party game! Bluff, investigate, and uncover the secret infiltrators.
        </p>

        {/* Tab switch */}
        <div style={{
          display: "flex",
          background: "rgba(0,0,0,0.35)",
          borderRadius: "16px",
          padding: "0.35rem",
          marginTop: "1.5rem",
          border: "1px solid var(--border-glass)"
        }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "12px",
              background: activeTab === "create" ? "var(--primary)" : "transparent",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem"
            }}
            onClick={() => { sounds.playPop(); setActiveTab("create"); }}
          >
            Create Room 🌟
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "12px",
              background: activeTab === "join" ? "var(--primary)" : "transparent",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem"
            }}
            onClick={() => { sounds.playPop(); setActiveTab("join"); }}
          >
            Join Room 🔑
          </button>
        </div>
      </div>

      {/* Action Form Panel */}
      <div className="glass-panel">
        {error && (
          <div style={{
            background: "rgba(255, 71, 87, 0.2)",
            border: "1px solid var(--accent-red)",
            borderRadius: "14px",
            padding: "0.8rem 1rem",
            marginBottom: "1.2rem",
            color: "#ff6b81",
            fontWeight: 600,
            fontSize: "0.95rem"
          }}>
            ⚠️ {error}
          </div>
        )}

        {activeTab === "create" ? (
          <form onSubmit={handleCreate}>
            <div className="input-group">
              <label className="input-label">Your Codename / Nickname</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Detective Fox, Sarah, Alex"
                value={playerName}
                onChange={handleNameChange}
                maxLength={18}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Choose Your Avatar</label>
              <div className="avatar-picker-grid">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    className={`avatar-choice ${selectedAvatar === av ? "selected" : ""}`}
                    onClick={() => handleAvatarSelect(av)}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Mode Selection */}
            <div className="input-group" style={{ marginTop: "0.8rem" }}>
              <label className="input-label">Select Game Mode</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginTop: "0.3rem" }}>
                <div
                  style={{
                    background: gameMode === "ONLINE" ? "rgba(108, 92, 231, 0.28)" : "rgba(255, 255, 255, 0.05)",
                    border: `2px solid ${gameMode === "ONLINE" ? "var(--primary)" : "var(--border-glass)"}`,
                    borderRadius: "16px",
                    padding: "0.85rem 0.6rem",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    boxShadow: gameMode === "ONLINE" ? "0 0 15px rgba(108, 92, 231, 0.4)" : "none"
                  }}
                  onClick={() => { sounds.playPop(); setGameMode("ONLINE"); }}
                >
                  <div style={{ fontSize: "1.8rem" }}>🌐</div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#fff", marginTop: "0.2rem" }}>
                    Online Mode
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem", lineHeight: 1.3 }}>
                    Remote: Type clues & use chat
                  </div>
                </div>

                <div
                  style={{
                    background: gameMode === "OFFLINE" ? "rgba(16, 172, 132, 0.28)" : "rgba(255, 255, 255, 0.05)",
                    border: `2px solid ${gameMode === "OFFLINE" ? "var(--role-civilian)" : "var(--border-glass)"}`,
                    borderRadius: "16px",
                    padding: "0.85rem 0.6rem",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    boxShadow: gameMode === "OFFLINE" ? "0 0 15px rgba(16, 172, 132, 0.4)" : "none"
                  }}
                  onClick={() => { sounds.playPop(); setGameMode("OFFLINE"); }}
                >
                  <div style={{ fontSize: "1.8rem" }}>👥</div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#fff", marginTop: "0.2rem" }}>
                    Offline Mode
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem", lineHeight: 1.3 }}>
                    In-Person: Say clues out loud!
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={gameMode === "OFFLINE" ? "btn-emerald" : "btn-accent"}
              style={{ width: "100%", marginTop: "1rem", fontSize: "1.15rem" }}
              disabled={loading}
            >
              {loading
                ? "Creating Secret Room..."
                : `Create ${gameMode === "OFFLINE" ? "Offline 👥" : "Online 🌐"} Room & Host 👑`}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin}>
            <div className="input-group">
              <label className="input-label">6-Character Room Code</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. LION42"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={8}
                style={{ textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700 }}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Your Codename / Nickname</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Mystery Panda, Jordan"
                value={playerName}
                onChange={handleNameChange}
                maxLength={18}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Choose Your Avatar</label>
              <div className="avatar-picker-grid">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    className={`avatar-choice ${selectedAvatar === av ? "selected" : ""}`}
                    onClick={() => handleAvatarSelect(av)}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", marginTop: "1rem", fontSize: "1.15rem" }}
              disabled={loading || !roomCode.trim()}
            >
              {loading ? "Joining Room..." : "Join Game Room 🚀"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
