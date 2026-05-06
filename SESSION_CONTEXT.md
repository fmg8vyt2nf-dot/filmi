# Filmi — Session Context
_Last updated: 2026-05-06_

## Current State
The app is **fully built, tested, and live** with 175 movies, 5 game modes, and a rich feature set.

**Live URL:** https://fmg8vyt2nf-dot.github.io/filmi/
**Repo:** https://github.com/fmg8vyt2nf-dot/filmi

## Features Built (complete)

### Game Modes
| Mode | Description | XP | Special Rules |
|------|------------|-----|---------------|
| 🎞️ Reel Time | Practice — pick difficulty + era | Normal | Unlimited replays |
| 📅 Daily Challenge | Seeded by date, once/day | Normal | Resets midnight |
| 🏆 Film of the Week | Seeded by ISO week, once/week | 2× (up to 2500) | Max 3 wrong guesses |

### Gameplay
- **7 hints per movie**, shuffled randomly each game (Director, Supporting Actor, Lead Actor, Famous Song, Plot, Music Composer, Famous Dialogue)
- **⚡ "I Know This!" blind guess** — pulsing button before any clue; 2500 XP if correct, play continues normally if wrong
- **Results page** — shows only clues used on correct guess; special ⚡ banner for blind wins; 🆕 new discovery badge for first-time directors/actors

### Progression & Collection
- **XP & Levels** — 10 levels, XP bar on home screen
- **📚 Film Encyclopedia** (`/collector`) — tracks every director + actor guessed correctly; Directors/Actors tabs sorted by count; Era Tour progress bars
- **🗺️ Decade Tour** — SetupPage era cards with animated progress bars (X/25 per decade, ✅ on completion)
- **Daily streak** — tracked with 🔥 badge on home screen
- **Weekly streak** — tracked with 🏆 badge on home screen

## Movie Database
- **175 movies** — exactly 25 per decade × 7 decades (1960s–2020s)
- All 7 hint fields per movie: director, supportingActor, leadActor, song, plot, composer, dialogue
- Difficulty spread: easy 45, medium 83, hard 47

## Files Modified (this session)

| File | Change |
|------|--------|
| `src/utils/constants.js` | Added BLIND_XP=2500, ERA_EMOJIS, LS_KEYS.COLLECTOR/DECADE_TOUR |
| `src/context/GameContext.jsx` | Added BLIND_GUESS action, blindFailed state, weekly mode |
| `src/hooks/useCollector.js` | **New** — tracks directors/actors per correct guess |
| `src/hooks/useDecadeTour.js` | **New** — tracks guessed films per decade, progress |
| `src/hooks/useWeeklyChallenge.js` | **New** — weekly state, streak, saveWeekly() |
| `src/pages/GamePage.jsx` | ⚡ blind guess button, weekly badge, attempts counter |
| `src/pages/SetupPage.jsx` | Decade Tour cards with animated progress bars |
| `src/pages/ResultsPage.jsx` | Blind win display, 🆕 new discoveries banner |
| `src/pages/CollectorPage.jsx` | **New** — Film Encyclopedia page |
| `src/pages/WeeklyChallengePage.jsx` | **New** — weekly lobby with rules, countdown |
| `src/pages/HomePage.jsx` | Reel Time rename, weekly button, encyclopedia link |
| `src/App.jsx` | Routes: /weekly, /collector |
| `src/data/movies.js` | Fixed: added 11 missing films (1990s +4, 2000s +3, 2020s +4) |
| `src/utils/seededRandom.js` | Added getWeekKey, getWeeklyMovie, getTimeUntilNextWeek |

## Key Decisions
- **BLIND_XP = 2500** — higher than both normal (1000) and weekly (2000) first-clue XP, making it always worth attempting
- **Blind guess in reducer** (`BLIND_GUESS` action) — keeps all game logic in one place; sets `blindFailed: true` on miss so button disappears and normal play resumes
- **Collector records on correct guess only** — tracks director + leadActor + supportingActor; ResultsPage detects new discoveries by checking `count === 1` after GamePage has already saved
- **Decade Tour uses animated bars** — `motion.div` width animation on mount for satisfying progress reveal
- **Testing before committing** — smoke test suite (23 checks) caught 11 missing movies; all now pass

## Remaining Feature Ideas (backlog)
1. **Share result card** 🥇 — Wordle-style emoji grid, biggest viral growth lever
2. **Daily streak milestones** — Visual rewards at 3🔥, 7🌟, 30👑 day streaks
3. **Clue reactions** — Witty one-liner on results based on clues used
4. **Hint efficiency rating** — Letter grade S/A/B/C based on clues used
5. **Hot streak bonus** — XP multiplier after 3 correct games in a row
6. **Challenge a Friend** — Shareable link locking two players to same movie

## How to Resume
1. `cd "/Users/maheshdalvi/Documents/Filmi"`
2. `npm run dev` → http://localhost:5174/filmi/
3. To deploy: `npm run build && npx gh-pages -d dist`
4. To run tests: `node --input-type=module < test-smoke.js` (or paste test block from this session)
5. Tell Claude which backlog item to build next
