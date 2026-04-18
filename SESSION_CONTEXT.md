# Filmi — Session Context
_Last updated: 2026-04-17_

## Current State
The app is **fully built and functional**. All pages, game logic, UI redesign, and tooling are complete. App renamed from "Bollywood Guesser" to **Filmi**.

## What's Been Built

### App Overview
- **Name:** Filmi
- **Location:** `/Users/maheshdalvi/Documents/Filmi`
- **Stack:** React 19, Vite 8, Tailwind CSS 4, Framer Motion, React Router 7
- **Dev port:** 5174 (Trivia App uses 5173)
- **Node:** `/Users/maheshdalvi/local/node/bin/node` (same as Trivia App)

### Game Mechanics
- 104 movies from 1970s–2020s, each with 7 progressive hints:
  1. Release Decade → 2. Genre → 3. Director → 4. Supporting Actor (first name only) → 5. Lead Actor (first name only) → 6. Famous Song → 7. Plot
- User controls when to reveal hints (not auto-revealed on wrong guess)
- XP scoring: `[0, 1000, 800, 600, 450, 300, 150, 75]` (index = hints revealed; 0 = gave up)
- 3 difficulty tiers: Easy (Blockbuster), Medium (Connoisseur), Hard (Cinephile)
- Practice mode (filtered by difficulty + decade era) and Daily Challenge (seeded by date)

### Pages (4 total)
1. **HomePage** (`/`) — "NOW SHOWING / BOLLYWOOD GUESSER" cinema marquee, XP Film Pass badge, Practice + Daily buttons (in-app name still shows "Bollywood Guesser" — update if desired)
2. **SetupPage** (`/setup`) — Difficulty selector (color-coded), decade era filter pills, pool size count
3. **GamePage** (`/play`) — 7 hint cards, XP potential display, reveal button, guess input with autocomplete, give up modal
4. **ResultsPage** (`/results`) — Movie card, all clues revealed, XP earned, 7-column XP scale, progress bar

### Design System — "Bollywood Marquee" Theme
- **Background:** `#0d0a15` (deep purple-black) with gold + pink + purple radial glow orbs
- **Primary:** Gold `#FFB800` / `#FFD000`
- **Accent:** Hot Pink `#FF2D6B`
- **Cards:** Near-transparent dark glass, gold left-border accent on revealed hints
- **Particles:** 40-particle canvas (gold/pink/purple dots + bokeh blobs, no connecting lines)

### Key Files
| File | Purpose |
|------|---------|
| `src/data/movies.js` | 104 movies with all 7 hint fields |
| `src/context/GameContext.jsx` | All game state via useReducer |
| `src/utils/constants.js` | XP_TABLE, HINT_LABELS, HINT_ICONS, DIFFICULTIES, DECADES |
| `src/utils/seededRandom.js` | Daily challenge seeding (mulberry32 PRNG) |
| `src/utils/xpLevels.js` | 10 levels: Newcomer → Bollywood God |
| `src/services/soundManager.js` | Web Audio API sounds (no audio files) |
| `src/hooks/useXP.js` | XP persistence to localStorage (`bollywood_xp`) |
| `src/hooks/useGameHistory.js` | Per-game history + daily streak tracking |
| `src/hooks/useAutocomplete.js` | Fuzzy prefix-priority movie title matching |
| `src/pages/HomePage.jsx` | Cinema marquee home screen |
| `src/pages/SetupPage.jsx` | Difficulty + decade filter setup |
| `src/pages/GamePage.jsx` | Core gameplay loop |
| `src/pages/ResultsPage.jsx` | Results + XP display |
| `src/components/game/HintCard.jsx` | Locked/revealed hint card UI |
| `src/components/game/GuessInput.jsx` | Input with autocomplete dropdown |
| `src/components/effects/ParticleBackground.jsx` | Canvas particle system |
| `src/components/ui/XPBar.jsx` | Gold gradient XP progress bar |
| `.claude/settings.json` | Auto-commit hook (triggers after every Write/Edit) |

### Tooling
- **Auto-commit hook** is active: every Write/Edit auto-commits to git with `auto: YYYY-MM-DD HH:MM:SS`
- **Git repo** has commits — all changes tracked

## Next Steps (None Explicitly Requested)
The app is feature-complete as originally scoped. Possible future additions:
- **Leaderboard page** — save top scores with player name
- **Stats page** — games played, accuracy, favorite decade
- **More movies** — expand the 104-movie pool
- **Poster images** — replace emoji placeholder with actual movie poster images
- **Category filter** — filter by genre (Action, Romance, Drama, etc.) in addition to decade
- **Share results** — copy/share result summary text
- **Streak tracking** — daily challenge consecutive day streak display on home screen

## How to Resume
1. Open terminal: `cd "/Users/maheshdalvi/Documents/Filmi"`
2. Start dev server: `npm run dev` (or use the VS Code launch config)
3. App runs at `http://localhost:5174`
4. Auto-commit hook is already configured — any file edits will auto-commit
