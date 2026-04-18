import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useXP } from '../hooks/useXP';
import { useGameHistory } from '../hooks/useGameHistory';
import { useSound } from '../hooks/useSound';
import { XP_TABLE, HINT_LABELS, HINT_ICONS } from '../utils/constants';
import HintCard from '../components/game/HintCard';
import GuessInput from '../components/game/GuessInput';
import Confetti from '../components/effects/Confetti';

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

export default function GamePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { addXP } = useXP();
  const { saveGame } = useGameHistory();
  const { play } = useSound();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [xpFlash, setXpFlash] = useState(null);
  const savedRef = useRef(false);

  const { movie, status, hintsRevealed, guesses, xpEarned, mode } = state;

  // Redirect if no active game
  useEffect(() => {
    if (!movie) navigate('/');
  }, [movie, navigate]);

  // Handle game end
  useEffect(() => {
    if ((status === 'guessed' || status === 'given_up') && !savedRef.current) {
      savedRef.current = true;
      if (status === 'guessed') {
        setShowConfetti(true);
        play('correct');
        setXpFlash(`+${xpEarned} XP`);
        addXP(xpEarned);
        setTimeout(() => setXpFlash(null), 1500);
      } else {
        play('giveUp');
      }
      saveGame({ movie, xpEarned, hintsUsed: hintsRevealed, mode });
      setTimeout(() => navigate('/results'), status === 'guessed' ? 2000 : 1000);
    }
  }, [status]);

  if (!movie) return null;

  const maxXP = XP_TABLE[hintsRevealed] ?? 0;
  const isDone = status === 'guessed' || status === 'given_up';

  function revealHint() {
    if (hintsRevealed >= 7 || isDone) return;
    play('reveal');
    dispatch({ type: 'REVEAL_HINT' });
  }

  function handleGuess(guess) {
    play('buttonClick');
    dispatch({ type: 'SUBMIT_GUESS', guess });
    if (state.guesses.find(g => g.correct)) return;
    // Check result after dispatch
    const normalized = (s) => s.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
    if (normalized(guess) !== normalized(movie.title)) {
      play('wrong');
    }
  }

  function handleGiveUp() {
    setShowGiveUpModal(false);
    dispatch({ type: 'GIVE_UP' });
  }

  const wrongGuesses = guesses.filter(g => !g.correct);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 relative z-10">
      <Confetti active={showConfetti} />

      {/* Header */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          ✕ Quit
        </button>
        <div className="flex items-center gap-2">
          {mode === 'daily' && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30">
              Daily
            </span>
          )}
          <span className="text-sm text-white/40">
            {hintsRevealed}/7 hints used
          </span>
        </div>
      </div>

      <div className="w-full max-w-md">
        {/* XP Preview */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs text-white/40">
            {hintsRevealed === 0 ? 'Reveal a hint to start' : `Guess now for:`}
          </p>
          <AnimatePresence mode="wait">
            {xpFlash ? (
              <motion.span
                key="flash"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-lg font-bold text-primary-400"
              >
                {xpFlash}
              </motion.span>
            ) : (
              <motion.span
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-lg font-bold ${hintsRevealed === 0 ? 'text-white/20' : 'text-primary-400'}`}
              >
                {hintsRevealed === 0 ? '—' : `${maxXP} XP`}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Hints */}
        <div className="space-y-2 mb-5">
          {Array.from({ length: 7 }, (_, i) => (
            <HintCard
              key={i}
              index={i}
              value={i < hintsRevealed ? getHintValue(movie, i) : ''}
              locked={i >= hintsRevealed}
            />
          ))}
        </div>

        {/* Reveal Button */}
        {!isDone && hintsRevealed < 7 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={revealHint}
            className="w-full py-3 mb-4 rounded-xl border border-accent/40 bg-accent/8 text-accent font-semibold text-sm hover:bg-accent/15 transition-all"
          >
            👁 Reveal Hint {hintsRevealed + 1} of 7
          </motion.button>
        )}

        {hintsRevealed >= 7 && !isDone && (
          <p className="text-center text-xs text-white/30 mb-4">All hints revealed</p>
        )}

        {/* Wrong guesses */}
        {wrongGuesses.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {wrongGuesses.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-wrong/10 border border-wrong/20"
              >
                <span className="text-wrong text-sm">✕</span>
                <span className="text-sm text-white/60">{g.value}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Guess Input */}
        {!isDone && hintsRevealed > 0 && (
          <div className="mb-4">
            <GuessInput onGuess={handleGuess} disabled={isDone} wrongGuesses={wrongGuesses} />
          </div>
        )}

        {hintsRevealed === 0 && !isDone && (
          <p className="text-center text-sm text-white/30 mb-4">Reveal at least one hint before guessing</p>
        )}

        {/* Give Up */}
        {!isDone && (
          <button
            onClick={() => setShowGiveUpModal(true)}
            className="w-full py-2.5 text-sm text-white/25 hover:text-white/50 transition-colors"
          >
            Give Up
          </button>
        )}

        {/* Outcome Banner */}
        <AnimatePresence>
          {status === 'guessed' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 rounded-2xl bg-correct/10 border border-correct/30 text-center"
            >
              <p className="text-correct font-bold text-lg">🎉 Correct!</p>
              <p className="text-white/60 text-sm mt-1">+{xpEarned} XP earned</p>
            </motion.div>
          )}
          {status === 'given_up' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 rounded-2xl bg-white/[0.05] border border-white/10 text-center"
            >
              <p className="text-white/70 font-bold text-lg">The movie was:</p>
              <p className="text-primary-400 font-bold text-xl mt-1">{movie.title} ({movie.year})</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Give Up Modal */}
      <AnimatePresence>
        {showGiveUpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm p-6 rounded-2xl bg-[#1a1a2e] border border-white/10 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-2">Give up?</h3>
              <p className="text-sm text-white/50 mb-6">You'll see the answer but earn 0 XP.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGiveUpModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm hover:bg-white/[0.06] transition-all"
                >
                  Keep trying
                </button>
                <button
                  onClick={handleGiveUp}
                  className="flex-1 py-2.5 rounded-xl bg-wrong/20 border border-wrong/30 text-wrong text-sm font-semibold hover:bg-wrong/30 transition-all"
                >
                  Give up
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
