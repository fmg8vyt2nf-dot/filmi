import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 50;
const COLORS = [
  { r: 255, g: 107, b: 53, a: 0.3 },
  { r: 14, g: 165, b: 233, a: 0.25 },
];

function createParticle(w, h) {
  const color = COLORS[Math.random() > 0.5 ? 0 : 1];
  return {
    x: Math.random() * w, y: Math.random() * h,
    radius: Math.random() * 2 + 1,
    speedY: -(Math.random() * 0.3 + 0.1),
    speedX: (Math.random() - 0.5) * 0.2,
    wobbleSpeed: Math.random() * 0.02 + 0.01,
    wobbleAmp: Math.random() * 15 + 5,
    phase: Math.random() * Math.PI * 2,
    color,
  };
}

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(w, h));
    let time = 0;

    function animate() {
      time++;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time * p.wobbleSpeed + p.phase) * 0.3;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.color.a})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(animate);
    }
    animate();

    function onResize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}
