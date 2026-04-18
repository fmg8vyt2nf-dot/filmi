import { getLevelTitle } from '../../utils/xpLevels';

export default function XPBar({ totalXP, level, progress, compact = false }) {
  const title = getLevelTitle(level);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-primary-500 tracking-wide">LV{level}</span>
        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress.percentage}%`,
              background: 'linear-gradient(90deg, #FFB800, #FF2D6B)',
            }}
          />
        </div>
        <span className="text-xs text-white/40">{totalXP.toLocaleString()} XP</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-bold text-primary-500 tracking-widest uppercase">Level {level}</span>
          <span className="text-xs text-white/40">·</span>
          <span className="text-xs text-white/50">{title}</span>
        </div>
        <span className="text-xs text-white/30">{totalXP.toLocaleString()} XP</span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/8 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progress.percentage}%`,
            background: 'linear-gradient(90deg, #FFB800 0%, #FF8C00 50%, #FF2D6B 100%)',
            boxShadow: '0 0 10px rgba(255,184,0,0.4)',
          }}
        />
      </div>
      {progress.needed > 0 && (
        <p className="text-xs text-white/25 mt-1.5 text-right">
          {progress.current.toLocaleString()} / {progress.needed.toLocaleString()} to Level {level + 1}
        </p>
      )}
    </div>
  );
}
