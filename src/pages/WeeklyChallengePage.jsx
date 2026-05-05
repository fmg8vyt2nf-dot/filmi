import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useWeeklyChallenge } from '../hooks/useWeeklyChallenge';
import { useSound } from '../hooks/useSound';
import { WEEKLY_XP_TABLE, WEEKLY_MAX_WRONG } from '../utils/constants';
import { getTimeUntilNextWeek } from '../utils/seededRandom';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function formatCountdown(ms) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function getWeekNumber() {
  const d = new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
}

export default function WeeklyChallengePage() {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const { isWeeklyDone, currentResult, weeklyStreak } = useWeeklyChallenge();
  const { play } = useSound();
  const [countdown, setCountdown] = useState(formatCountdown(getTimeUntilNextWeek()));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(formatCountdown(getTimeUntilNextWeek()));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  function startWeekly() {
    play('buttonClick');
    dispatch({ type: 'SET_CONFIG', mode: 'weekly', difficulty: null, decadeFilter: null });
    dispatch({ type: 'START_GAME' });
    navigate('/play');
  }

  function goHome() {
    play('buttonClick');
    navigate('/');
  }

  const weekNum = getWeekNumber();

  return (
    <div className="min-h-screen flex flex-col items-center px-5 py-10 relative z-10">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm"
      >
        {/* Header */}
        <motion.div variants={item} className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-5xl mb-4"
          >
            🏆
          </motion.div>
          <p className="text-xs font-black tracking-[0.3em] uppercase mb-2"
            style={{ color: '#a855f7' }}>
            Film of the Week
          </p>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">
            Week {weekNum}
          </h1>
          <p className="text-sm text-white/35">One legendary film. One week. One shot.</p>
        </motion.div>

        {isWeeklyDone ? (
          /* ── Already played this week ── */
          <>
            <motion.div variants={item}
              className="mb-5 p-5 rounded-2xl text-center"
              style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <div className="text-3xl mb-3">{currentResult?.correct ? '🎉' : '💪'}</div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: currentResult?.correct ? '#a855f7' : 'rgba(255,255,255,0.3)' }}>
                {currentResult?.correct ? 'Challenge Complete!' : 'Better luck next week'}
              </p>
              <h2 className="text-xl font-black text-white mt-1">{currentResult?.title}</h2>
              <p className="text-sm text-white/30 mt-0.5 mb-4">{currentResult?.year}</p>

              {currentResult?.correct && (
                <div className="flex items-center justify-center gap-6 p-3 rounded-xl"
                  style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-wider font-bold mb-0.5">XP Earned</p>
                    <p className="text-2xl font-black" style={{ color: '#a855f7' }}>+{currentResult.xpEarned}</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-wider font-bold mb-0.5">Clues Used</p>
                    <p className="text-2xl font-black text-white">{currentResult.hintsUsed}<span className="text-white/30 text-sm">/7</span></p>
                  </div>
                </div>
              )}
            </motion.div>

            {weeklyStreak > 1 && (
              <motion.div variants={item}
                className="mb-5 flex items-center justify-center gap-2 p-3 rounded-xl"
                style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.12)' }}>
                <span className="text-lg">🔥</span>
                <p className="text-sm font-bold" style={{ color: '#a855f7' }}>
                  {weeklyStreak}-week streak!
                </p>
              </motion.div>
            )}

            <motion.div variants={item}
              className="mb-6 p-4 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs text-white/25 uppercase tracking-widest font-bold mb-1">Next film unlocks in</p>
              <p className="text-2xl font-black" style={{ color: '#a855f7' }}>{countdown}</p>
            </motion.div>
          </>
        ) : (
          /* ── Not yet played ── */
          <>
            {/* Mystery film card */}
            <motion.div variants={item}
              className="mb-5 p-5 rounded-2xl relative overflow-hidden"
              style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.18)' }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(168,85,247,0.12), transparent 70%)' }} />
              <div className="relative w-full h-28 rounded-xl mb-4 flex flex-col items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(255,45,107,0.1) 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-4xl mb-1">🎬</span>
                <p className="text-xs text-white/20 font-bold tracking-widest uppercase">Mystery Film</p>
              </div>
              <p className="text-center text-sm text-white/40 leading-relaxed">
                This week's film has been sealed. Reveal clues wisely — you only get <span className="text-white/70 font-bold">{WEEKLY_MAX_WRONG} wrong guesses</span>.
              </p>
            </motion.div>

            {/* Rules */}
            <motion.div variants={item} className="mb-5 space-y-2">
              {[
                { icon: '💎', label: 'Bonus XP', desc: `Up to ${WEEKLY_XP_TABLE[1].toLocaleString()} XP — double the usual` },
                { icon: '⚠️', label: 'Limited attempts', desc: `Only ${WEEKLY_MAX_WRONG} wrong guesses allowed` },
                { icon: '🔒', label: 'One shot per week', desc: 'Same film for everyone, resets Monday' },
              ].map(({ icon, label, desc }) => (
                <div key={label}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.1)' }}>
                  <span className="text-lg mt-0.5">{icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white/80">{label}</p>
                    <p className="text-xs text-white/35 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {weeklyStreak > 0 && (
              <motion.div variants={item}
                className="mb-5 flex items-center justify-center gap-2 p-3 rounded-xl"
                style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.12)' }}>
                <span className="text-lg">🔥</span>
                <p className="text-sm font-bold" style={{ color: '#a855f7' }}>
                  Keep your {weeklyStreak}-week streak alive!
                </p>
              </motion.div>
            )}

            {/* XP scale */}
            <motion.div variants={item} className="mb-6 p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs font-bold text-white/25 uppercase tracking-widest mb-3">Weekly XP Scale</p>
              <div className="grid grid-cols-7 gap-1">
                {WEEKLY_XP_TABLE.slice(1).map((xp, i) => (
                  <div key={i} className="text-center p-1.5 rounded-lg"
                    style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.15)' }}>
                    <p className="text-[10px] font-bold mb-0.5" style={{ color: 'rgba(168,85,247,0.6)' }}>{i + 1}</p>
                    <p className="text-[10px] font-black leading-none" style={{ color: '#a855f7' }}>
                      {xp >= 1000 ? `${xp / 1000}k` : xp}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={item} className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={startWeekly}
                className="w-full py-4 rounded-2xl font-black text-base tracking-wide text-white"
                style={{
                  background: 'linear-gradient(135deg, #9333ea, #a855f7, #7c3aed)',
                  boxShadow: '0 8px 32px rgba(168,85,247,0.35)',
                }}
              >
                🏆 ACCEPT THE CHALLENGE
              </motion.button>
            </motion.div>
          </>
        )}

        {/* Home button */}
        <motion.div variants={item} className="mt-4">
          <button onClick={goHome}
            className="w-full py-3 rounded-xl text-sm font-bold text-white/30 hover:text-white/50 transition-all">
            ← Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
