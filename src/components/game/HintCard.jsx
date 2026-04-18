import { motion } from 'framer-motion';
import { HINT_ICONS, HINT_LABELS } from '../../utils/constants';

export default function HintCard({ index, value, locked = false }) {
  const icon = HINT_ICONS[index];
  const label = HINT_LABELS[index];

  if (locked) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 opacity-40">
        <span className="text-lg grayscale">{icon}</span>
        <div>
          <p className="text-xs text-white/40 font-medium">{label}</p>
          <div className="h-3 w-24 mt-1 rounded bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.06] border border-white/10"
    >
      <span className="text-xl mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-white/50 font-medium uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm text-white/90 font-medium leading-snug">{value}</p>
      </div>
    </motion.div>
  );
}
