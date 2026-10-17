import React, { useState } from "react";
import sounds from "../utils/soundEffects";

export default function VotingPhaseScreen({ room, socketId, onCastVote }) {
  const [selectedTargetId, setSelectedTargetId] = useState(room.votes?.[socketId] || null);

  const me = (room.players || []).find(p => p.id === socketId);
  const alivePlayers = (room.players || []).filter(p => p.isAlive);
  const votedCount = (room.votedPlayerIds || []).length;
  const totalAlive = alivePlayers.length;
  const hasVoted = !!room.votes?.[socketId];

  const handleVote = (target) => {
    if (target.id === socketId) return; // Cannot vote for yourself
    if (!me?.isAlive) return; // Dead players cannot vote
    sounds.playVote();
    setSelectedTargetId(target.id);
    onCastVote(target.id);
  };

  const selectedTargetPlayer = alivePlayers.find(p => p.id === selectedTargetId);

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", width: "100%" }}>
      {/* Voting Header */}
      <div className="glass-panel" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <span className="pill-tag pill-undercover" style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
          Elimination Vote
        </span>
        <h2 style={{ fontSize: "1.9rem", color: "#fff", margin: "0.3rem 0" }}>
          🗳️ Cast Your Elimination Vote!
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Select the agent you suspect is an Undercover or Mr. White. The player with the most votes will be eliminated!
        </p>

        {/* Voting Progress Pill */}
        <div style={{
          display: "inline-block",
          marginTop: "1rem",
          background: "rgba(255,255,255,0.08)",
          padding: "0.5rem 1.2rem",
          borderRadius: "999px",
          fontWeight: 700,
          fontSize: "0.9rem",
          color: "var(--accent-yellow)"
        }}>
          Ballots Cast: {votedCount} / {totalAlive}
        </div>
      </div>

      {/* Target Voting Cards Grid */}
      <div className="vote-grid">
        {alivePlayers.map((player) => {
          const isSelf = player.id === socketId;
          const isSelected = selectedTargetId === player.id;
          const playerHasVoted = (room.votedPlayerIds || []).includes(player.id);
          const cluesGiven = (player.clues || []).join(", ");

          return (
            <div
              key={player.id}
              className={`vote-card ${isSelected ? "selected" : ""} ${isSelf ? "disabled" : ""}`}
              onClick={() => !isSelf && handleVote(player)}
              style={{
                opacity: isSelf ? 0.7 : 1,
                cursor: isSelf ? "not-allowed" : "pointer"
              }}
            >
              {isSelected && (
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "var(--accent-red)",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 900
                }}>
                  ✓
                </div>
              )}

              <span style={{ fontSize: "3rem", display: "block", marginBottom: "0.3rem" }}>
                {player.avatar}
              </span>

              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.2rem" }}>
                {player.name}
              </h4>

              <div style={{ display: "flex", gap: "0.3rem", justifyContent: "center", marginBottom: "0.6rem" }}>
                {isSelf && <span className="pill-tag pill-you" style={{ fontSize: "0.7rem" }}>You</span>}
                {player.isBot && <span className="pill-tag pill-bot" style={{ fontSize: "0.7rem" }}>Bot 🤖</span>}
                {playerHasVoted && (
                  <span style={{ fontSize: "0.75rem", color: "var(--accent-green)", fontWeight: 700 }}>
                    Voted ✓
                  </span>
                )}
              </div>

              {cluesGiven && (
                <div style={{
                  fontSize: "0.85rem",
                  color: "var(--accent-yellow)",
                  background: "rgba(0,0,0,0.3)",
                  padding: "0.4rem 0.6rem",
                  borderRadius: "10px",
                  fontStyle: "italic"
                }}>
                  "{cluesGiven}"
                </div>
              )}

              {isSelf ? (
                <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "0.8rem" }}>
                  (Cannot vote for yourself)
                </div>
              ) : (
                <button
                  type="button"
                  className={isSelected ? "btn-accent" : "btn-secondary"}
                  style={{
                    width: "100%",
                    marginTop: "0.8rem",
                    padding: "0.5rem",
                    fontSize: "0.9rem"
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(player);
                  }}
                >
                  {isSelected ? "Suspect Selected! 🎯" : "Vote to Eliminate"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Notice */}
      {hasVoted && selectedTargetPlayer && (
        <div style={{
          textAlign: "center",
          background: "rgba(16, 172, 132, 0.2)",
          border: "1px solid var(--accent-green)",
          borderRadius: "16px",
          padding: "0.8rem 1.5rem",
          color: "#fff",
          fontSize: "1rem",
          marginTop: "1rem"
        }}>
          🎯 Your vote has been recorded for <strong>{selectedTargetPlayer.name}</strong>. Waiting for all players to finish voting...
        </div>
      )}
    </div>
  );
}
