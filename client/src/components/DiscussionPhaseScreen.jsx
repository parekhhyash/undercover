import React, { useState } from "react";
import sounds from "../utils/soundEffects";

export default function DiscussionPhaseScreen({
  room,
  socketId,
  onForceStartVoting,
  onSendChatMessage
}) {
  const [chatInput, setChatInput] = useState("");
  const isHost = room.hostId === socketId;
  const clues = room.cluesThisRound || [];
  const messages = room.chatMessages || [];

  const handleSendChat = (e) => {
    e.preventDefault();
    const clean = chatInput.trim();
    if (!clean) return;
    sounds.playPop();
    onSendChatMessage(clean);
    setChatInput("");
  };

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", width: "100%" }}>
      {/* Discussion Header */}
      <div className="glass-panel" style={{ textAlign: "center", marginBottom: "1.2rem" }}>
        <span className="pill-tag pill-host" style={{ fontSize: "0.85rem", marginBottom: "0.4rem" }}>
          Round {room.currentRound} • Investigation Time
        </span>
        <h2 style={{ fontSize: "1.8rem", color: "#fff", margin: "0.3rem 0" }}>
          🗣️ Question Suspicious Clues!
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Who gave a strange clue? Who might be the Undercover or Mr. White? Debate before voting!
        </p>

        {isHost && (
          <button
            className="btn-accent"
            style={{ marginTop: "1rem", fontSize: "1rem", padding: "0.75rem 1.8rem" }}
            onClick={() => { sounds.playDing(); onForceStartVoting(); }}
          >
            Ready to Accuse? Start Voting Now! 🗳️
          </button>
        )}
      </div>

      {/* Clues Summary Board */}
      <div className="glass-panel" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          🔍 Clues Evidence Board
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "0.85rem"
        }}>
          {clues.map((c) => {
            const isSelf = c.playerId === socketId;
            return (
              <div
                key={c.id}
                style={{
                  background: isSelf ? "rgba(108, 92, 231, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${isSelf ? "var(--primary)" : "var(--border-glass)"}`,
                  borderRadius: "18px",
                  padding: "0.85rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem"
                }}
              >
                <span style={{ fontSize: "2rem" }}>{c.avatar}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    {c.playerName} {isSelf && "(You)"}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--accent-yellow)",
                    marginTop: "0.1rem"
                  }}>
                    "{c.clue}"
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Discussion Chat */}
      <div className="glass-panel">
        <h3 style={{ fontSize: "1.15rem", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          💬 Investigation Chat & Accusations
        </h3>

        <div style={{
          height: "220px",
          overflowY: "auto",
          background: "rgba(0,0,0,0.3)",
          border: "1px solid var(--border-glass)",
          borderRadius: "16px",
          padding: "0.75rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          marginBottom: "0.8rem"
        }}>
          {messages.length === 0 ? (
            <div style={{ margin: "auto", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              No accusations yet. Ask someone why they gave that clue!
            </div>
          ) : (
            messages.map((m) => {
              const isSelf = m.senderId === socketId;
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isSelf ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    background: isSelf ? "var(--primary)" : "rgba(255,255,255,0.1)",
                    borderRadius: "14px",
                    padding: "0.5rem 0.85rem",
                    fontSize: "0.95rem"
                  }}
                >
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, opacity: 0.8, display: "block" }}>
                    {m.avatar} {m.senderName}
                  </span>
                  <span>{m.text}</span>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSendChat} style={{ display: "flex", gap: "0.6rem" }}>
          <input
            type="text"
            className="input-field"
            placeholder="Type your defense, suspicion, or joke..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            style={{ flex: 1, padding: "0.7rem 1rem" }}
          />
          <button type="submit" className="btn-secondary" disabled={!chatInput.trim()}>
            Send 💬
          </button>
        </form>
      </div>
    </div>
  );
}
