# Undercover 🕵️‍♂️ — Social Deduction Party Game

A real-time multiplayer social deduction party game built with React, Node.js, and Socket.IO. Players receive secret words, give clever clues, bluff, debate, and vote to uncover the infiltrators!

---

## 🎮 Game Overview

Undercover is a social deduction game of bluffing, observation, and convincing your friends.

### The 3 Roles:
1. **🛡️ Civilians (The Majority):**
   - All Civilians receive the exact same secret word (e.g., `Apple`).
   - **Goal:** Identify and vote out all Undercover players and Mr. White.
   - **Points:** +6 points for surviving Civilians, +3 points for eliminated Civilians if their team wins.

2. **🕵️ Undercover (The Infiltrator):**
   - Receives a word very similar to the Civilians' word (e.g., `Mango`).
   - **Goal:** Blend in by giving plausible clues, mislead Civilians, and survive until Undercovers equal or outnumber Civilians!
   - **Points:** +10 points for surviving Undercovers, +5 points for eliminated Undercovers if they win.

3. **🎩 Mr. White (The Wordless Player):**
   - Receives **NO word** at all!
   - **Goal:** Listen closely to other players' clues, bluff convincingly, and infer what the Civilians' word is.
   - **Special Ability:** When eliminated, Mr. White gets one chance to guess the Civilians' secret word. If correct, Mr. White steals an instant victory!
   - **Points:** +12 points for Mr. White guess win, +15 points for survival win!

---

## ✨ Features

- **🌐 Dual Game Modes (Online & Offline / In-Person):**
  - **🌐 Online Mode:** Remote party play with in-app 1-word clue typing, turn countdowns, and live accusation chat.
  - **👥 Offline / In-Person Mode:** Party in the same room! Clue typing and chat are skipped so friends speak clues out loud and debate face-to-face. The app handles secret roles, confidential words, elimination voting, and leaderboard scoring!
- **🏠 Room Creation & Sharing:**
  - Create or join rooms with unique 6-character room codes.
  - One-click **Copy Room Code** and **Copy Direct Invite Link** (`?room=CODE`).
- **⚙️ Customizable Host Controls:**
  - Toggle between **Online** and **Offline** modes anytime in the lobby.
  - Configurable number of rounds (1–10).
  - Configurable Undercover count (1–4) and Mr. White count (0–3).
  - Kick player controls.
- **🤖 Built-in AI Bots for Solo & Party Play:**
  - Add AI bots anytime with 1 click to test or fill missing slots!
  - Bots receive roles, give contextual clues, vote, and attempt Mr. White guesses.
- **🗂️ 100+ Curated Word Pairs Database:**
  - Food, animals, pop culture, sports, gadgets, places, and everyday objects.
  - Automatically shuffles fresh words every single round!
- **🎴 3D Interactive Secret Card Flip:**
  - Confidential agent dossier design with 3D flip card to privately reveal role and secret word.
  - Tap to hide card again to keep it secret from nearby eyes.
- **💬 Turn-Based Clue Phase & Live Discussion:**
  - Turn spotlight, timer, and real-time clue timeline.
  - Quick-peek drawer to view your secret word anytime during clue turns.
  - Live discussion feed and in-game chat for accusations and bluffing.
- **🗳️ Real-time Voting & Elimination:**
  - Interactive suspect cards for alive players.
  - Dramatic Mr. White secret word guess modal when unmasked.
- **🏆 Round Summary & Grand Championship Podium:**
  - Unmasks all roles and secret words at the end of each round.
  - Running leaderboard across rounds.
  - Celebratory confetti explosion and 3D animated podium (🥇 1st, 🥈 2nd, 🥉 3rd).
  - Rematch button to play again with the same group.
- **🔊 Synthesized Web Audio Effects:**
  - Zero-dependency built-in audio synthesis for card flips, clicks, turn cues, countdown ticks, gongs, and victory fanfares.
  - Audio mute/unmute toggle.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### 1. Server Setup
```bash
cd server
npm install
npm run dev
# Server starts on http://localhost:5000
```

### 2. Client Setup
```bash
cd client
npm install
npm start
# Client runs on http://localhost:3000
```

---

## 🌐 Deploying to Vercel & Cloud

### 1. Frontend on Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and log in.
2. Select **Import Git Repository** and choose `parekhhyash/undercover`.
3. Vercel automatically detects the root `vercel.json` configuration (`client/build`).
4. (Optional) In **Environment Variables**, set:
   - `REACT_APP_SERVER_URL`: `https://your-server-backend.onrender.com`
5. Click **Deploy**!

### 2. WebSocket Backend on Render (Free Persistent Node.js)
Because Socket.IO requires persistent WebSockets (which ephemeral serverless functions cannot hold indefinitely), deploy the `server/` directory on Render or Railway:
1. Go to [dashboard.render.com](https://dashboard.render.com/) -> **New** -> **Web Service**.
2. Connect `parekhhyash/undercover`.
3. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Copy your live Render URL (e.g. `https://undercover-server.onrender.com`) and paste it as `REACT_APP_SERVER_URL` in your Vercel project environment settings.

---

## 🛠️ Architecture & Tech Stack

- **Client:** React 19, Vanilla CSS Design System with glassmorphism, responsive design, Canvas Confetti, Web Audio API synthesis.
- **Server:** Node.js, Express, Socket.IO, in-memory state engine (`GameManager`) with PostgreSQL/Supabase database fallback.
- **Security:** Sanitized socket broadcasting ensures players only receive their own secret role and word until round completion.
