import { useEffect, useState } from 'react';

const COLORS = ['#ff6b35', '#0ea5e9', '#22c55e', '#f59e0b', '#a78bfa', '#f472b6'];

export default function Confetti({ active }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) return;
    const newPieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: `${Math.random() * 0.5}s`,
      size: Math.random() * 8 + 6,
      duration: `${Math.random() * 0.5 + 0.8}s`,
    }));
    setPieces(newPieces);
    const t = setTimeout(() => setPieces([]), 1500);
    return () => clearTimeout(t);
  }, [active]);

  if (!pieces.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${p.duration} ${p.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}
