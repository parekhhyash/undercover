import React from "react";
import sounds from "../utils/soundEffects";

export default function RulesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
          <h2 style={{ fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            🕵️ How to Play Undercover
          </h2>
          <button
            className="icon-btn"
            onClick={() => { sounds.playPop(); onClose(); }}
            style={{ fontSize: "1.3rem", width: "36px", height: "36px" }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", fontSize: "0.95rem", color: "#dcdde1" }}>
          {/* Quick Overview */}
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "16px", border: "1px solid var(--border-glass)" }}>
            <p>
              <strong>Undercover</strong> is a social deduction party game. Players receive secret words, give clues without revealing their exact word, and try to identify who doesn't belong!
            </p>
          </div>

          {/* The Roles */}
          <div>
            <h3 style={{ color: "#fff", marginBottom: "0.6rem", fontSize: "1.15rem" }}>🎭 1. The Roles</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div style={{ background: "rgba(16, 172, 132, 0.12)", border: "1px solid var(--role-civilian)", borderRadius: "14px", padding: "0.75rem 1rem" }}>
                <strong style={{ color: "var(--role-civilian)" }}>🛡️ Civilians (The Majority)</strong>
                <p style={{ marginTop: "0.2rem" }}>
                  All Civilians receive the same secret word (e.g. <em>Apple</em>). Their goal is to identify and eliminate all Undercovers and Mr. White.
                </p>
              </div>

              <div style={{ background: "rgba(255, 71, 87, 0.12)", border: "1px solid var(--role-undercover)", borderRadius: "14px", padding: "0.75rem 1rem" }}>
                <strong style={{ color: "var(--role-undercover)" }}>🕵️ Undercover (The Infiltrator)</strong>
                <p style={{ marginTop: "0.2rem" }}>
                  Undercover players receive a similar word (e.g. <em>Mango</em>). They must blend in with believable clues without knowing what the Civilians got.
                </p>
              </div>

              <div style={{ background: "rgba(162, 155, 254, 0.12)", border: "1px solid var(--role-mrwhite)", borderRadius: "14px", padding: "0.75rem 1rem" }}>
                <strong style={{ color: "var(--role-mrwhite)" }}>🎩 Mr. White (The Wordless Player)</strong>
                <p style={{ marginTop: "0.2rem" }}>
                  Receives <strong>NO word</strong>! Must bluff, infer the secret word from everyone's clues, and can steal an instant win by guessing the Civilians' word when eliminated!
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Setup */}
          <div>
            <h3 style={{ color: "#fff", marginBottom: "0.4rem", fontSize: "1.15rem" }}>⚙️ 2. Recommended Setup</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-glass)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "0.4rem" }}>Players</th>
                  <th style={{ padding: "0.4rem" }}>Civilians</th>
                  <th style={{ padding: "0.4rem" }}>Undercover</th>
                  <th style={{ padding: "0.4rem" }}>Mr. White</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "0.4rem" }}>4–5</td>
                  <td style={{ padding: "0.4rem" }}>3–4</td>
                  <td style={{ padding: "0.4rem" }}>1</td>
                  <td style={{ padding: "0.4rem" }}>0–1</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "0.4rem" }}>6–8</td>
                  <td style={{ padding: "0.4rem" }}>4–6</td>
                  <td style={{ padding: "0.4rem" }}>1–2</td>
                  <td style={{ padding: "0.4rem" }}>1</td>
                </tr>
                <tr>
                  <td style={{ padding: "0.4rem" }}>9–12</td>
                  <td style={{ padding: "0.4rem" }}>6–9</td>
                  <td style={{ padding: "0.4rem" }}>2–3</td>
                  <td style={{ padding: "0.4rem" }}>1–2</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Step by Step */}
          <div>
            <h3 style={{ color: "#fff", marginBottom: "0.4rem", fontSize: "1.15rem" }}>🔄 3. How to Play</h3>
            <ol style={{ paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <li><strong>Check Role & Word:</strong> Keep it confidential!</li>
              <li><strong>Give Clues:</strong> Each player gives a 1-word or short clue describing their word.</li>
              <li><strong>Investigate & Debate:</strong> Discuss suspicious clues in the discussion phase.</li>
              <li><strong>Vote to Eliminate:</strong> Suspect who doesn't belong and vote them out.</li>
              <li><strong>Mr. White Guess:</strong> If Mr. White is eliminated, they get 1 chance to guess the Civilians' word to steal the win!</li>
            </ol>
          </div>

          {/* Win & Scoring */}
          <div>
            <h3 style={{ color: "#fff", marginBottom: "0.4rem", fontSize: "1.15rem" }}>🏆 4. Scoring & Leaderboard</h3>
            <ul style={{ paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <li><strong>Civilians Win:</strong> +6 pts (survivors) / +3 pts (eliminated)</li>
              <li><strong>Undercover Win:</strong> +10 pts (survivors) / +5 pts (eliminated)</li>
              <li><strong>Mr. White Guess Win:</strong> +12 pts!</li>
              <li><strong>Mr. White Survival Win:</strong> +15 pts!</li>
            </ul>
          </div>
        </div>

        <button
          className="btn-primary"
          style={{ width: "100%", marginTop: "1.5rem" }}
          onClick={() => { sounds.playPop(); onClose(); }}
        >
          Got it, Let's Play! 🚀
        </button>
      </div>
    </div>
  );
}
