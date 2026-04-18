import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutocomplete } from '../../hooks/useAutocomplete';
import { movies } from '../../data/movies';

export default function GuessInput({ onGuess, disabled, wrongGuesses }) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);
  const suggestions = useAutocomplete(value, movies);

  const wrongCount = wrongGuesses.length;
  const prevWrongRef = useRef(wrongCount);
  useEffect(() => {
    if (wrongCount > prevWrongRef.current) {
      setShake(true);
      setTimeout(() => setShake(false), 420);
    }
    prevWrongRef.current = wrongCount;
  }, [wrongCount]);

  function handleSelect(title) {
    setValue(title);
    setOpen(false);
    setSelectedIdx(-1);
  }

  function handleSubmit(e) {
    e?.preventDefault();
    const guess = value.trim();
    if (!guess || disabled) return;
    onGuess(guess);
    setValue('');
    setOpen(false);
  }

  function handleKeyDown(e) {
    if (!open || !suggestions.length) {
      if (e.key === 'Enter') handleSubmit();
      return;
    }
    if (e.key === 'ArrowDown')  { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter') { e.preventDefault(); selectedIdx >= 0 ? handleSelect(suggestions[selectedIdx].title) : handleSubmit(); }
    else if (e.key === 'Escape') setOpen(false);
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className={shake ? 'animate-shake' : ''}>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={value}
            onChange={e => { setValue(e.target.value); setOpen(true); setSelectedIdx(-1); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 160)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Type a movie name…"
            autoComplete="off"
            className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 font-medium focus:outline-none transition-all disabled:opacity-40"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onFocusCapture={e => { e.target.style.borderColor = 'rgba(255,184,0,0.5)'; e.target.style.background = 'rgba(255,184,0,0.05)'; }}
            onBlurCapture={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
          />
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="px-5 py-3 rounded-xl text-sm font-black tracking-wide text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ background: 'linear-gradient(135deg, #FFD000, #FFB800)', boxShadow: value.trim() ? '0 4px 16px rgba(255,184,0,0.3)' : 'none' }}
          >
            GUESS
          </button>
        </div>
      </form>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
            className="absolute z-50 w-full mt-1.5 rounded-xl overflow-hidden"
            style={{ background: '#1a1228', border: '1px solid rgba(255,184,0,0.15)', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}
          >
            {suggestions.map((m, i) => (
              <li key={m.id}
                onMouseDown={() => handleSelect(m.title)}
                className="px-4 py-2.5 text-sm cursor-pointer flex justify-between items-center transition-colors"
                style={i === selectedIdx
                  ? { background: 'rgba(255,184,0,0.12)', color: '#FAF0E6' }
                  : { color: 'rgba(255,255,255,0.65)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = i === selectedIdx ? 'rgba(255,184,0,0.12)' : 'transparent'; }}
              >
                <span className="font-medium">{m.title}</span>
                <span className="text-xs text-white/25 ml-2 shrink-0">{m.year}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
