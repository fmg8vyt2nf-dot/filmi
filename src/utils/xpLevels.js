export const LEVEL_THRESHOLDS = [0, 500, 1500, 3000, 5000, 8000, 12000, 17000, 23000, 30000];

export const LEVEL_TITLES = [
  'Newcomer',
  'Fan',
  'Enthusiast',
  'Buff',
  'Expert',
  'Critic',
  'Cinephile',
  'Legend',
  'Icon',
  'Bollywood God',
];

export function getLevelFromXP(totalXP) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getLevelTitle(level) {
  return LEVEL_TITLES[level - 1] || LEVEL_TITLES[0];
}

export function getXPProgress(totalXP) {
  const level = getLevelFromXP(totalXP);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  if (level >= LEVEL_THRESHOLDS.length) {
    return { current: totalXP - currentThreshold, needed: 0, percentage: 100 };
  }

  const xpInLevel = totalXP - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  const percentage = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return { current: xpInLevel, needed: xpNeeded, percentage };
}
