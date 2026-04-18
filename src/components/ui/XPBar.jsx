import { getLevelTitle } from '../../utils/xpLevels';

export default function XPBar({ totalXP, level, progress, compact = false }) {
  const title = getLevelTitle(level);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-primary-500">Lv.{level}</span>
        <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-amber-400 transition-all duration-700"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <span className="text-xs text-white/50">{totalXP.toLocaleString()} XP</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-semibold text-white/80">
          Level {level} · <span className="text-primary-400">{title}</span>
        </span>
        <span className="text-xs text-white/50">{totalXP.toLocaleString()} XP total</span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-amber-400 transition-all duration-700"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
      {progress.needed > 0 && (
        <p className="text-xs text-white/40 mt-1 text-right">
          {progress.current} / {progress.needed} to Level {level + 1}
        </p>
      )}
    </div>
  );
}
