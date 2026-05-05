import { useState, useCallback } from 'react';
import { LS_KEYS } from '../utils/constants';
import { getWeekKey } from '../utils/seededRandom';

function loadWeekly() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.WEEKLY) ?? '{}'); }
  catch { return {}; }
}

export function useWeeklyChallenge() {
  const [weekly, setWeekly] = useState(loadWeekly);

  const saveWeekly = useCallback(({ movie, xpEarned, hintsUsed }) => {
    const key = getWeekKey();
    setWeekly(prev => {
      // Keep last 52 weeks
      const entries = Object.entries(prev).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 51);
      const pruned = Object.fromEntries(entries);
      const next = {
        ...pruned,
        [key]: {
          completed: true,
          xpEarned,
          hintsUsed,
          movieId: movie.id,
          title: movie.title,
          year: movie.year,
          correct: xpEarned > 0,
        },
      };
      localStorage.setItem(LS_KEYS.WEEKLY, JSON.stringify(next));
      return next;
    });
  }, []);

  const currentKey = getWeekKey();
  const isWeeklyDone = weekly[currentKey]?.completed ?? false;
  const currentResult = weekly[currentKey] ?? null;

  // Consecutive weeks streak
  const weeklyStreak = (() => {
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 52; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i * 7);
      const startOfYear = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
      const k = `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
      if (weekly[k]?.completed) streak++;
      else if (i > 0) break;
    }
    return streak;
  })();

  return { isWeeklyDone, currentResult, weeklyStreak, saveWeekly, currentKey };
}
