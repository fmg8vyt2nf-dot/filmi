import { createContext, useContext, useReducer } from 'react';
import { movies as allMovies } from '../data/movies';
import { XP_TABLE } from '../utils/constants';
import { getDailyMovie, getTodayKey } from '../utils/seededRandom';

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
  let pool = allMovies;
  if (mode === 'daily') {
    return getDailyMovie(allMovies, getTodayKey());
  }
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
      return {
        ...initialState,
        mode: state.mode,
        difficulty: state.difficulty,
        decadeFilter: state.decadeFilter,
        status: 'playing',
        movie,
        hintOrder,
        dailyKey: state.mode === 'daily' ? getTodayKey() : null,
      };
    }

    case 'REVEAL_HINT':
      if (state.hintsRevealed >= 7 || state.status !== 'playing') return state;
      return { ...state, hintsRevealed: state.hintsRevealed + 1 };

    case 'SUBMIT_GUESS': {
      const guess = action.guess;
      const correct = normalize(guess) === normalize(state.movie.title);
      if (correct) {
        const xpEarned = XP_TABLE[state.hintsRevealed] ?? 0;
        return { ...state, status: 'guessed', xpEarned, guesses: [...state.guesses, { value: guess, correct: true }] };
      }
      return { ...state, guesses: [...state.guesses, { value: guess, correct: false }] };
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
