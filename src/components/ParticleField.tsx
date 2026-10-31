import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  swayAngle: number;
  swaySpeed: number;
  baseAlpha: number;
  alpha: number;
  alphaSpeed: number;
  color: string;
  hasGlow: boolean;
}

export const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Subtle dark emerald, bright mint, cyan/teal and crisp ambient motes
    const colors = [
      'rgba(5, 211, 138, ',   // Emerald
      'rgba(0, 240, 160, ',   // Mint
      'rgba(0, 229, 255, ',   // Cyan / Teal
      'rgba(45, 212, 191, ',  // Teal
      'rgba(249, 250, 251, ', // Ivory
    ];

    // Minimal particle count for controlled luxury atmosphere
    const count = window.innerWidth < 768 ? 16 : 28;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const isTealOrMint = Math.random() > 0.4;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.4 + 0.6,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12 - 0.04,
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.012 + 0.004,
        baseAlpha: Math.random() * 0.3 + 0.08,
        alpha: Math.random() * 0.3 + 0.08,
        alphaSpeed: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[Math.floor(Math.random() * colors.length)],
        hasGlow: isTealOrMint && Math.random() > 0.6,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.swayAngle += p.swaySpeed;
        p.x += p.speedX + Math.sin(p.swayAngle) * 0.18;
        p.y += p.speedY;
        p.alpha += p.alphaSpeed;

        if (p.alpha > p.baseAlpha + 0.22 || p.alpha < p.baseAlpha - 0.1) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const currentAlpha = Math.max(0.04, Math.min(0.65, p.alpha));
        ctx.fillStyle = p.color + currentAlpha + ')';

        if (p.hasGlow) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(0, 240, 160, 0.4)';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] opacity-75"
      aria-hidden="true"
    />
  );
};
