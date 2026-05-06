import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { useDecadeTour } from '../hooks/useDecadeTour';
import { DIFFICULTIES, DECADES, ERA_EMOJIS } from '../utils/constants';
import { movies } from '../data/movies';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const DIFF_COLORS = {
  easy:   { border: 'rgba(34,197,94,0.35)',  bg: 'rgba(34,197,94,0.07)',  text: '#4ade80' },
  medium: { border: 'rgba(255,184,0,0.35)',  bg: 'rgba(255,184,0,0.07)',  text: '#FFB800' },
  hard:   { border: 'rgba(255,45,107,0.35)', bg: 'rgba(255,45,107,0.07)', text: '#FF2D6B' },
};

export default function SetupPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { play } = useSound();
  const { getProgress } = useDecadeTour();
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
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12 relative z-10">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm"
      >
        {/* Back */}
        <motion.button
          variants={item}
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-1.5 text-sm text-white/35 hover:text-white/60 transition-colors"
        >
          ← Back
        </motion.button>

        {/* Title */}
        <motion.div variants={item} className="mb-8">
          <p className="text-xs font-black tracking-[0.3em] uppercase mb-1" style={{ color: '#FF2D6B' }}>
            Reel Time
          </p>
          <h2 className="text-3xl font-black text-white tracking-tight">Choose Your Game</h2>
        </motion.div>

        {/* Difficulty */}
        <motion.div variants={item} className="mb-7">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Difficulty</p>
          <div className="space-y-2">
            {DIFFICULTIES.map(d => {
              const col = DIFF_COLORS[d.id];
              const active = difficulty === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => { play('buttonClick'); setDifficulty(d.id); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all"
                  style={{
                    borderColor: active ? col.border : 'rgba(255,255,255,0.07)',
                    background: active ? col.bg : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <span className="text-2xl">{d.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: active ? col.text : 'rgba(255,255,255,0.7)' }}>
                      {d.label}
                    </p>
                    <p className="text-xs text-white/35 mt-0.5">{d.desc}</p>
                  </div>
                  {active && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: col.bg, border: `1px solid ${col.border}` }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: col.text }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Decade Tour */}
        <motion.div variants={item} className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest">
              Era Tour <span className="text-white/15 normal-case font-normal">— optional</span>
            </p>
          </div>

          <div className="space-y-2">
            {/* All Eras pill */}
            <button
              onClick={() => { play('buttonClick'); setDecade(null); }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all"
              style={!decade
                ? { borderColor: 'rgba(255,184,0,0.4)', background: 'rgba(255,184,0,0.08)', color: '#FFB800' }
                : { borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.4)' }
              }
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🎞️</span>
                <span className="text-sm font-bold">All Eras</span>
              </div>
              <span className="text-xs" style={{ color: !decade ? 'rgba(255,184,0,0.6)' : 'rgba(255,255,255,0.2)' }}>
                {movies.length} films
              </span>
            </button>

            {/* Decade cards with progress */}
            {DECADES.map(d => {
              const active = decade === d;
              const { guessed, total, pct, complete } = getProgress(d);
              return (
                <button
                  key={d}
                  onClick={() => { play('buttonClick'); setDecade(d); }}
                  className="w-full px-4 py-3 rounded-xl border text-left transition-all"
                  style={active
                    ? { borderColor: 'rgba(255,184,0,0.4)', background: 'rgba(255,184,0,0.07)' }
                    : { borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{ERA_EMOJIS[d]}</span>
                      <span className="text-sm font-bold" style={{ color: active ? '#FFB800' : 'rgba(255,255,255,0.7)' }}>
                        {d}
                      </span>
                      {complete && <span className="text-xs">✅</span>}
                    </div>
                    <span className="text-xs font-bold" style={{ color: active ? 'rgba(255,184,0,0.7)' : 'rgba(255,255,255,0.2)' }}>
                      {guessed}/{total}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{ background: active ? '#FFB800' : (guessed > 0 ? 'rgba(255,184,0,0.4)' : 'transparent') }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Pool size */}
        <motion.p variants={item} className="text-xs text-white/20 text-center mb-6">
          {poolSize} {poolSize === 1 ? 'movie' : 'movies'} in this selection
        </motion.p>

        {/* CTA */}
        <motion.div variants={item}>
          <motion.button
            whileHover={{ scale: poolSize > 0 ? 1.02 : 1 }}
            whileTap={{ scale: poolSize > 0 ? 0.97 : 1 }}
            onClick={start}
            disabled={poolSize === 0}
            className="w-full py-4 rounded-2xl font-black text-base tracking-wide text-black disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #FFD000, #FFB800, #FF8C00)',
              boxShadow: poolSize > 0 ? '0 8px 32px rgba(255,184,0,0.35)' : 'none',
            }}
          >
            🎬 START GUESSING
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
