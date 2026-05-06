import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCollector } from '../hooks/useCollector';
import { useDecadeTour } from '../hooks/useDecadeTour';
import { DECADES, ERA_EMOJIS } from '../utils/constants';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

function PersonCard({ name, count, films }) {
  const label = count === 1 ? 'film' : 'films';
  const bar = Math.min(100, Math.round((count / 10) * 100)); // max bar at 10 films
  return (
    <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-sm font-bold text-white/80">{name}</p>
        <p className="text-xs font-black" style={{ color: '#FFB800' }}>{count} {label}</p>
      </div>
      <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div className="h-full rounded-full" style={{ width: `${bar}%`, background: 'rgba(255,184,0,0.5)' }} />
      </div>
    </div>
  );
}

export default function CollectorPage() {
  const navigate = useNavigate();
  const { sortedDirectors, sortedActors, totalDirectors, totalActors, totalFilms } = useCollector();
  const { getProgress, overallGuessed, overallTotal } = useDecadeTour();
  const [tab, setTab] = useState('directors');

  const isEmpty = totalFilms === 0;

  return (
    <div className="min-h-screen flex flex-col items-center px-5 py-10 relative z-10">
      <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-sm">

        {/* Header */}
        <motion.button variants={item} onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-1.5 text-sm text-white/35 hover:text-white/60 transition-colors">
          ← Back
        </motion.button>

        <motion.div variants={item} className="mb-6">
          <p className="text-xs font-black tracking-[0.3em] uppercase mb-1" style={{ color: '#FF2D6B' }}>Your</p>
          <h1 className="text-3xl font-black text-white tracking-tight">Film Encyclopedia</h1>
          <p className="text-sm text-white/35 mt-1">Everyone you've encountered across your guesses</p>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={item}
          className="grid grid-cols-3 gap-2 mb-6">
          {[
            { label: 'Films Guessed', value: totalFilms },
            { label: 'Directors', value: totalDirectors },
            { label: 'Actors', value: totalActors },
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-3 rounded-xl"
              style={{ background: 'rgba(255,184,0,0.04)', border: '1px solid rgba(255,184,0,0.12)' }}>
              <p className="text-2xl font-black" style={{ color: '#FFB800' }}>{value}</p>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-wide mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Decade Tour progress */}
        <motion.div variants={item} className="mb-6 p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Era Tour</p>
            <p className="text-xs font-black" style={{ color: '#FFB800' }}>{overallGuessed}/{overallTotal}</p>
          </div>
          <div className="space-y-2">
            {DECADES.map(d => {
              const { guessed, total, pct, complete } = getProgress(d);
              return (
                <div key={d} className="flex items-center gap-3">
                  <span className="text-sm w-4">{ERA_EMOJIS[d]}</span>
                  <span className="text-xs text-white/40 w-10 shrink-0">{d}</span>
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <motion.div className="h-full rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      style={{ background: complete ? '#4ade80' : 'rgba(255,184,0,0.5)' }} />
                  </div>
                  <span className="text-[10px] text-white/25 w-8 text-right shrink-0">{guessed}/{total}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Empty state */}
        {isEmpty ? (
          <motion.div variants={item} className="text-center py-12">
            <p className="text-4xl mb-4">🎬</p>
            <p className="text-white/40 text-sm font-medium">Guess some films to start building your encyclopedia</p>
          </motion.div>
        ) : (
          <>
            {/* Tabs */}
            <motion.div variants={item} className="flex gap-2 mb-4">
              {[
                { id: 'directors', label: `Directors (${totalDirectors})` },
                { id: 'actors',    label: `Actors (${totalActors})` },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                  style={tab === t.id
                    ? { background: 'rgba(255,184,0,0.12)', color: '#FFB800', border: '1px solid rgba(255,184,0,0.3)' }
                    : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.06)' }
                  }>
                  {t.label}
                </button>
              ))}
            </motion.div>

            {/* List */}
            <motion.div variants={item} className="space-y-2">
              {(tab === 'directors' ? sortedDirectors : sortedActors).map(({ name, count, films }) => (
                <PersonCard key={name} name={name} count={count} films={films} />
              ))}
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
