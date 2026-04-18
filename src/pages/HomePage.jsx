import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useXP } from '../hooks/useXP';
import { useGameHistory } from '../hooks/useGameHistory';
import { useSound } from '../hooks/useSound';
import XPBar from '../components/ui/XPBar';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomePage() {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const { totalXP, level, progress } = useXP();
  const { isDailyDone, dailyStreak, history } = useGameHistory();
  const { play } = useSound();

  function startPractice() {
    play('buttonClick');
    dispatch({ type: 'SET_CONFIG', mode: 'practice', difficulty: 'medium', decadeFilter: null });
    navigate('/setup');
  }

  function startDaily() {
    play('buttonClick');
    if (isDailyDone) return;
    dispatch({ type: 'SET_CONFIG', mode: 'daily', difficulty: null, decadeFilter: null });
    dispatch({ type: 'START_GAME' });
    navigate('/play');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12 relative z-10">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm"
      >
        {/* Marquee header */}
        <motion.div variants={item} className="text-center mb-8">
          {/* Film strip decoration */}
          <div className="flex justify-center gap-1 mb-5 opacity-30">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-4 h-5 rounded-sm border border-primary-500/60 bg-primary-500/5" />
            ))}
          </div>

          <p
            className="text-xs font-black tracking-[0.35em] uppercase mb-3"
            style={{ color: '#FF2D6B' }}
          >
            Now Showing
          </p>

          <h1
            className="text-6xl font-black leading-none tracking-tight mb-4 animate-marquee"
            style={{ color: '#FFB800' }}
          >
            FILMI
          </h1>

          <p className="text-sm text-white/40">
            7 clues. One movie. How few hints do you need?
          </p>
        </motion.div>

        {/* XP card */}
        <motion.div
          variants={item}
          className="mb-5 p-4 rounded-2xl border"
          style={{
            background: 'rgba(255,184,0,0.04)',
            borderColor: 'rgba(255,184,0,0.15)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎟️</span>
              <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Film Pass</span>
            </div>
            {dailyStreak > 0 && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold"
                style={{ color: '#FF2D6B', borderColor: 'rgba(255,45,107,0.35)', background: 'rgba(255,45,107,0.1)' }}
              >
                🔥 {dailyStreak} day streak
              </div>
            )}
          </div>
          <XPBar totalXP={totalXP} level={level} progress={progress} />
        </motion.div>

        {/* Buttons */}
        <motion.div variants={item} className="space-y-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={startPractice}
            className="w-full py-4 rounded-2xl font-black text-base tracking-wide text-black relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FFD000 0%, #FFB800 50%, #FF8C00 100%)',
              boxShadow: '0 8px 32px rgba(255,184,0,0.35), 0 2px 8px rgba(255,184,0,0.2)',
            }}
          >
            🎮 PRACTICE MODE
          </motion.button>

          <motion.button
            whileHover={{ scale: isDailyDone ? 1 : 1.02 }}
            whileTap={{ scale: isDailyDone ? 1 : 0.97 }}
            onClick={startDaily}
            disabled={isDailyDone}
            className="w-full py-4 rounded-2xl font-bold text-base tracking-wide border transition-all"
            style={isDailyDone
              ? { borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.02)', cursor: 'not-allowed' }
              : { borderColor: 'rgba(255,45,107,0.4)', color: '#FF2D6B', background: 'rgba(255,45,107,0.08)' }
            }
          >
            {isDailyDone ? '✅ Daily Complete' : '📅 DAILY CHALLENGE'}
          </motion.button>
        </motion.div>

        {/* Recent games */}
        {history.length > 0 && (
          <motion.div variants={item}>
            <p className="text-xs text-white/25 uppercase tracking-widest mb-3 font-bold">Recent Films</p>
            <div className="space-y-1.5">
              {history.slice(0, 3).map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{h.correct ? '✅' : '❌'}</span>
                    <div>
                      <p className="text-sm text-white/75 font-medium leading-none">{h.title}</p>
                      <p className="text-xs text-white/25 mt-0.5">{h.year}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: h.correct ? '#FFB800' : 'rgba(255,255,255,0.2)' }}>
                    {h.correct ? `+${h.xpEarned}` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Film strip bottom */}
        <motion.div variants={item} className="flex justify-center gap-1 mt-8 opacity-15">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-4 h-5 rounded-sm border border-primary-500/60 bg-primary-500/5" />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
