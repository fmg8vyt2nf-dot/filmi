import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useXP } from '../hooks/useXP';
import { useGameHistory } from '../hooks/useGameHistory';
import { useSound } from '../hooks/useSound';
import { XP_TABLE } from '../utils/constants';
import HintCard from '../components/game/HintCard';
import GuessInput from '../components/game/GuessInput';
import Confetti from '../components/effects/Confetti';

function getHintValue(movie, index) {
  return [
    movie.decade,
    movie.genre,
    movie.director,
    movie.supportingActor,
    movie.leadActor,
    `"${movie.song}"`,
    movie.plot,
  ][index];
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

  useEffect(() => { if (!movie) navigate('/'); }, [movie, navigate]);

  useEffect(() => {
    if ((status === 'guessed' || status === 'given_up') && !savedRef.current) {
      savedRef.current = true;
      if (status === 'guessed') {
        setShowConfetti(true);
        play('correct');
        setXpFlash(`+${xpEarned} XP`);
        addXP(xpEarned);
        setTimeout(() => setXpFlash(null), 1600);
      } else {
        play('giveUp');
      }
      saveGame({ movie, xpEarned, hintsUsed: hintsRevealed, mode });
      setTimeout(() => navigate('/results'), status === 'guessed' ? 2200 : 900);
    }
  }, [status]);

  if (!movie) return null;

  const maxXP  = XP_TABLE[hintsRevealed] ?? 0;
  const isDone = status === 'guessed' || status === 'given_up';
  const wrongGuesses = guesses.filter(g => !g.correct);

  function revealHint() {
    if (hintsRevealed >= 7 || isDone) return;
    play('reveal');
    dispatch({ type: 'REVEAL_HINT' });
  }

  function handleGuess(guess) {
    play('buttonClick');
    const norm = s => s.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
    if (norm(guess) !== norm(movie.title)) play('wrong');
    dispatch({ type: 'SUBMIT_GUESS', guess });
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 relative z-10">
      <Confetti active={showConfetti} />

      {/* Top bar */}
      <div className="w-full max-w-sm mb-5 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-white/30 hover:text-white/60 transition-colors font-medium"
        >
          ✕ Quit
        </button>
        <div className="flex items-center gap-2">
          {mode === 'daily' && (
            <span className="px-2 py-0.5 rounded-full text-xs font-black tracking-wide"
              style={{ background: 'rgba(255,45,107,0.15)', color: '#FF2D6B', border: '1px solid rgba(255,45,107,0.3)' }}>
              DAILY
            </span>
          )}
          <span className="text-xs text-white/30 font-medium">
            {hintsRevealed}/7 clues
          </span>
        </div>
      </div>

      <div className="w-full max-w-sm">
        {/* XP potential */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-xs text-white/30 font-medium">
            {hintsRevealed === 0 ? 'Reveal a clue to begin' : 'Guess now for:'}
          </p>
          <AnimatePresence mode="wait">
            {xpFlash ? (
              <motion.span key="flash"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -10 }}
                className="font-black text-xl animate-marquee" style={{ color: '#FFB800' }}>
                {xpFlash}
              </motion.span>
            ) : (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-baseline gap-1">
                <span className="font-black text-xl" style={{ color: hintsRevealed === 0 ? 'rgba(255,255,255,0.12)' : '#FFB800' }}>
                  {hintsRevealed === 0 ? '—' : maxXP.toLocaleString()}
                </span>
                {hintsRevealed > 0 && <span className="text-xs text-white/30 font-medium">XP</span>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clue board */}
        <div className="space-y-2 mb-4">
          {Array.from({ length: 7 }, (_, i) => (
            <HintCard
              key={i}
              index={i}
              value={i < hintsRevealed ? getHintValue(movie, i) : ''}
              locked={i >= hintsRevealed}
            />
          ))}
        </div>

        {/* Reveal button */}
        {!isDone && hintsRevealed < 7 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={revealHint}
            className="w-full py-3.5 mb-4 rounded-2xl font-black text-sm tracking-wide border transition-all"
            style={{
              borderColor: 'rgba(255,184,0,0.35)',
              color: '#FFB800',
              background: 'rgba(255,184,0,0.07)',
              boxShadow: '0 0 20px rgba(255,184,0,0.08)',
            }}
          >
            👁 REVEAL CLUE {hintsRevealed + 1} OF 7
          </motion.button>
        )}

        {hintsRevealed >= 7 && !isDone && (
          <p className="text-center text-xs text-white/20 mb-4 font-medium">All clues revealed</p>
        )}

        {/* Wrong guesses */}
        {wrongGuesses.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {wrongGuesses.map((g, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                <span style={{ color: '#ef4444' }} className="text-xs font-bold">✕</span>
                <span className="text-sm text-white/45 line-through">{g.value}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Guess input */}
        {!isDone && hintsRevealed > 0 && (
          <div className="mb-4">
            <GuessInput onGuess={handleGuess} disabled={isDone} wrongGuesses={wrongGuesses} />
          </div>
        )}

        {hintsRevealed === 0 && !isDone && (
          <p className="text-center text-xs text-white/20 mb-4 font-medium">
            Reveal at least one clue before guessing
          </p>
        )}

        {/* Give up */}
        {!isDone && (
          <button onClick={() => setShowGiveUpModal(true)}
            className="w-full py-2 text-xs text-white/20 hover:text-white/40 transition-colors font-medium tracking-wide">
            Give Up
          </button>
        )}

        {/* Outcome */}
        <AnimatePresence>
          {status === 'guessed' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="mt-5 p-5 rounded-2xl text-center"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
              <p className="text-correct font-black text-xl">🎉 Correct!</p>
              <p className="text-white/50 text-sm mt-1 font-medium">
                +{xpEarned} XP · {hintsRevealed} clue{hintsRevealed !== 1 ? 's' : ''} used
              </p>
            </motion.div>
          )}
          {status === 'given_up' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="mt-5 p-5 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-white/50 text-sm font-medium">The movie was</p>
              <p className="font-black text-xl mt-1" style={{ color: '#FFB800' }}>
                {movie.title} <span className="text-white/40 font-normal text-base">({movie.year})</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Give up modal */}
      <AnimatePresence>
        {showGiveUpModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-5 backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.7)' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs p-6 rounded-2xl"
              style={{ background: '#161020', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="text-lg font-black text-white mb-1.5">Give up?</h3>
              <p className="text-sm text-white/40 mb-6">The answer will be revealed. You'll earn 0 XP.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowGiveUpModal(false)}
                  className="flex-1 py-2.5 rounded-xl border text-sm font-bold text-white/50 hover:bg-white/[0.04] transition-all"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  Keep trying
                </button>
                <button onClick={() => { setShowGiveUpModal(false); dispatch({ type: 'GIVE_UP' }); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all"
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
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
