import { useCallback } from 'react';
import { soundManager } from '../services/soundManager';

export function useSound() {
  const play = useCallback((name) => soundManager.play(name), []);
  return { play };
}
