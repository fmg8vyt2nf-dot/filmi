# Filmi — Session Context
_Last updated: 2026-04-18_

## Current State
The app is **fully built, deployed, and live**. All pages, game logic, UI, and tooling are complete. App renamed from "Bollywood Guesser" to **Filmi**.

## Live URL
**https://fmg8vyt2nf-dot.github.io/filmi/**
Deployed via GitHub Pages (`npx gh-pages -d dist`). Vite config has `base: '/filmi/'`.

## App Location
- **Directory:** `/Users/maheshdalvi/Documents/Filmi`
- **Stack:** React 19, Vite 8, Tailwind CSS 4, Framer Motion, React Router 7 (HashRouter)
- **Dev port:** 5174
- **Node:** `/Users/maheshdalvi/local/node/bin/node`

## Game Mechanics (as of 2026-04-18)
- **175 movies** across 7 decades (25 per decade): 1960s, 1970s, 1980s, 1990s, 2000s, 2010s, 2020s
- **7 hints per movie** (shuffled in random order every game):
  1. Director 🎬
  2. Supporting Actor 🌟
  3. Lead Actor ⭐
  4. Famous Song 🎵
  5. Plot 📖
  6. Music Composer 🎼
  7. Famous Dialogue 💬
- **Dynamic hint order:** Fisher-Yates shuffle of `[0..6]` stored as `hintOrder` in GameContext, generated fresh on `START_GAME`
- **Results page:** On correct guess, only shows clues the user actually used (not all 7). On gave up, shows all 7.
- XP scoring: `[0, 1000, 800, 600, 450, 300, 150, 75]` (index = hints revealed; 0 = gave up)
- 3 difficulty tiers: Easy (Blockbuster), Medium (Connoisseur), Hard (Cinephile)
- Practice mode (filtered by difficulty + decade) and Daily Challenge (seeded by date)

## Pages (4 total)
1. **HomePage** (`/`) — "FILMI" title, XP Film Pass badge, Practice + Daily buttons
2. **SetupPage** (`/setup`) — Difficulty selector, decade era filter pills (includes 1960s), pool size count
3. **GamePage** (`/play`) — 7 shuffled hint cards, XP potential display, reveal button, guess input with autocomplete, give up modal
4. **ResultsPage** (`/results`) — Movie card, clues used (or all if gave up), XP earned, 7-column XP scale, progress bar

## Design System — "Bollywood Marquee" Theme
- **Background:** `#0d0a15` (deep purple-black) with gold + pink + purple radial glow orbs
- **Primary:** Gold `#FFB800` / `#FFD000`
- **Accent:** Hot Pink `#FF2D6B`
- **Cards:** Near-transparent dark glass, gold left-border accent on revealed hints
- **Particles:** 40-particle canvas (gold/pink/purple dots + bokeh blobs)

## Key Files
| File | Purpose |
|------|---------|
| `src/data/movies.js` | 175 movies (25/decade × 7 decades) with all 7 hint fields incl. composer + dialogue |
| `src/context/GameContext.jsx` | All game state; hintOrder shuffle on START_GAME |
| `src/utils/constants.js` | XP_TABLE, HINT_LABELS (7), HINT_ICONS (7), DIFFICULTIES, DECADES (incl. 1960s) |
| `src/utils/seededRandom.js` | Daily challenge seeding (mulberry32 PRNG) |
| `src/utils/xpLevels.js` | 10 levels: Newcomer → Bollywood God |
| `src/services/soundManager.js` | Web Audio API sounds (no audio files) |
| `src/hooks/useXP.js` | XP persistence to localStorage (`bollywood_xp`) |
| `src/hooks/useGameHistory.js` | Per-game history + daily streak tracking |
| `src/hooks/useAutocomplete.js` | Fuzzy prefix-priority movie title matching |
| `src/pages/GamePage.jsx` | Core gameplay loop with shuffled hints |
| `src/pages/ResultsPage.jsx` | Results — shows only used clues on correct guess |
| `src/components/game/HintCard.jsx` | Props: displayNum, icon, label, value, locked |
| `.claude/settings.json` | Auto-commit hook (triggers after every Write/Edit) |

## Tooling
- **Auto-commit hook** is active: every Write/Edit auto-commits to git
- **Git repo:** https://github.com/fmg8vyt2nf-dot/filmi
- **Deploy command:** `cd "/Users/maheshdalvi/Documents/Filmi" && npm run build && npx gh-pages -d dist`

## Feature Ideas Discussed (Not Yet Built)
Discussed in session on 2026-04-18 — user to pick which to build next:

### 🥇 Top Priority
1. **Share result card** — Wordle-style emoji grid shareable after each game (biggest growth lever)
2. **Daily streak with milestones** — Visual streak counter (3🔥, 7🌟, 30👑), breaks if day missed
3. **"I Know This!" blind guess** — Attempt before any clue for 2000 XP mega bonus

### Other Ideas
4. **Clue reactions** — Witty one-liner on results based on clues used ("Are you sure you're not the director?")
5. **Hint efficiency rating** — Letter grade (S/A/B/C) based on clues used
6. **Hot streak bonus** — XP multiplier after 3 correct games in a row
7. **Director/Actor collector** — Track every person encountered across games
8. **Challenge a Friend mode** — Share a link that locks both players to the same movie
9. **Decade "Tour" progress** — Per-decade completion bar to trigger completionist instinct
10. **Film of the Week** — Special weekend challenge with bonus XP

## How to Resume
1. Open terminal: `cd "/Users/maheshdalvi/Documents/Filmi"`
2. Start dev server: `npm run dev`
3. App runs at `http://localhost:5174`
4. Auto-commit hook is active — file edits auto-commit
5. To deploy: `npm run build && npx gh-pages -d dist`
