import React, { useState } from "react";
import sounds from "../utils/soundEffects";

export default function Header({ room, onOpenRules, onLeaveRoom }) {
  const [muted, setMuted] = useState(sounds.isMuted());

  const handleToggleMute = () => {
    const isNowMuted = sounds.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      sounds.playPop();
    }
  };

  return (
    <header className="app-header">
      <div className="brand" onClick={() => sounds.playPop()}>
        <span className="brand-icon">🕵️</span>
        <div>
          <span className="brand-title">Undercover</span>
          {room && (
            <span style={{ marginLeft: "0.6rem", fontSize: "0.85rem", color: "var(--accent-yellow)", fontWeight: 700 }}>
              • Room: {room.code}
            </span>
          )}
        </div>
      </div>

      <div className="header-controls">
        <button
          className="icon-btn"
          onClick={handleToggleMute}
          title={muted ? "Unmute Audio" : "Mute Audio"}
        >
          {muted ? "🔇" : "🔊"}
        </button>

        <button
          className="icon-btn"
          onClick={() => { sounds.playPop(); onOpenRules(); }}
          title="Game Rules"
        >
          📖 Rules
        </button>

        {room && (
          <button
            className="icon-btn"
            style={{ color: "var(--accent-red)" }}
            onClick={() => {
              sounds.playPop();
              if (window.confirm("Are you sure you want to leave this room?")) {
                onLeaveRoom();
              }
            }}
            title="Leave Room"
          >
            🚪 Leave
          </button>
        )}
      </div>
    </header>
  );
}
