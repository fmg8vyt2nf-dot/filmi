import { useState, useCallback } from 'react';
import { LS_KEYS } from '../utils/constants';
import { movies } from '../data/movies';

function load() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.DECADE_TOUR) ?? '{}'); }
  catch { return {}; }
}

// Pre-compute total films per decade
export const DECADE_TOTALS = movies.reduce((acc, m) => {
  acc[m.decade] = (acc[m.decade] ?? 0) + 1;
  return acc;
}, {});

export function useDecadeTour() {
  const [tour, setTour] = useState(load);

  const markFilmGuessed = useCallback((movie) => {
    setTour(prev => {
      const existing = prev[movie.decade] ?? [];
      if (existing.includes(movie.id)) return prev;
      const next = { ...prev, [movie.decade]: [...existing, movie.id] };
      localStorage.setItem(LS_KEYS.DECADE_TOUR, JSON.stringify(next));
      return next;
    });
  }, []);

  const getProgress = useCallback((decade) => {
    const guessed = (tour[decade] ?? []).length;
    const total   = DECADE_TOTALS[decade] ?? 25;
    const pct     = total > 0 ? Math.min(100, Math.round((guessed / total) * 100)) : 0;
    return { guessed, total, pct, complete: guessed >= total };
  }, [tour]);

  const overallGuessed = Object.values(tour).flat().length;
  const overallTotal   = Object.values(DECADE_TOTALS).reduce((s, n) => s + n, 0);

  return { tour, markFilmGuessed, getProgress, overallGuessed, overallTotal };
}
