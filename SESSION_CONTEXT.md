# Filmi — Session Context
_Last updated: 2026-05-05_

## Current State
The app is **fully built, deployed, and live** with 4 game modes and 175 movies.

**Live URL:** https://fmg8vyt2nf-dot.github.io/filmi/

## Files Modified (this session)

| File | Change |
|------|--------|
| `src/utils/seededRandom.js` | Added `getWeekKey()`, `getWeeklyMovie()`, `getTimeUntilNextWeek()` |
| `src/utils/constants.js` | Added `LS_KEYS.WEEKLY`, `WEEKLY_XP_TABLE` (2x), `WEEKLY_MAX_WRONG = 3` |
| `src/context/GameContext.jsx` | Added `weekly` mode to `pickMovie`, `maxWrongGuesses` state, auto give-up on 3 wrong, weekly XP table |
| `src/hooks/useWeeklyChallenge.js` | **New** — weekly state, streak, `saveWeekly()`, localStorage under `filmi_weekly` |
| `src/pages/WeeklyChallengePage.jsx` | **New** — lobby page: rules, mystery card, XP scale, countdown, post-play result |
| `src/pages/GamePage.jsx` | Weekly badge, attempts-left counter, purple accent, `saveWeekly()` on game end |
| `src/pages/HomePage.jsx` | Purple `🏆 FILM OF THE WEEK` button, weekly streak badge, weekly tag in Recent Films |
| `src/App.jsx` | Added `/weekly` route → `WeeklyChallengePage` |

## App Architecture

### Game Modes (4 total)
1. **Practice** — filtered by difficulty + decade, unlimited replays
2. **Daily** — seeded by date (`YYYY-MM-DD`), once per day, pink theme
3. **Weekly** — seeded by ISO week (`YYYY-WXX`), once per week, purple theme, hard-film pool
4. _(Daily via GameContext START_GAME)_

### Weekly Challenge specifics
- **Movie pool:** hard-difficulty films (falls back to all 175 if pool < 15)
- **XP:** `[0, 2000, 1600, 1200, 900, 600, 300, 150]` — double normal
- **Limit:** 3 wrong guesses max → auto give-up in reducer
- **Reset:** Every Monday midnight
- **Storage:** `filmi_weekly` in localStorage, keyed by week string

### Hint System
- 7 hints per movie, shuffled in random order every game (`hintOrder` in GameContext)
- Labels: Director 🎬, Supporting Actor 🌟, Lead Actor ⭐, Famous Song 🎵, Plot 📖, Music Composer 🎼, Famous Dialogue 💬
- Results page: shows only used clues on correct guess; all 7 on give-up

### Movie Database
- **175 movies** — 25 per decade × 7 decades (1960s–2020s)
- Every movie has: `id, title, year, decade, difficulty, director, supportingActor, leadActor, song, plot, composer, dialogue`

## Key Decisions
- **Purple as weekly accent** (`#a855f7`) — distinct from gold (practice) and pink (daily)
- **Hard-film pool for weekly** — makes it feel prestigious/challenging
- **Auto give-up in reducer** (not UI) on 3rd wrong guess — cleaner than handling in component
- **Lobby page before weekly starts** — builds anticipation, explains stakes
- **Weekly button always navigates to `/weekly`** — even when done, to see result + countdown

## Feature Ideas Discussed (backlog)
1. **Share result card** 🥇 — Wordle-style emoji grid (biggest growth lever)
2. **Daily streak milestones** — Visual rewards at 3🔥, 7🌟, 30👑
3. **"I Know This!" blind guess** — Attempt before any clue for mega XP bonus
4. **Clue reactions** — Witty one-liner on results based on clues used
5. **Hint efficiency rating** — Letter grade (S/A/B/C)
6. **Hot streak bonus** — XP multiplier after 3 correct in a row
7. **Director/Actor collector** — Track every person encountered
8. **Challenge a Friend** — Shareable link locking both to same movie
9. **Decade Tour progress** — Per-decade completion bar
10. ✅ ~~Film of the Week~~ — **Done this session**

## How to Resume
1. `cd "/Users/maheshdalvi/Documents/Filmi"`
2. `npm run dev` → http://localhost:5174
3. Deploy: `npm run build && npx gh-pages -d dist`
4. Tell Claude: _"Let's build the share result card feature"_ (or whichever backlog item)
