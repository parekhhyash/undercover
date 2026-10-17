import React, { useState } from "react";
import sounds from "../utils/soundEffects";

export default function MrWhiteGuessModal({ room, socketId, onSubmitGuess }) {
  const [guessInput, setGuessInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const eliminatedPlayer = room.eliminatedPlayer;
  const isMe = eliminatedPlayer?.id === socketId;

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = guessInput.trim();
    if (!clean) return;
    sounds.playPop();
    setSubmitted(true);
    onSubmitGuess(clean);
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{
          border: "2px solid var(--role-mrwhite)",
          boxShadow: "0 0 40px rgba(162, 155, 254, 0.4)",
          textAlign: "center"
        }}
      >
        <span style={{ fontSize: "4rem", display: "block", marginBottom: "0.5rem" }}>
          🎩🎯
        </span>

        <span className="pill-tag pill-mrwhite" style={{ fontSize: "0.9rem", padding: "0.3rem 0.9rem", marginBottom: "0.6rem" }}>
          Mr. White Unmasked!
        </span>

        <h2 style={{ fontSize: "1.8rem", color: "#fff", margin: "0.5rem 0" }}>
          {isMe ? "One Last Chance to Steal Victory!" : `${eliminatedPlayer?.name || "Mr. White"} Was Eliminated!`}
        </h2>

        {isMe ? (
          <div>
            <p style={{ color: "#dcdde1", fontSize: "1rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              You were caught, Mr. White! But if you can correctly guess the Civilians' secret word right now, you steal the win for yourself!
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter Civilians' secret word (e.g. Pizza, Coffee)..."
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    style={{ fontSize: "1.2rem", textAlign: "center" }}
                    autoFocus
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-accent"
                  style={{ width: "100%", fontSize: "1.15rem", marginTop: "0.5rem" }}
                  disabled={!guessInput.trim()}
                >
                  Confirm Secret Word Guess! 🎯
                </button>
              </form>
            ) : (
              <div style={{
                background: "rgba(162, 155, 254, 0.2)",
                padding: "1rem",
                borderRadius: "16px",
                color: "#fff",
                fontWeight: 600
              }}>
                ⏳ Verifying your guess...
              </div>
            )}
          </div>
        ) : (
          <div>
            <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              <strong>{eliminatedPlayer?.name}</strong> was Mr. White! They are currently trying to deduce and guess the Civilians' secret word. If they guess right, they win!
            </p>

            <div style={{
              background: "rgba(0, 0, 0, 0.3)",
              border: "1px dashed var(--role-mrwhite)",
              borderRadius: "18px",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.8rem",
              color: "var(--accent-purple)",
              fontSize: "1.1rem",
              fontWeight: 700
            }}>
              <span style={{ animation: "spin 2s linear infinite", display: "inline-block" }}>⏳</span>
              Awaiting Mr. White's final guess...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
