import React, { useState, useEffect } from "react";
import sounds from "../utils/soundEffects";

export default function CluePhaseScreen({ room, socketId, onSubmitClue }) {
  const [clueInput, setClueInput] = useState("");
  const [peekOpen, setPeekOpen] = useState(false);

  const me = (room.players || []).find(p => p.id === socketId);
  const currentTurnPlayerId = room.currentTurnPlayerId;
  const isMyTurn = currentTurnPlayerId === socketId;
  const currentTurnPlayer = (room.players || []).find(p => p.id === currentTurnPlayerId);

  // Sound cue when your turn starts
  useEffect(() => {
    if (isMyTurn) {
      sounds.playDing();
    }
  }, [isMyTurn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = clueInput.trim();
    if (!clean) return;
    sounds.playPop();
    onSubmitClue(clean);
    setClueInput("");
  };

  const handlePass = () => {
    sounds.playPop();
    onSubmitClue("Passed ⏱️");
    setClueInput("");
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", width: "100%" }}>
      {/* Top Banner with Category & Word Peek */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
        background: "rgba(0,0,0,0.3)",
        padding: "0.6rem 1rem",
        borderRadius: "16px",
        border: "1px solid var(--border-glass)",
        flexWrap: "wrap",
        gap: "0.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="pill-tag pill-host">Round {room.currentRound}</span>
          {room.words?.category && (
            <span style={{ fontSize: "0.9rem", color: "var(--accent-yellow)", fontWeight: 600 }}>
              📁 Category: {room.words.category}
            </span>
          )}
        </div>

        {/* Peek Secret Word Button */}
        <button
          className="btn-secondary"
          style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
          onClick={() => { sounds.playPop(); setPeekOpen(!peekOpen); }}
        >
          {peekOpen ? "🙈 Hide Word" : "👁️ Peek My Word"}
        </button>
      </div>

      {/* Peek Drawer */}
      {peekOpen && me && (
        <div style={{
          background: "linear-gradient(135deg, rgba(108, 92, 231, 0.25) 0%, rgba(255, 101, 132, 0.25) 100%)",
          border: "2px solid var(--primary)",
          borderRadius: "16px",
          padding: "1rem",
          marginBottom: "1rem",
          textAlign: "center",
          animation: "slideInUp 0.2s ease"
        }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Confidential Word Reminder:</span>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color: "#fff", marginTop: "0.2rem" }}>
            {me.word ? me.word : "NO WORD (Mr. White) 🎩"}
          </div>
        </div>
      )}

      {/* Turn Spotlight */}
      <div className="turn-spotlight">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "2.5rem" }}>
            {currentTurnPlayer?.avatar || "🕵️"}
          </span>
          <div>
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--accent-yellow)", fontWeight: 700 }}>
              {isMyTurn ? "🎯 IT'S YOUR TURN!" : "Active Agent"}
            </span>
            <h3 style={{ fontSize: "1.4rem", color: "#fff" }}>
              {isMyTurn ? "Give your clue!" : `${currentTurnPlayer?.name || "Player"} is thinking...`}
            </h3>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <span className="pill-tag pill-host" style={{ fontSize: "0.85rem" }}>
            Turn {room.currentTurnIndex + 1} of {room.turnOrder?.length || 1}
          </span>
        </div>
      </div>

      {/* If it's your turn: Clue Input Box */}
      {isMyTurn && (
        <div className="glass-panel" style={{ marginBottom: "1.5rem", border: "2px solid var(--accent-pink)" }}>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" style={{ color: "#fff", fontSize: "1rem" }}>
                Type a 1-word or short clue describing your secret word:
              </label>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Delicious, Crunchy, Italian..."
                  value={clueInput}
                  onChange={(e) => setClueInput(e.target.value)}
                  maxLength={30}
                  autoFocus
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  className="btn-accent"
                  disabled={!clueInput.trim()}
                >
                  Submit Clue 💬
                </button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                💡 Don't say your exact word! Don't repeat previous clues.
              </span>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: "0.3rem 0.8rem", fontSize: "0.85rem" }}
                onClick={handlePass}
              >
                Pass Turn ⏩
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clues Timeline Feed */}
      <div className="glass-panel">
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          📜 Clues Given This Round ({(room.cluesThisRound || []).length})
        </h3>

        {(!room.cluesThisRound || room.cluesThisRound.length === 0) ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
            <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>⏳</span>
            Waiting for the first clue of the round...
          </div>
        ) : (
          <div className="clue-feed">
            {room.cluesThisRound.map((entry, idx) => {
              const isSelf = entry.playerId === socketId;
              return (
                <div
                  key={entry.id || idx}
                  className={`clue-bubble ${isSelf ? "self" : ""}`}
                >
                  <span style={{ fontSize: "1.8rem" }}>{entry.avatar}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                        {entry.playerName}
                      </span>
                      {isSelf && <span className="pill-tag pill-you" style={{ fontSize: "0.7rem" }}>You</span>}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: isSelf ? "var(--accent-yellow)" : "#fff",
                      marginTop: "0.15rem"
                    }}>
                      "{entry.clue}"
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
