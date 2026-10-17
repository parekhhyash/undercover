import React, { useEffect } from "react";
import sounds from "../utils/soundEffects";
import { fireConfetti } from "../utils/confetti";

export default function RoundSummaryScreen({ room, socketId, onNextRound }) {
  const isHost = room.hostId === socketId;
  const isLastRound = room.currentRound >= room.settings.rounds;
  const players = [...(room.players || [])].sort((a, b) => b.score - a.score);

  useEffect(() => {
    sounds.playVictory();
    fireConfetti();
  }, []);

  const getWinnerDisplay = () => {
    if (room.roundWinner === "CIVILIANS") {
      return {
        title: "Civilians Win Round! 🛡️🎉",
        color: "var(--role-civilian)",
        bg: "rgba(16, 172, 132, 0.2)",
        border: "var(--role-civilian)"
      };
    } else if (room.roundWinner === "UNDERCOVER") {
      return {
        title: "Undercovers Infiltrated & Won! 🕵️💥",
        color: "var(--role-undercover)",
        bg: "rgba(255, 71, 87, 0.2)",
        border: "var(--role-undercover)"
      };
    } else {
      return {
        title: "Mr. White Stole The Win! 🎩✨",
        color: "var(--role-mrwhite)",
        bg: "rgba(162, 155, 254, 0.25)",
        border: "var(--role-mrwhite)"
      };
    }
  };

  const winnerInfo = getWinnerDisplay();

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", width: "100%" }}>
      {/* Round Victory Hero Banner */}
      <div
        className="glass-panel"
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          background: winnerInfo.bg,
          border: `2px solid ${winnerInfo.border}`,
          boxShadow: `0 0 35px ${winnerInfo.bg}`
        }}
      >
        <span className="pill-tag pill-host" style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
          Round {room.currentRound} Results
        </span>
        <h1 style={{ fontSize: "2.3rem", color: winnerInfo.color, margin: "0.4rem 0" }}>
          {winnerInfo.title}
        </h1>
        <p style={{ color: "#f1f2f6", fontSize: "1.1rem", maxWidth: "560px", margin: "0 auto" }}>
          {room.winReason}
        </p>
      </div>

      {/* Secret Words Reveal Card */}
      <div className="glass-panel" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.25rem", textAlign: "center", marginBottom: "1rem" }}>
          🔍 Secret Words Revealed!
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {/* Civilian Word */}
          <div style={{
            background: "rgba(16, 172, 132, 0.12)",
            border: "1px solid var(--role-civilian)",
            borderRadius: "18px",
            padding: "1rem",
            textAlign: "center"
          }}>
            <span className="pill-tag pill-civilian" style={{ fontSize: "0.8rem", marginBottom: "0.4rem" }}>
              🛡️ Civilian Word
            </span>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#fff",
              marginTop: "0.3rem"
            }}>
              {room.words?.civilianWord || "???"}
            </div>
          </div>

          {/* Undercover Word */}
          <div style={{
            background: "rgba(255, 71, 87, 0.12)",
            border: "1px solid var(--role-undercover)",
            borderRadius: "18px",
            padding: "1rem",
            textAlign: "center"
          }}>
            <span className="pill-tag pill-undercover" style={{ fontSize: "0.8rem", marginBottom: "0.4rem" }}>
              🕵️ Undercover Word
            </span>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#fff",
              marginTop: "0.3rem"
            }}>
              {room.words?.undercoverWord || "???"}
            </div>
          </div>

          {/* Mr. White */}
          <div style={{
            background: "rgba(162, 155, 254, 0.12)",
            border: "1px solid var(--role-mrwhite)",
            borderRadius: "18px",
            padding: "1rem",
            textAlign: "center"
          }}>
            <span className="pill-tag pill-mrwhite" style={{ fontSize: "0.8rem", marginBottom: "0.4rem" }}>
              🎩 Mr. White Word
            </span>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "var(--accent-purple)",
              marginTop: "0.3rem"
            }}>
              NO WORD ❓
            </div>
          </div>
        </div>
      </div>

      {/* Running Leaderboard & Roles Unmasked */}
      <div className="glass-panel" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          🏆 Running Leaderboard & Roles
        </h3>

        <div className="leaderboard-list">
          {players.map((p, rank) => {
            const isSelf = p.id === socketId;
            const pointsEarned = room.roundScoresEarned?.[p.id] || 0;

            const rolePill = p.role === "CIVILIAN"
              ? <span className="pill-tag pill-civilian">Civilian</span>
              : p.role === "UNDERCOVER"
                ? <span className="pill-tag pill-undercover">Undercover</span>
                : <span className="pill-tag pill-mrwhite">Mr. White</span>;

            return (
              <div
                key={p.id}
                className={`leaderboard-row ${rank === 0 ? "rank-1" : rank === 1 ? "rank-2" : rank === 2 ? "rank-3" : ""}`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", minWidth: 0 }}>
                  <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    width: "28px"
                  }}>
                    {rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : `#${rank + 1}`}
                  </span>
                  <span style={{ fontSize: "1.8rem" }}>{p.avatar}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                      {p.name} {isSelf && "(You)"}
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.15rem" }}>
                      {rolePill}
                      {p.isBot && <span className="pill-tag pill-bot">Bot</span>}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: "var(--accent-yellow)"
                  }}>
                    {p.score} pts
                  </div>
                  {pointsEarned > 0 && (
                    <span style={{ fontSize: "0.8rem", color: "var(--accent-green)", fontWeight: 700 }}>
                      +{pointsEarned} this round!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Round Action */}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        {isHost ? (
          <button
            className="btn-accent"
            style={{ fontSize: "1.25rem", padding: "1rem 2.8rem" }}
            onClick={() => { sounds.playDing(); onNextRound(); }}
          >
            {isLastRound ? "View Grand Final Podium 🏆" : `Advance to Round ${room.currentRound + 1} ▶️`}
          </button>
        ) : (
          <div className="glass-panel" style={{ padding: "1rem" }}>
            <span style={{ fontSize: "1.05rem", color: "var(--text-muted)" }}>
              ⏳ Waiting for the Host to continue...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
