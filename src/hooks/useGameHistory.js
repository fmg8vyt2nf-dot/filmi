import { useState, useCallback } from 'react';
import { LS_KEYS } from '../utils/constants';
import { getTodayKey } from '../utils/seededRandom';

function load() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.HISTORY) ?? '[]'); }
  catch { return []; }
}

function loadDaily() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.DAILY) ?? '{}'); }
  catch { return {}; }
}

export function useGameHistory() {
  const [history, setHistory] = useState(load);
  const [daily, setDaily] = useState(loadDaily);

  const saveGame = useCallback(({ movie, xpEarned, hintsUsed, mode }) => {
    const entry = {
      date: new Date().toISOString(),
      movieId: movie.id,
      title: movie.title,
      year: movie.year,
      xpEarned,
      hintsUsed,
      mode,
      correct: xpEarned > 0,
    };

    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 20);
      localStorage.setItem(LS_KEYS.HISTORY, JSON.stringify(next));
      return next;
    });

    if (mode === 'daily') {
      const key = getTodayKey();
      setDaily(prev => {
        const next = { ...prev, [key]: { completed: true, xpEarned, movieId: movie.id, hintsUsed } };
        // Prune to last 30 days
        const keys = Object.keys(next).sort().reverse().slice(0, 30);
        const pruned = Object.fromEntries(keys.map(k => [k, next[k]]));
        localStorage.setItem(LS_KEYS.DAILY, JSON.stringify(pruned));
        return pruned;
      });
    }
  }, []);

  const isDailyDone = daily[getTodayKey()]?.completed ?? false;
  const dailyStreak = (() => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (daily[k]?.completed) streak++;
      else if (i > 0) break;
    }
    return streak;
  })();

  return { history, saveGame, isDailyDone, dailyStreak };
}
