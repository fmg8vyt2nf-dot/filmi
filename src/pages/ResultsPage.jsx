import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useXP } from '../hooks/useXP';
import { useSound } from '../hooks/useSound';
import { useCollector } from '../hooks/useCollector';
import { HINT_LABELS, HINT_ICONS, XP_TABLE, BLIND_XP } from '../utils/constants';
import XPBar from '../components/ui/XPBar';
import Confetti from '../components/effects/Confetti';

function getHintValue(movie, hintIndex) {
  return [
    movie.director,
    movie.supportingActor,
    movie.leadActor,
    `"${movie.song}"`,
    movie.plot,
    movie.composer,
    `"${movie.dialogue}"`,
  ][hintIndex];
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function ResultsPage() {
  const navigate  = useNavigate();
  const { state, dispatch } = useGame();
  const { totalXP, level, progress } = useXP();
  const { play } = useSound();
  const { data: collectorData } = useCollector();
  const { movie, status, hintsRevealed, xpEarned, mode, hintOrder, guesses } = state;

  if (!movie) { navigate('/'); return null; }

  const correct     = status === 'guessed';
  const wasBlind    = correct && guesses.some(g => g.blind && g.correct);

  // New discoveries: people with count === 1 in collector (just added by GamePage)
  const newDiscoveries = correct ? (() => {
    const out = [];
    if (collectorData.directors[movie.director]?.count === 1)
      out.push({ type: 'Director', name: movie.director });
    if (collectorData.actors[movie.leadActor]?.count === 1)
      out.push({ type: 'Actor', name: movie.leadActor });
    return out;
  })() : [];

  function playAgain() {
    play('buttonClick');
    dispatch({ type: 'START_GAME' });
    navigate('/play');
  }

  function goSetup() {
    play('buttonClick');
    navigate('/setup');
  }

  function goHome() {
    play('buttonClick');
    dispatch({ type: 'RESET' });
    navigate('/');
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-5 py-10 relative z-10">
      <Confetti active={correct} />

      <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-sm">

        {/* Result banner */}
        <motion.div variants={item} className="text-center mb-7">
          <div className="text-5xl mb-3">
            {wasBlind ? '⚡' : correct ? '🎉' : '🎬'}
          </div>

          {correct ? (
            <>
              <p className="text-xs font-black tracking-[0.3em] uppercase mb-1" style={{ color: '#FF2D6B' }}>
                {wasBlind ? 'Blind Guess!' : 'You Got It!'}
              </p>
              <h2 className="text-3xl font-black text-white tracking-tight">
                {wasBlind ? 'No Clues Needed' : `${hintsRevealed} Clue${hintsRevealed !== 1 ? 's' : ''} Used`}
              </h2>
            </>
          ) : (
            <>
              <p className="text-xs font-black tracking-[0.3em] uppercase mb-1 text-white/30">
                Better Luck Next Time
              </p>
              <h2 className="text-3xl font-black text-white tracking-tight">Nice Try!</h2>
            </>
          )}
        </motion.div>

        {/* Movie card */}
        <motion.div variants={item} className="mb-5 p-5 rounded-2xl overflow-hidden relative"
          style={{ background: 'rgba(255,184,0,0.04)', border: '1px solid rgba(255,184,0,0.15)' }}>
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,184,0,0.15), transparent 70%)' }} />

          <div className="relative w-full h-24 rounded-xl mb-4 flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(255,184,0,0.15) 0%, rgba(255,45,107,0.12) 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-4xl">🎬</span>
          </div>

          <h3 className="text-xl font-black text-white leading-tight">{movie.title}</h3>
          <p className="text-sm text-white/35 mt-0.5 mb-4">{movie.year}</p>

          {correct && (
            <div className="flex items-center gap-4 p-3.5 rounded-xl"
              style={{ background: wasBlind ? 'rgba(250,204,21,0.08)' : 'rgba(255,184,0,0.08)', border: `1px solid ${wasBlind ? 'rgba(250,204,21,0.25)' : 'rgba(255,184,0,0.2)'}` }}>
              <div>
                <p className="text-xs text-white/35 uppercase tracking-wider font-bold mb-0.5">XP Earned</p>
                <p className="text-2xl font-black" style={{ color: wasBlind ? '#fbbf24' : '#FFB800' }}>+{xpEarned}</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-xs text-white/35 uppercase tracking-wider font-bold mb-0.5">
                  {wasBlind ? 'Method' : 'Clues Used'}
                </p>
                {wasBlind
                  ? <p className="text-lg font-black" style={{ color: '#fbbf24' }}>⚡ Blind</p>
                  : <p className="text-2xl font-black text-white">{hintsRevealed}<span className="text-white/30 text-base font-medium">/7</span></p>
                }
              </div>
            </div>
          )}
        </motion.div>

        {/* New Discoveries */}
        {newDiscoveries.length > 0 && (
          <motion.div variants={item} className="mb-5 p-4 rounded-2xl"
            style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(34,197,94,0.7)' }}>
              🆕 New to your Encyclopedia
            </p>
            <div className="space-y-1">
              {newDiscoveries.map(({ type, name }) => (
                <p key={name} className="text-sm text-white/70">
                  <span className="text-white/35 text-xs">{type} · </span>{name}
                </p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Clues used */}
        {(correct ? hintsRevealed > 0 : true) && (
          <motion.div variants={item} className="mb-5">
            <p className="text-xs font-bold text-white/25 uppercase tracking-widest mb-3">
              {correct ? (wasBlind ? 'The Film' : 'Clues You Used') : 'All Clues'}
            </p>
            {!wasBlind && (
              <div className="space-y-1.5">
                {Array.from({ length: correct ? hintsRevealed : 7 }, (_, i) => {
                  const hintIdx = hintOrder[i];
                  const revealed = i < hintsRevealed;
                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 px-3.5 py-2.5 rounded-xl"
                      style={revealed
                        ? { background: 'rgba(255,184,0,0.05)', border: '1px solid rgba(255,184,0,0.12)', borderLeft: '3px solid rgba(255,184,0,0.5)' }
                        : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', opacity: 0.45 }
                      }>
                      <span className="text-base mt-0.5">{HINT_ICONS[hintIdx]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide mb-0.5"
                          style={{ color: revealed ? 'rgba(255,184,0,0.7)' : 'rgba(255,255,255,0.2)' }}>
                          {HINT_LABELS[hintIdx]}
                        </p>
                        <p className="text-sm text-white/80 leading-snug">{getHintValue(movie, hintIdx)}</p>
                      </div>
                      {!revealed && <span className="text-xs text-white/15 shrink-0 mt-0.5">not revealed</span>}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* XP bar */}
        <motion.div variants={item} className="mb-5 p-4 rounded-2xl"
          style={{ background: 'rgba(255,184,0,0.03)', border: '1px solid rgba(255,184,0,0.1)' }}>
          <p className="text-xs font-bold text-white/25 uppercase tracking-widest mb-3">Your Progress</p>
          <XPBar totalXP={totalXP} level={level} progress={progress} />
        </motion.div>

        {/* XP scale */}
        <motion.div variants={item} className="mb-8 p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs font-bold text-white/25 uppercase tracking-widest mb-3">XP Scale</p>
          <div className="grid grid-cols-7 gap-1">
            {XP_TABLE.slice(1).map((xp, i) => {
              const active = hintsRevealed === i + 1 && correct && !wasBlind;
              return (
                <div key={i} className="text-center p-1.5 rounded-lg"
                  style={active
                    ? { background: 'rgba(255,184,0,0.15)', border: '1px solid rgba(255,184,0,0.4)' }
                    : { background: 'rgba(255,255,255,0.02)' }
                  }>
                  <p className="text-[10px] font-bold mb-0.5" style={{ color: active ? '#FFB800' : 'rgba(255,255,255,0.2)' }}>
                    {i + 1}
                  </p>
                  <p className="text-[10px] font-black leading-none" style={{ color: active ? '#FFD000' : 'rgba(255,255,255,0.2)' }}>
                    {xp >= 1000 ? `${xp / 1000}k` : xp}
                  </p>
                </div>
              );
            })}
          </div>
          {wasBlind && (
            <div className="mt-2 text-center py-1.5 rounded-lg"
              style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.25)' }}>
              <p className="text-xs font-black" style={{ color: '#fbbf24' }}>⚡ Blind Bonus: +{BLIND_XP.toLocaleString()} XP</p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div variants={item} className="space-y-3">
          {mode === 'practice' && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={playAgain}
              className="w-full py-4 rounded-2xl font-black text-base tracking-wide text-black"
              style={{ background: 'linear-gradient(135deg, #FFD000, #FFB800, #FF8C00)', boxShadow: '0 8px 32px rgba(255,184,0,0.3)' }}>
              🎬 PLAY AGAIN
            </motion.button>
          )}
          {mode === 'practice' && (
            <button onClick={goSetup}
              className="w-full py-3 rounded-xl text-sm font-bold text-white/40 hover:text-white/60 border border-white/8 hover:bg-white/[0.04] transition-all">
              🎞️ Change Difficulty or Era
            </button>
          )}
          <button onClick={goHome}
            className="w-full py-3 rounded-xl text-sm font-bold text-white/30 hover:text-white/50 transition-all">
            ← Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
