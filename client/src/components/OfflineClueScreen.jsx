import React, { useState } from "react";
import sounds from "../utils/soundEffects";

export default function OfflineClueScreen({ room, socketId, onForceStartVoting }) {
  const [peekOpen, setPeekOpen] = useState(false);

  const me = (room.players || []).find((p) => p.id === socketId);
  const alivePlayers = (room.players || []).filter((p) => p.isAlive);
  const isHost = room.hostId === socketId;

  const handleStartVoting = () => {
    sounds.playDing();
    onForceStartVoting();
  };

  return (
    <div style={{ maxWidth: "740px", margin: "0 auto", width: "100%" }}>
      {/* Top Banner with Category & Word Peek */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.2rem",
          background: "rgba(0,0,0,0.3)",
          padding: "0.6rem 1rem",
          borderRadius: "16px",
          border: "1px solid var(--border-glass)",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span className="pill-tag pill-host">Round {room.currentRound}</span>
          <span className="pill-tag pill-civilian" style={{ fontSize: "0.75rem" }}>
            👥 Offline Mode
          </span>
          {room.words?.category && (
            <span style={{ fontSize: "0.9rem", color: "var(--accent-yellow)", fontWeight: 600 }}>
              📁 Category: {room.words.category}
            </span>
          )}
        </div>

        {/* Peek Secret Word Button */}
        <button
          className="btn-secondary"
          style={{ padding: "0.4rem 0.85rem", fontSize: "0.85rem" }}
          onClick={() => {
            sounds.playPop();
            setPeekOpen(!peekOpen);
          }}
        >
          {peekOpen ? "🙈 Hide Word" : "👁️ Peek My Word"}
        </button>
      </div>

      {/* Peek Drawer */}
      {peekOpen && me && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(16, 172, 132, 0.25) 0%, rgba(108, 92, 231, 0.25) 100%)",
            border: "2px solid var(--role-civilian)",
            borderRadius: "18px",
            padding: "1rem",
            marginBottom: "1.2rem",
            textAlign: "center",
            boxShadow: "0 0 25px rgba(16, 172, 132, 0.3)",
            animation: "slideInUp 0.2s ease"
          }}
        >
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Confidential Word Reminder (Keep Screen Private):
          </span>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#fff",
              marginTop: "0.2rem"
            }}
          >
            {me.word ? me.word : "NO WORD (Mr. White) 🎩"}
          </div>
        </div>
      )}

      {/* Main Verbal Clue Guidance Hero */}
      <div
        className="glass-panel"
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          background: "linear-gradient(145deg, rgba(28, 20, 56, 0.85) 0%, rgba(16, 172, 132, 0.15) 100%)",
          border: "2px solid rgba(16, 172, 132, 0.4)"
        }}
      >
        <span style={{ fontSize: "3.5rem", display: "block", marginBottom: "0.3rem" }}>
          🗣️💬🎭
        </span>
        <h2 style={{ fontSize: "2rem", color: "#fff", marginBottom: "0.4rem" }}>
          Speak Your Clues Out Loud!
        </h2>
        <p
          style={{
            color: "#dcdde1",
            fontSize: "1.05rem",
            maxWidth: "540px",
            margin: "0 auto 1.2rem auto",
            lineHeight: 1.5
          }}
        >
          Go around the room in order. Each player says <strong>ONE word</strong> describing their secret word out loud.
          Bluff, observe reactions, and debate who doesn't belong!
        </p>

        <div
          style={{
            background: "rgba(0, 0, 0, 0.35)",
            border: "1px dashed var(--border-glass)",
            borderRadius: "14px",
            padding: "0.75rem 1rem",
            fontSize: "0.9rem",
            color: "var(--accent-yellow)",
            display: "inline-block",
            marginBottom: "1.2rem"
          }}
        >
          💡 <strong>Offline Mode:</strong> No typing or chat needed! Discuss face-to-face, then tap below to vote.
        </div>

        <div>
          <button
            className="btn-accent"
            style={{
              fontSize: "1.25rem",
              padding: "1rem 2.5rem",
              borderRadius: "20px",
              boxShadow: "0 8px 25px rgba(255, 71, 87, 0.5)"
            }}
            onClick={handleStartVoting}
          >
            Everyone Spoke? Start Elimination Voting! 🗳️
          </button>
          {!isHost && (
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              (Any player or host can click when discussion is finished)
            </div>
          )}
        </div>
      </div>

      {/* Suggested Speaking Order Roster */}
      <div className="glass-panel">
        <h3
          style={{
            fontSize: "1.2rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          🔄 Suggested Speaking Order ({alivePlayers.length} Alive)
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "0.85rem"
          }}
        >
          {alivePlayers.map((p, idx) => {
            const isSelf = p.id === socketId;
            return (
              <div
                key={p.id}
                style={{
                  background: isSelf ? "rgba(108, 92, 231, 0.22)" : "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${isSelf ? "var(--primary)" : "var(--border-glass)"}`,
                  borderRadius: "16px",
                  padding: "0.8rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem"
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "var(--accent-yellow)",
                    width: "24px"
                  }}
                >
                  #{idx + 1}
                </span>
                <span style={{ fontSize: "2rem" }}>{p.avatar}</span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {p.name}
                  </div>
                  {isSelf && (
                    <span className="pill-tag pill-you" style={{ fontSize: "0.7rem", marginTop: "0.15rem" }}>
                      You
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
