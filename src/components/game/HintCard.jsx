import { motion } from 'framer-motion';

export default function HintCard({ displayNum, icon, label, value, locked = false }) {
  const num = String(displayNum).padStart(2, '0');

  if (locked) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
        <span
          className="text-2xl font-black tabular-nums shrink-0 w-8 text-center"
          style={{ color: 'rgba(255,184,0,0.12)', fontVariantNumeric: 'tabular-nums' }}
        >
          {num}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm opacity-20">{icon}</span>
            <span className="text-xs text-white/15 font-medium uppercase tracking-wider">{label}</span>
          </div>
          <div className="mt-1 h-2 w-24 rounded bg-white/[0.05]" />
        </div>
        <span className="text-white/10 text-sm shrink-0">🔒</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -18, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-primary-500/25 bg-primary-500/[0.06] relative overflow-hidden"
      style={{ boxShadow: '0 0 0 1px rgba(255,184,0,0.08), inset 0 0 20px rgba(255,184,0,0.03)' }}
    >
      {/* Gold left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
        style={{ background: 'linear-gradient(180deg, #FFB800, #FF8C00)' }}
      />
      <span
        className="text-2xl font-black tabular-nums shrink-0 w-8 text-center"
        style={{ color: '#FFB800', textShadow: '0 0 12px rgba(255,184,0,0.5)' }}
      >
        {num}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm">{icon}</span>
          <span className="text-xs text-primary-400 font-semibold uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-sm text-white/90 leading-snug font-medium">{value}</p>
      </div>
    </motion.div>
  );
}
