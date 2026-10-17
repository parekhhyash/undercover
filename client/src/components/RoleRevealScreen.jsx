import React, { useState } from "react";
import sounds from "../utils/soundEffects";

export default function RoleRevealScreen({
  room,
  socketId,
  onRevealDone,
  onForceStartClues
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasConfirmedReady, setHasConfirmedReady] = useState(false);

  const me = (room.players || []).find(p => p.id === socketId);
  const isHost = room.hostId === socketId;
  const readyCount = (room.players || []).filter(p => p.hasRevealed).length;
  const totalCount = (room.players || []).length;

  const handleCardClick = () => {
    sounds.playFlip();
    setIsFlipped(!isFlipped);
  };

  const handleReadyClick = () => {
    sounds.playPop();
    setHasConfirmedReady(true);
    onRevealDone();
  };

  if (!me) return null;

  const role = me.role;
  const word = me.word;

  const getRoleBadge = () => {
    if (role === "CIVILIAN") {
      return {
        name: "Civilian",
        emoji: "🛡️",
        colorClass: "role-civilian",
        tagClass: "pill-civilian",
        instruction: "You are the majority! Everyone on your team shares this exact secret word. Give subtle clues and discover who has a different word or no word!"
      };
    } else if (role === "UNDERCOVER") {
      return {
        name: "Undercover",
        emoji: "🕵️",
        colorClass: "role-undercover",
        tagClass: "pill-undercover",
        instruction: "You are an infiltrator! Civilians have a slightly different word. Blend in by giving clever, plausible clues without giving yourself away!"
      };
    } else {
      return {
        name: "Mr. White",
        emoji: "🎩",
        colorClass: "role-mrwhite",
        tagClass: "pill-mrwhite",
        instruction: "You received NO secret word! Listen intently to everyone's clues, bluff convincingly, and if you get eliminated, guess the Civilians' word to win!"
      };
    }
  };

  const roleInfo = getRoleBadge();

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", width: "100%" }}>
      {/* Round Header */}
      <div style={{ marginBottom: "1rem" }}>
        <span className="pill-tag pill-host" style={{ fontSize: "0.9rem", padding: "0.35rem 0.85rem" }}>
          Round {room.currentRound} of {room.settings.rounds}
        </span>
        <h2 style={{ fontSize: "1.8rem", marginTop: "0.4rem" }}>
          Top Secret Dossier 🔒
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Tap the confidential card below to reveal your secret role and word. Keep it hidden!
        </p>
      </div>

      {/* 3D Flip Secret Card */}
      <div
        className={`secret-card-container ${isFlipped ? "revealed" : ""}`}
        onClick={handleCardClick}
      >
        <div className="secret-card-inner">
          {/* Front of Card (Hidden) */}
          <div className="secret-card-front">
            <div style={{ fontSize: "4.5rem", marginBottom: "0.5rem" }}>🕵️‍♂️</div>
            <h3 style={{ fontSize: "1.6rem", color: "#fff", marginBottom: "0.4rem" }}>
              CONFIDENTIAL
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "240px" }}>
              Private assignment for <strong>{me.name}</strong>.
            </p>
            <div style={{
              marginTop: "1.5rem",
              background: "rgba(255,255,255,0.1)",
              padding: "0.6rem 1.2rem",
              borderRadius: "999px",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "var(--accent-yellow)",
              border: "1px dashed rgba(255, 165, 2, 0.5)"
            }}>
              👆 Tap to Reveal Role
            </div>
          </div>

          {/* Back of Card (Revealed) */}
          <div className={`secret-card-back ${roleInfo.colorClass}`}>
            <span className={`pill-tag ${roleInfo.tagClass}`} style={{ fontSize: "1rem", padding: "0.4rem 1rem" }}>
              {roleInfo.emoji} {roleInfo.name}
            </span>

            <div className="secret-word-box">
              <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)" }}>
                Your Secret Word
              </span>
              <div className="secret-word-text">
                {word ? word : "NO WORD ❓"}
              </div>
            </div>

            <p style={{ fontSize: "0.9rem", color: "#f1f2f6", lineHeight: 1.4, padding: "0 0.5rem" }}>
              {roleInfo.instruction}
            </p>

            <span style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              (Tap card to hide again)
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", alignItems: "center", marginTop: "1rem" }}>
        {!hasConfirmedReady ? (
          <button
            className="btn-emerald"
            style={{ fontSize: "1.15rem", padding: "0.9rem 2.5rem" }}
            onClick={handleReadyClick}
          >
            I Memorized My Role! Ready ✅
          </button>
        ) : (
          <div style={{
            background: "rgba(16, 172, 132, 0.2)",
            border: "1px solid var(--accent-green)",
            borderRadius: "14px",
            padding: "0.7rem 1.5rem",
            color: "var(--accent-green)",
            fontWeight: 700
          }}>
            ✓ You are ready! Waiting for other agents... ({readyCount}/{totalCount})
          </div>
        )}

        {isHost && (
          <button
            className="btn-secondary"
            style={{ fontSize: "0.95rem", marginTop: "0.5rem" }}
            onClick={() => { sounds.playPop(); onForceStartClues(); }}
          >
            Host: Skip Directly to Clues ▶️
          </button>
        )}
      </div>
    </div>
  );
}
