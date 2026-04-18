import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useXP } from '../hooks/useXP';
import { useGameHistory } from '../hooks/useGameHistory';
import { useSound } from '../hooks/useSound';
import XPBar from '../components/ui/XPBar';

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🎬</div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Bollywood
            <span className="text-primary-500"> Guesser</span>
          </h1>
          <p className="text-white/50 text-sm">Guess the movie from hidden clues. Fewer hints = more XP!</p>
        </div>

        {/* XP Card */}
        <div className="mb-6 p-4 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider">Your Progress</p>
              <p className="text-white font-semibold">Level {level}</p>
            </div>
            {dailyStreak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-streak/15 border border-streak/30">
                <span>🔥</span>
                <span className="text-sm font-bold text-streak">{dailyStreak} day streak</span>
              </div>
            )}
          </div>
          <XPBar totalXP={totalXP} level={level} progress={progress} />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startPractice}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
          >
            🎮 Practice Mode
          </motion.button>

          <motion.button
            whileHover={{ scale: isDailyDone ? 1 : 1.02 }}
            whileTap={{ scale: isDailyDone ? 1 : 0.98 }}
            onClick={startDaily}
            disabled={isDailyDone}
            className={`w-full py-4 rounded-2xl border font-bold text-lg transition-all ${
              isDailyDone
                ? 'border-white/10 bg-white/[0.04] text-white/30 cursor-not-allowed'
                : 'border-accent/40 bg-accent/10 text-accent hover:bg-accent/20'
            }`}
          >
            {isDailyDone ? '✅ Daily Challenge Complete' : '🗓️ Daily Challenge'}
          </motion.button>
        </div>

        {/* Recent Games */}
        {history.length > 0 && (
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Recent Games</p>
            <div className="space-y-2">
              {history.slice(0, 3).map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                >
                  <div className="flex items-center gap-2">
                    <span>{h.correct ? '✅' : '❌'}</span>
                    <span className="text-sm text-white/80">{h.title}</span>
                    <span className="text-xs text-white/30">{h.year}</span>
                  </div>
                  <span className={`text-sm font-semibold ${h.correct ? 'text-primary-400' : 'text-white/30'}`}>
                    {h.correct ? `+${h.xpEarned} XP` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
