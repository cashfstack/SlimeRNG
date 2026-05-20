# Slime RNG

A browser-based RNG collecting game. Roll for slimes, collect mutations, upgrade your luck, and hunt for the rarest creatures.

![Game Preview](https://img.shields.io/badge/Slimes-140-purple) ![Rarities](https://img.shields.io/badge/Rarities-15-blue) ![Mutations](https://img.shields.io/badge/Mutations-5-pink)

---

## How to Play

- Press **ROLL** to get a random slime
- Each slime has a rarity from Common (1 in 2) to Developer (1 in 12,000,000)
- Slimes can roll with **mutations** (Big, Huge, Rainbow, Shiny, Lava) that multiply the odds
- Spend credits on **upgrades** to roll faster, get luckier, and earn more
- **Equip** a slime to earn passive income every 10 seconds
- **Rebirth** to reset upgrades but gain permanent luck boosts
- Check the **Index** to see all 140 slimes and track your collection

---

## Quick Start (No Install Needed)

If you just want to play the game right now:

1. Run `npm install` then `npm run build` (see below)
2. Open the file `dist/index.html` in any web browser
3. That single file IS the entire game — no server needed

You can also just double-click `dist/index.html` from your file explorer.

---

## Setup & Run

### What You Need

- **Node.js** (version 18 or newer) — download it free from [https://nodejs.org](https://nodejs.org)
- That's it. Node.js comes with `npm` which handles everything else.

### Step 1 — Install

Open a terminal in the project folder and run:

```
npm install
```

This downloads all the libraries the game needs. Only takes a minute.

### Step 2 — Run the Game

**Option A — Development mode (live reload):**

```
npm run dev
```

Then open the link shown in the terminal (usually `http://localhost:5173`).

**Option B — Build and open directly:**

```
npm run build
```

Then open `dist/index.html` in your browser. This is a single self-contained file you can share, email, or put on a USB drive.

---

## How to Open a Terminal

If you don't have access to PowerShell or Command Prompt, here are other ways:

### Windows

- **File Explorer method:** Open the project folder in File Explorer, click the address bar at the top, type `cmd` and press Enter. A terminal opens in that folder.
- **Git Bash:** If you have Git installed, right-click inside the folder and select "Git Bash Here."
- **VS Code:** Open the folder in VS Code, then press `` Ctrl+` `` to open the built-in terminal.
- **Windows Terminal:** Available free from the Microsoft Store.

### Mac

- Open **Finder**, go to the project folder
- Right-click the folder and select **"New Terminal at Folder"**
- Or open the **Terminal** app (in Applications > Utilities) and drag the folder onto it

### Linux

- Right-click inside the folder and select **"Open Terminal Here"**
- Or open your terminal app and `cd` to the folder

### Chromebook

- Enable **Linux (Beta)** in Settings > Advanced > Developers
- Open the **Terminal** app
- Move the project folder into "Linux files" in your file manager
- Then `cd` to it and run the commands above

### No Terminal at All?

If you truly cannot open any terminal:

1. Ask someone to run `npm run build` for you once
2. They give you the `dist/index.html` file
3. Open that file in Chrome, Firefox, Edge, or Safari
4. Done — the whole game is in that one file

---

## Project Structure

```
├── src/
│   ├── App.tsx              — Main game (rolling, tabs, UI)
│   ├── components/
│   │   ├── SlimeRenderer.tsx — Draws each slime (SVG, procedural)
│   │   └── Icons.tsx         — All UI icons (SVG)
│   ├── game/
│   │   ├── config.ts         — Slime data, rarities, upgrades
│   │   └── storage.ts        — Save/load (localStorage)
│   ├── index.css             — All styling
│   └── main.tsx              — Entry point
├── index.html                — HTML shell
├── package.json              — Dependencies & scripts
└── README.md                 — This file
```

---

## Game Features

| Feature | Details |
|---------|---------|
| Slimes | 140 unique procedurally generated slimes |
| Rarities | 15 tiers from Common to Developer |
| Mutations | Big, Huge, Rainbow, Shiny, Lava — stackable |
| Upgrades | 8 upgrades with visible boost values |
| Passive Income | Equip a slime to earn credits automatically |
| Rebirth | Reset for permanent luck multipliers |
| Index | See all slimes, locked ones shown as silhouettes |
| Auto Roll | Toggle automatic rolling |
| Daily Rewards | 7-day streak system |
| Quests | 3 achievement quests with credit rewards |
| Titles | Unlock titles by hitting milestones |
| Save System | Auto-saves to browser localStorage |
| AFK Rewards | Earn credits while away |

---

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Vite (with single-file build)

---

## License

Free to use, modify, and learn from.
