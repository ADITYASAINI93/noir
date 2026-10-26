import React, { useEffect, useRef } from 'react';

interface CrescentMoonProps {
  size?: number; // base size in px
  scale?: number; // dynamic scale multiplier
  rotation?: number; // rotation in degrees
  glowIntensity?: number; // 0 to 1
  className?: string;
  enableCraters?: boolean;
}

export const CrescentMoon: React.FC<CrescentMoonProps> = ({
  size = 460,
  scale = 1,
  rotation = -12,
  glowIntensity = 0.85,
  className = '',
  enableCraters = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI canvas support
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderSize = size * 1.5; // padding for halo
    canvas.width = renderSize * dpr;
    canvas.height = renderSize * dpr;
    ctx.scale(dpr, dpr);

    const centerX = renderSize / 2;
    const centerY = renderSize / 2;
    const radius = size * 0.38;

    // Clear
    ctx.clearRect(0, 0, renderSize, renderSize);

    // Save for rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // 1. Volumetric Champagne Gold Corona / Outer Atmospheric Halo
    const haloRadius = radius * 1.6;
    const haloGrad = ctx.createRadialGradient(-radius * 0.25, 0, radius * 0.7, -radius * 0.1, 0, haloRadius);
    haloGrad.addColorStop(0, `rgba(201, 166, 107, ${0.45 * glowIntensity})`);
    haloGrad.addColorStop(0.3, `rgba(201, 166, 107, ${0.2 * glowIntensity})`);
    haloGrad.addColorStop(0.65, `rgba(168, 135, 79, ${0.06 * glowIntensity})`);
    haloGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');

    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, 0, haloRadius, 0, Math.PI * 2);
    ctx.fill();

    // 2. Secondary soft diffuse flare along the bright crescent rim
    const rimGlowGrad = ctx.createRadialGradient(-radius * 0.7, 0, 10, -radius * 0.7, 0, radius * 0.9);
    rimGlowGrad.addColorStop(0, `rgba(244, 239, 229, ${0.5 * glowIntensity})`);
    rimGlowGrad.addColorStop(0.4, `rgba(201, 166, 107, ${0.25 * glowIntensity})`);
    rimGlowGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');

    ctx.fillStyle = rimGlowGrad;
    ctx.beginPath();
    ctx.arc(-radius * 0.5, 0, radius * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // 3. The Lunar Body: Path clipping for the exquisite crescent
    // Outer arc radius `radius`, inner shadow disc offset to create crescent
    ctx.save();
    ctx.beginPath();
    // Outer circle
    ctx.arc(0, 0, radius, -Math.PI / 2, Math.PI / 2, true);
    // Inner cutout curve forming the crescent
    ctx.bezierCurveTo(radius * 0.38, radius * 0.75, radius * 0.38, -radius * 0.75, 0, -Math.PI / 2);
    ctx.closePath();
    ctx.clip();

    // 4. Crescent Base Luxury Gold Gradient
    const moonGrad = ctx.createLinearGradient(-radius, -radius * 0.5, radius * 0.5, radius);
    moonGrad.addColorStop(0, '#FFFFFF'); // Specular highlight peak
    moonGrad.addColorStop(0.12, '#F4EFE5'); // Warm ivory
    moonGrad.addColorStop(0.38, '#DFBE86'); // Light champagne gold
    moonGrad.addColorStop(0.68, '#C9A66B'); // Signature champagne gold
    moonGrad.addColorStop(0.92, '#A8874F'); // Antique gold
    moonGrad.addColorStop(1, '#664E24'); // Deep shadowed metallic gold

    ctx.fillStyle = moonGrad;
    ctx.fill();

    // 5. Realistic Lunar Crater & Maria Surface Texture Synthesis
    if (enableCraters) {
      // Deterministic crater placement for luxury realism
      const craters = [
        { x: -radius * 0.65, y: -radius * 0.35, r: radius * 0.09, opacity: 0.18 },
        { x: -radius * 0.72, y: 0.05, r: radius * 0.12, opacity: 0.22 },
        { x: -radius * 0.58, y: radius * 0.42, r: radius * 0.08, opacity: 0.16 },
        { x: -radius * 0.45, y: -radius * 0.55, r: radius * 0.07, opacity: 0.2 },
        { x: -radius * 0.5, y: -radius * 0.12, r: radius * 0.14, opacity: 0.15 },
        { x: -radius * 0.38, y: radius * 0.2, r: radius * 0.11, opacity: 0.17 },
        { x: -radius * 0.28, y: -radius * 0.32, r: radius * 0.06, opacity: 0.19 },
        { x: -radius * 0.2, y: radius * 0.5, r: radius * 0.05, opacity: 0.15 },
        { x: -radius * 0.78, y: -radius * 0.18, r: radius * 0.05, opacity: 0.24 },
        { x: -radius * 0.62, y: radius * 0.22, r: radius * 0.07, opacity: 0.18 },
      ];

      craters.forEach(c => {
        // Crater depression (shadow)
        const craterGrad = ctx.createRadialGradient(
          c.x - c.r * 0.2,
          c.y - c.r * 0.2,
          c.r * 0.1,
          c.x,
          c.y,
          c.r
        );
        craterGrad.addColorStop(0, `rgba(90, 70, 35, ${c.opacity * 1.5})`);
        craterGrad.addColorStop(0.7, `rgba(140, 110, 60, ${c.opacity * 0.8})`);
        craterGrad.addColorStop(0.95, `rgba(244, 239, 229, ${c.opacity * 1.2})`); // crater rim specular
        craterGrad.addColorStop(1, 'rgba(201, 166, 107, 0)');

        ctx.fillStyle = craterGrad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Lunar Maria (dark subtle basaltic plains)
      const maria = [
        { x: -radius * 0.55, y: -radius * 0.2, rx: radius * 0.28, ry: radius * 0.18, rot: 0.3 },
        { x: -radius * 0.45, y: radius * 0.32, rx: radius * 0.22, ry: radius * 0.15, rot: -0.2 },
      ];

      maria.forEach(m => {
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.rot);
        const mariaGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, m.rx);
        mariaGrad.addColorStop(0, 'rgba(100, 78, 38, 0.22)');
        mariaGrad.addColorStop(0.8, 'rgba(120, 95, 50, 0.08)');
        mariaGrad.addColorStop(1, 'rgba(201, 166, 107, 0)');

        ctx.fillStyle = mariaGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, m.rx, m.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // 6. Delicate metallic rim sheen
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, radius - 0.6, -Math.PI / 2, Math.PI / 2, true);
    ctx.stroke();

    ctx.restore(); // end clip

    // 7. Micro-particles of stardust clinging to the lunar contour
    for (let i = 0; i < 18; i++) {
      const angle = -Math.PI / 2 + (Math.PI * i) / 18 + (Math.random() - 0.5) * 0.15;
      const dist = radius + (Math.random() - 0.3) * 15;
      const px = Math.cos(angle + (rotation * Math.PI) / 180) * dist;
      const py = Math.sin(angle + (rotation * Math.PI) / 180) * dist;
      const dotAlpha = (Math.random() * 0.4 + 0.2) * glowIntensity;

      ctx.beginPath();
      ctx.arc(px, py, Math.random() * 1.2 + 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 239, 229, ${dotAlpha})`;
      ctx.fill();
    }

    ctx.restore(); // restore transform
  }, [size, rotation, glowIntensity, enableCraters]);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none pointer-events-none transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: `scale(${scale})`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* SVG Layer: Instant ultra-crisp champagne gold crescent with drop glow */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full absolute inset-0 z-0 drop-shadow-[0_0_30px_rgba(201,166,107,0.45)]"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center',
        }}
      >
        <defs>
          <linearGradient id={`crescentGoldGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#F4EFE5" />
            <stop offset="45%" stopColor="#DFBE86" />
            <stop offset="75%" stopColor="#C9A66B" />
            <stop offset="100%" stopColor="#8A6B34" />
          </linearGradient>
          <radialGradient id={`coronaGlow-${size}`} cx="45%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(201,166,107,0.4)" />
            <stop offset="50%" stopColor="rgba(201,166,107,0.12)" />
            <stop offset="100%" stopColor="rgba(5,5,5,0)" />
          </radialGradient>
        </defs>
        {/* Soft Corona Halo */}
        <circle cx="50" cy="50" r="48" fill={`url(#coronaGlow-${size})`} />
        {/* Crescent Moon path */}
        <path
          d="M50 10 A40 40 0 1 0 88 68 A33 33 0 1 1 50 10 Z"
          fill={`url(#crescentGoldGrad-${size})`}
        />
        {/* Specular Edge Line */}
        <path
          d="M50 11 A39 39 0 1 0 87 67"
          stroke="#FFFFFF"
          strokeWidth="0.7"
          strokeOpacity="0.8"
          fill="none"
        />
      </svg>

      {/* Canvas Layer: Volumetric stardust and procedural crater textures */}
      <canvas
        ref={canvasRef}
        className="relative z-10"
        style={{
          width: `${size * 1.5}px`,
          height: `${size * 1.5}px`,
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};
