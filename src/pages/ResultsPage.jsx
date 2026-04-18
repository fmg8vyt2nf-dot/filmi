import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useXP } from '../hooks/useXP';
import { useSound } from '../hooks/useSound';
import { HINT_LABELS, HINT_ICONS, XP_TABLE } from '../utils/constants';
import XPBar from '../components/ui/XPBar';

function getHintValue(movie, index) {
  const values = [
    movie.decade,
    movie.genre,
    movie.director,
    movie.supportingActor,
    movie.leadActor,
    `"${movie.song}"`,
    movie.plot,
  ];
  return values[index];
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { totalXP, level, progress } = useXP();
  const { play } = useSound();
  const { movie, status, hintsRevealed, xpEarned, mode, difficulty } = state;

  if (!movie) {
    navigate('/');
    return null;
  }

  const correct = status === 'guessed';

  function playAgain() {
    play('buttonClick');
    if (mode === 'practice') {
      dispatch({ type: 'START_GAME' });
      navigate('/play');
    } else {
      navigate('/');
    }
  }

  function goHome() {
    play('buttonClick');
    dispatch({ type: 'RESET' });
    navigate('/');
  }

  function goSetup() {
    play('buttonClick');
    dispatch({ type: 'RESET' });
    navigate('/setup');
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Result Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{correct ? '🎉' : '😔'}</div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {correct ? 'You got it!' : 'Better luck next time!'}
          </h2>
          <p className="text-white/50 text-sm">
            {correct
              ? `Guessed in ${hintsRevealed} hint${hintsRevealed !== 1 ? 's' : ''}`
              : 'The answer was revealed'}
          </p>
        </div>

        {/* Movie Card */}
        <div className="mb-6 p-5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-xl">
          {/* Gradient poster placeholder */}
          <div
            className="w-full h-28 rounded-xl mb-4 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, rgba(255,107,53,0.3) 0%, rgba(14,165,233,0.2) 100%)`,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span className="text-5xl">🎬</span>
          </div>

          <h3 className="text-xl font-bold text-white">{movie.title}</h3>
          <p className="text-sm text-white/40 mb-3">{movie.year} · {movie.genre}</p>

          {correct && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-xs text-white/40">XP Earned</p>
                <p className="text-xl font-bold text-primary-400">+{xpEarned}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-white/40">Hints Used</p>
                <p className="text-lg font-bold text-white">{hintsRevealed}/7</p>
              </div>
            </div>
          )}
        </div>

        {/* All Hints Revealed */}
        <div className="mb-6">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">All Clues</p>
          <div className="space-y-2">
            {Array.from({ length: 7 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex items-start gap-3 p-3 rounded-xl ${
                  i < hintsRevealed
                    ? 'bg-white/[0.06] border border-white/10'
                    : 'bg-white/[0.02] border border-white/5 opacity-50'
                }`}
              >
                <span className="text-lg mt-0.5">{HINT_ICONS[i]}</span>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wide mb-0.5">{HINT_LABELS[i]}</p>
                  <p className="text-sm text-white/80">{getHintValue(movie, i)}</p>
                </div>
                {i >= hintsRevealed && (
                  <span className="ml-auto text-xs text-white/20 mt-0.5">not revealed</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-white/[0.04] border border-white/8">
          <p className="text-xs text-white/40 mb-3">Your Progress</p>
          <XPBar totalXP={totalXP} level={level} progress={progress} />
        </div>

        {/* XP Scale */}
        <div className="mb-8 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">XP Scale</p>
          <div className="grid grid-cols-4 gap-1.5">
            {XP_TABLE.slice(1).map((xp, i) => (
              <div
                key={i}
                className={`text-center p-2 rounded-lg ${
                  hintsRevealed === i + 1 && correct
                    ? 'bg-primary-500/20 border border-primary-500/40'
                    : 'bg-white/[0.03]'
                }`}
              >
                <p className={`text-xs font-bold ${hintsRevealed === i + 1 && correct ? 'text-primary-400' : 'text-white/40'}`}>
                  {i + 1} hint{i !== 0 ? 's' : ''}
                </p>
                <p className={`text-sm font-bold ${hintsRevealed === i + 1 && correct ? 'text-primary-300' : 'text-white/30'}`}>
                  {xp}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {mode === 'practice' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={playAgain}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg shadow-xl shadow-primary-500/25"
            >
              🎬 Play Again
            </motion.button>
          )}
          {mode === 'practice' && (
            <button
              onClick={goSetup}
              className="w-full py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/[0.05] transition-all"
            >
              Change Settings
            </button>
          )}
          <button
            onClick={goHome}
            className="w-full py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/[0.05] transition-all"
          >
            ← Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
