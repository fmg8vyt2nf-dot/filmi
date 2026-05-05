// XP earned indexed by number of hints revealed (0 = give up)
export const XP_TABLE = [0, 1000, 800, 600, 450, 300, 150, 75];

export const HINT_LABELS = [
  'Director',
  'Supporting Actor',
  'Lead Actor',
  'Famous Song',
  'Plot',
  'Music Composer',
  'Famous Dialogue',
];

export const HINT_ICONS = ['🎬', '🌟', '⭐', '🎵', '📖', '🎼', '💬'];

export const DIFFICULTIES = [
  { id: 'easy', label: 'Blockbuster', emoji: '🍿', desc: 'All-time classics everyone knows' },
  { id: 'medium', label: 'Connoisseur', emoji: '🎬', desc: 'Popular films for true fans' },
  { id: 'hard', label: 'Cinephile', emoji: '🏆', desc: 'Cult classics & hidden gems' },
];

export const DECADES = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

export const LS_KEYS = {
  XP: 'bollywood_xp',
  DAILY: 'bollywood_daily',
  WEEKLY: 'filmi_weekly',
  HISTORY: 'bollywood_history',
  SETTINGS: 'bollywood_settings',
};

// Double XP for the weekly challenge
export const WEEKLY_XP_TABLE = [0, 2000, 1600, 1200, 900, 600, 300, 150];
export const WEEKLY_MAX_WRONG = 3;
