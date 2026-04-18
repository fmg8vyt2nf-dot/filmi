import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { DIFFICULTIES, DECADES } from '../utils/constants';
import { movies } from '../data/movies';

export default function SetupPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { play } = useSound();
  const [difficulty, setDifficulty] = useState(state.difficulty ?? 'medium');
  const [decade, setDecade] = useState(state.decadeFilter ?? null);

  const poolSize = movies.filter(m =>
    (!difficulty || m.difficulty === difficulty) && (!decade || m.decade === decade)
  ).length;

  function start() {
    play('gameStart');
    dispatch({ type: 'SET_CONFIG', mode: 'practice', difficulty, decadeFilter: decade });
    dispatch({ type: 'START_GAME' });
    navigate('/play');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-white mb-8">Set Up Your Game</h2>

        {/* Difficulty */}
        <div className="mb-8">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Difficulty</p>
          <div className="space-y-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                onClick={() => { play('buttonClick'); setDifficulty(d.id); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left ${
                  difficulty === d.id
                    ? 'border-primary-500/60 bg-primary-500/10 shadow-lg shadow-primary-500/10'
                    : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
                }`}
              >
                <span className="text-2xl">{d.emoji}</span>
                <div>
                  <p className={`font-semibold text-sm ${difficulty === d.id ? 'text-primary-400' : 'text-white/80'}`}>
                    {d.label}
                  </p>
                  <p className="text-xs text-white/40">{d.desc}</p>
                </div>
                {difficulty === d.id && (
                  <span className="ml-auto text-primary-500 text-lg">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Decade Filter */}
        <div className="mb-8">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
            Decade <span className="text-white/20 normal-case">(optional)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { play('buttonClick'); setDecade(null); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                !decade ? 'border-primary-500/60 bg-primary-500/10 text-primary-400' : 'border-white/10 bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
              }`}
            >
              All Eras
            </button>
            {DECADES.map(d => (
              <button
                key={d}
                onClick={() => { play('buttonClick'); setDecade(d); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  decade === d ? 'border-primary-500/60 bg-primary-500/10 text-primary-400' : 'border-white/10 bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Pool info */}
        <p className="text-xs text-white/30 mb-6 text-center">
          {poolSize} {poolSize === 1 ? 'movie' : 'movies'} in this selection
        </p>

        <motion.button
          whileHover={{ scale: poolSize > 0 ? 1.02 : 1 }}
          whileTap={{ scale: poolSize > 0 ? 0.98 : 1 }}
          onClick={start}
          disabled={poolSize === 0}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg shadow-xl shadow-primary-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          🎬 Start Guessing
        </motion.button>
      </motion.div>
    </div>
  );
}
