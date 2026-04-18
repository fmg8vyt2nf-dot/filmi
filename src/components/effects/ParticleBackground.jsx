import { useEffect, useRef } from 'react';

const COLORS = [
  { r: 255, g: 184, b: 0,   a: 0.35 }, // gold
  { r: 255, g: 45,  b: 107, a: 0.28 }, // hot pink
  { r: 180, g: 100, b: 255, a: 0.20 }, // purple
];

function createParticle(w, h) {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const isBokeh = Math.random() < 0.2;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    radius: isBokeh ? Math.random() * 8 + 6 : Math.random() * 2 + 1,
    opacity: isBokeh ? Math.random() * 0.06 + 0.02 : color.a,
    speedY: isBokeh ? -(Math.random() * 0.15 + 0.05) : -(Math.random() * 0.25 + 0.08),
    speedX: (Math.random() - 0.5) * 0.15,
    wobble: Math.random() * 0.015 + 0.005,
    phase: Math.random() * Math.PI * 2,
    color,
    isBokeh,
  };
}

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const animRef  = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width  = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 40 }, () => createParticle(w, h));
    let time = 0;

    function animate() {
      time++;
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time * p.wobble + p.phase) * 0.25;
        if (p.y < -20)    { p.y = h + 20; p.x = Math.random() * w; }
        if (p.x < -20)      p.x = w + 20;
        if (p.x > w + 20)   p.x = -20;

        if (p.isBokeh) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          g.addColorStop(0,   `rgba(${p.color.r},${p.color.g},${p.color.b},${p.opacity})`);
          g.addColorStop(1,   `rgba(${p.color.r},${p.color.g},${p.color.b},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.color.a})`;
          ctx.fill();
        }
      });

      animRef.current = requestAnimationFrame(animate);
    }
    animate();

    function onResize() {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}
