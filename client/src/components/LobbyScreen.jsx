import React, { useState } from "react";
import sounds from "../utils/soundEffects";

export default function LobbyScreen({
  room,
  socketId,
  onUpdateSettings,
  onAddBot,
  onKickPlayer,
  onStartGame
}) {
  const [toast, setToast] = useState("");
  const isHost = room.hostId === socketId;
  const players = room.players || [];
  const settings = room.settings || { rounds: 3, undercoverCount: 1, mrWhiteCount: 1 };

  const minRequired = (settings.undercoverCount || 1) + (settings.mrWhiteCount || 0) + 1;
  const canStart = players.length >= minRequired;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  const handleCopyCode = () => {
    sounds.playPop();
    navigator.clipboard.writeText(room.code);
    showToast(`Room Code "${room.code}" copied to clipboard! 📋`);
  };

  const handleCopyLink = () => {
    sounds.playPop();
    const url = `${window.location.origin}${window.location.pathname}?room=${room.code}`;
    navigator.clipboard.writeText(url);
    showToast("Direct invite link copied to clipboard! 🔗");
  };

  const handleSettingChange = (field, delta) => {
    sounds.playPop();
    const current = settings[field] || 0;
    const updated = { ...settings, [field]: current + delta };
    onUpdateSettings(updated);
  };

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", width: "100%" }}>
      {/* Toast Notification */}
      {toast && <div className="toast-notice">{toast}</div>}

      {/* Room Code & Share Card */}
      <div className="glass-panel" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text-muted)", fontWeight: 700 }}>
          Secret Mission Room
        </span>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          margin: "0.6rem 0 1rem 0"
        }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.8rem",
            fontWeight: 800,
            letterSpacing: "4px",
            color: "var(--accent-yellow)",
            textShadow: "0 0 20px rgba(255, 165, 2, 0.4)"
          }}>
            {room.code}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "0.8rem", flexWrap: "wrap" }}>
          <button className="btn-secondary" onClick={handleCopyCode}>
            📋 Copy Code
          </button>
          <button className="btn-secondary" onClick={handleCopyLink}>
            🔗 Share Invite Link
          </button>
        </div>
      </div>

      {/* Host Settings Panel */}
      <div className="glass-panel" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
          <h2 style={{ fontSize: "1.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            ⚙️ Game Settings {isHost ? "(Host Controls)" : "(View Only)"}
          </h2>
          <span className="pill-tag pill-host">
            {isHost ? "You are Host 👑" : "Host is configuring"}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {/* Rounds Stepper */}
          <div style={{ background: "rgba(0,0,0,0.25)", padding: "1rem", borderRadius: "16px", border: "1px solid var(--border-glass)" }}>
            <span style={{ display: "block", fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Total Rounds 🏁
            </span>
            <div className="stepper" style={{ justifyContent: "space-between" }}>
              <button
                className="stepper-btn"
                disabled={!isHost || settings.rounds <= 1}
                onClick={() => handleSettingChange("rounds", -1)}
              >
                -
              </button>
              <span className="stepper-value">{settings.rounds}</span>
              <button
                className="stepper-btn"
                disabled={!isHost || settings.rounds >= 10}
                onClick={() => handleSettingChange("rounds", 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Undercovers Stepper */}
          <div style={{ background: "rgba(0,0,0,0.25)", padding: "1rem", borderRadius: "16px", border: "1px solid var(--border-glass)" }}>
            <span style={{ display: "block", fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Undercovers 🕵️
            </span>
            <div className="stepper" style={{ justifyContent: "space-between" }}>
              <button
                className="stepper-btn"
                disabled={!isHost || settings.undercoverCount <= 1}
                onClick={() => handleSettingChange("undercoverCount", -1)}
              >
                -
              </button>
              <span className="stepper-value" style={{ color: "var(--role-undercover)" }}>
                {settings.undercoverCount}
              </span>
              <button
                className="stepper-btn"
                disabled={!isHost || settings.undercoverCount >= 4}
                onClick={() => handleSettingChange("undercoverCount", 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Mr. White Stepper */}
          <div style={{ background: "rgba(0,0,0,0.25)", padding: "1rem", borderRadius: "16px", border: "1px solid var(--border-glass)" }}>
            <span style={{ display: "block", fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Mr. White 🎩
            </span>
            <div className="stepper" style={{ justifyContent: "space-between" }}>
              <button
                className="stepper-btn"
                disabled={!isHost || settings.mrWhiteCount <= 0}
                onClick={() => handleSettingChange("mrWhiteCount", -1)}
              >
                -
              </button>
              <span className="stepper-value" style={{ color: "var(--role-mrwhite)" }}>
                {settings.mrWhiteCount}
              </span>
              <button
                className="stepper-btn"
                disabled={!isHost || settings.mrWhiteCount >= 3}
                onClick={() => handleSettingChange("mrWhiteCount", 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Players List Panel */}
      <div className="glass-panel" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.35rem" }}>
              👥 Agents in Lobby ({players.length}/12)
            </h2>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Need at least {minRequired} players to start
            </span>
          </div>

          {isHost && (
            <button
              className="btn-secondary"
              onClick={() => { sounds.playPop(); onAddBot(); }}
              disabled={players.length >= 12}
            >
              🤖 Add AI Bot
            </button>
          )}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "0.85rem"
        }}>
          {players.map((p) => {
            const isSelf = p.id === socketId;
            return (
              <div
                key={p.id}
                style={{
                  background: isSelf ? "rgba(108, 92, 231, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${isSelf ? "var(--primary)" : "var(--border-glass)"}`,
                  borderRadius: "18px",
                  padding: "0.85rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.8rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                  <span style={{ fontSize: "2rem" }}>{p.avatar}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {p.name}
                    </div>
                    <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.2rem" }}>
                      {p.isHost && <span className="pill-tag pill-host">Host 👑</span>}
                      {p.isBot && <span className="pill-tag pill-bot">Bot 🤖</span>}
                      {isSelf && <span className="pill-tag pill-you">You</span>}
                    </div>
                  </div>
                </div>

                {isHost && !p.isHost && (
                  <button
                    className="icon-btn"
                    style={{ color: "var(--accent-red)", padding: "0.3rem 0.5rem", fontSize: "0.9rem" }}
                    onClick={() => { sounds.playPop(); onKickPlayer(p.id); }}
                    title="Kick player"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Start Game Action */}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        {isHost ? (
          <div>
            <button
              className="btn-accent"
              style={{
                fontSize: "1.3rem",
                padding: "1.1rem 3rem",
                borderRadius: "20px"
              }}
              disabled={!canStart}
              onClick={() => { sounds.playDing(); onStartGame(); }}
            >
              🚀 Launch Round 1!
            </button>
            {!canStart && (
              <p style={{ marginTop: "0.75rem", color: "var(--accent-yellow)", fontSize: "0.95rem" }}>
                ⚠️ Add {minRequired - players.length} more player(s) or AI bots to meet role requirements.
              </p>
            )}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: "1.2rem" }}>
            <span style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}>
              ⏳ Waiting for the Host to launch the game...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
