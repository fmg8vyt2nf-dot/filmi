import { createContext, useContext, useReducer } from 'react';
import { movies as allMovies } from '../data/movies';
import { XP_TABLE, WEEKLY_XP_TABLE, WEEKLY_MAX_WRONG, BLIND_XP } from '../utils/constants';
import { getDailyMovie, getTodayKey, getWeeklyMovie, getWeekKey } from '../utils/seededRandom';

const GameContext = createContext(null);

const initialState = {
  mode: 'practice',
  difficulty: 'medium',
  decadeFilter: null,
  status: 'idle',       // 'idle' | 'playing' | 'guessed' | 'given_up'
  movie: null,
  hintsRevealed: 0,
  hintOrder: [0, 1, 2, 3, 4, 5, 6],
  guesses: [],
  xpEarned: 0,
  dailyKey: null,
  weekKey: null,
  maxWrongGuesses: null,
  blindFailed: false,
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickMovie(mode, difficulty, decadeFilter) {
  if (mode === 'daily') return getDailyMovie(allMovies, getTodayKey());
  if (mode === 'weekly') return getWeeklyMovie(allMovies, getWeekKey());
  let pool = allMovies;
  if (difficulty) pool = pool.filter(m => m.difficulty === difficulty);
  if (decadeFilter) pool = pool.filter(m => m.decade === decadeFilter);
  if (pool.length === 0) pool = allMovies;
  return pool[Math.floor(Math.random() * pool.length)];
}

function normalize(str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, mode: action.mode, difficulty: action.difficulty, decadeFilter: action.decadeFilter };

    case 'START_GAME': {
      const movie = pickMovie(state.mode, state.difficulty, state.decadeFilter);
      const hintOrder = shuffle([0, 1, 2, 3, 4, 5, 6]);
      const isWeekly = state.mode === 'weekly';
      return {
        ...initialState,
        mode: state.mode,
        difficulty: state.difficulty,
        decadeFilter: state.decadeFilter,
        status: 'playing',
        movie,
        hintOrder,
        dailyKey: state.mode === 'daily' ? getTodayKey() : null,
        weekKey: isWeekly ? getWeekKey() : null,
        maxWrongGuesses: isWeekly ? WEEKLY_MAX_WRONG : null,
      };
    }

    case 'REVEAL_HINT':
      if (state.hintsRevealed >= 7 || state.status !== 'playing') return state;
      return { ...state, hintsRevealed: state.hintsRevealed + 1 };

    case 'BLIND_GUESS': {
      const correct = normalize(action.guess) === normalize(state.movie.title);
      const newGuesses = [...state.guesses, { value: action.guess, correct, blind: true }];
      if (correct) {
        return { ...state, status: 'guessed', xpEarned: BLIND_XP, guesses: newGuesses };
      }
      return { ...state, blindFailed: true, guesses: newGuesses };
    }

    case 'SUBMIT_GUESS': {
      const guess = action.guess;
      const correct = normalize(guess) === normalize(state.movie.title);
      const newGuesses = [...state.guesses, { value: guess, correct }];
      if (correct) {
        const table = state.mode === 'weekly' ? WEEKLY_XP_TABLE : XP_TABLE;
        const xpEarned = table[state.hintsRevealed] ?? 0;
        return { ...state, status: 'guessed', xpEarned, guesses: newGuesses };
      }
      const wrongCount = newGuesses.filter(g => !g.correct).length;
      if (state.maxWrongGuesses && wrongCount >= state.maxWrongGuesses) {
        return { ...state, status: 'given_up', xpEarned: 0, guesses: newGuesses };
      }
      return { ...state, guesses: newGuesses };
    }

    case 'GIVE_UP':
      return { ...state, status: 'given_up', xpEarned: 0 };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
