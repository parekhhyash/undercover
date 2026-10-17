import React, { useEffect } from "react";
import sounds from "../utils/soundEffects";
import { fireConfetti } from "../utils/confetti";

export default function GameOverScreen({ room, socketId, onRematch }) {
  const isHost = room.hostId === socketId;
  const players = [...(room.players || [])].sort((a, b) => b.score - a.score);

  const top1 = players[0];
  const top2 = players[1];
  const top3 = players[2];

  useEffect(() => {
    sounds.playVictory();
    fireConfetti();
    const timer = setTimeout(() => fireConfetti(), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", width: "100%", textAlign: "center" }}>
      {/* Title */}
      <div className="glass-panel" style={{ marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "3.5rem", display: "block", marginBottom: "0.2rem" }}>
          👑🎉🏆
        </span>
        <h1 style={{ fontSize: "2.5rem", color: "#fff", marginBottom: "0.3rem" }}>
          Game Over — Grand Champions!
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
          All {room.settings.rounds} rounds completed! Here is the final leaderboard podium:
        </p>

        {/* 3D Animated Podium */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: "1rem",
          margin: "2rem auto 1rem auto",
          maxWidth: "480px"
        }}>
          {/* 2nd Place */}
          {top2 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "2.2rem" }}>{top2.avatar}</span>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, margin: "0.2rem 0" }}>
                {top2.name}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--accent-yellow)", fontWeight: 700 }}>
                {top2.score} pts
              </span>
              <div style={{
                width: "100%",
                height: "100px",
                background: "linear-gradient(180deg, #747d8c 0%, #2f3542 100%)",
                borderRadius: "16px 16px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                color: "#ced6e0",
                boxShadow: "0 8px 20px rgba(0,0,0,0.4)"
              }}>
                🥈 2nd
              </div>
            </div>
          )}

          {/* 1st Place */}
          {top1 && (
            <div style={{ flex: 1.2, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "1.8rem" }}>👑</span>
              <span style={{ fontSize: "3rem" }}>{top1.avatar}</span>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0.2rem 0", color: "#fff" }}>
                {top1.name}
              </span>
              <span style={{ fontSize: "1rem", color: "var(--accent-yellow)", fontWeight: 800 }}>
                {top1.score} pts
              </span>
              <div style={{
                width: "100%",
                height: "140px",
                background: "linear-gradient(180deg, #ffa502 0%, #b33939 100%)",
                borderRadius: "18px 18px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.2rem",
                color: "#fff",
                boxShadow: "0 10px 30px rgba(255, 165, 2, 0.5)"
              }}>
                🥇 1st
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "2.2rem" }}>{top3.avatar}</span>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, margin: "0.2rem 0" }}>
                {top3.name}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--accent-yellow)", fontWeight: 700 }}>
                {top3.score} pts
              </span>
              <div style={{
                width: "100%",
                height: "75px",
                background: "linear-gradient(180deg, #cd6133 0%, #574b90 100%)",
                borderRadius: "16px 16px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                color: "#eccc68",
                boxShadow: "0 8px 20px rgba(0,0,0,0.4)"
              }}>
                🥉 3rd
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard Standings */}
      <div className="glass-panel" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", textAlign: "left" }}>
          📊 Final Standings & Points
        </h3>

        <div className="leaderboard-list">
          {players.map((p, idx) => (
            <div
              key={p.id}
              className={`leaderboard-row ${idx === 0 ? "rank-1" : idx === 1 ? "rank-2" : idx === 2 ? "rank-3" : ""}`}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1.1rem", width: "32px" }}>
                  #{idx + 1}
                </span>
                <span style={{ fontSize: "1.8rem" }}>{p.avatar}</span>
                <span style={{ fontWeight: 700, fontSize: "1rem" }}>
                  {p.name} {p.id === socketId && "(You)"} {p.isBot && "(Bot)"}
                </span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-yellow)" }}>
                {p.score} pts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rematch Button */}
      {isHost ? (
        <button
          className="btn-accent"
          style={{ fontSize: "1.3rem", padding: "1.1rem 3rem" }}
          onClick={() => { sounds.playDing(); onRematch(); }}
        >
          🔄 Play Again / Rematch!
        </button>
      ) : (
        <div className="glass-panel" style={{ padding: "1rem" }}>
          <span style={{ fontSize: "1.05rem", color: "var(--text-muted)" }}>
            ⏳ Waiting for the Host to start a rematch...
          </span>
        </div>
      )}
    </div>
  );
}
