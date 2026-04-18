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

  // shake on new wrong guess
  const wrongCount = wrongGuesses.length;
  const prevWrongRef = useRef(wrongCount);
  useEffect(() => {
    if (wrongCount > prevWrongRef.current) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
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
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx >= 0) handleSelect(suggestions[selectedIdx].title);
      else handleSubmit();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className={shake ? 'animate-shake' : ''}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={value}
              onChange={e => { setValue(e.target.value); setOpen(true); setSelectedIdx(-1); }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="Type a movie title…"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary-500/60 focus:bg-white/[0.10] transition-all disabled:opacity-40"
            />
          </div>
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold hover:from-primary-400 hover:to-primary-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
          >
            Guess
          </button>
        </div>
      </form>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden border border-white/10 bg-[#1a1a2e]/95 backdrop-blur-xl shadow-2xl"
          >
            {suggestions.map((m, i) => (
              <li
                key={m.id}
                onMouseDown={() => handleSelect(m.title)}
                className={`px-4 py-2.5 text-sm cursor-pointer flex justify-between items-center transition-colors ${
                  i === selectedIdx ? 'bg-primary-500/20 text-white' : 'text-white/80 hover:bg-white/[0.06]'
                }`}
              >
                <span>{m.title}</span>
                <span className="text-xs text-white/30">{m.year}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
