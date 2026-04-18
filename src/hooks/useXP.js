import { useState, useCallback } from 'react';
import { LS_KEYS } from '../utils/constants';
import { getLevelFromXP, getXPProgress } from '../utils/xpLevels';

function loadXP() {
  try {
    const raw = localStorage.getItem(LS_KEYS.XP);
    return raw ? JSON.parse(raw).totalXP ?? 0 : 0;
  } catch { return 0; }
}

export function useXP() {
  const [totalXP, setTotalXP] = useState(loadXP);

  const addXP = useCallback((amount) => {
    if (!amount || amount <= 0) return;
    setTotalXP(prev => {
      const next = prev + amount;
      localStorage.setItem(LS_KEYS.XP, JSON.stringify({ totalXP: next }));
      return next;
    });
  }, []);

  const level = getLevelFromXP(totalXP);
  const progress = getXPProgress(totalXP);

  return { totalXP, level, progress, addXP };
}
