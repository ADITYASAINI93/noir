import React from 'react';

interface CrescentMoonProps {
  size?: number; // base size in px
  scale?: number; // dynamic scale multiplier
  rotation?: number; // rotation in degrees
  glowIntensity?: number; // 0 to 1
  className?: string;
}

export const CrescentMoon: React.FC<CrescentMoonProps> = ({
  size = 320,
  scale = 1,
  rotation = 0,
  glowIntensity = 0.95,
  className = '',
}) => {
  const id = React.useId().replace(/:/g, '');

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none pointer-events-none transition-transform duration-700 ease-out ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        style={{
          filter: `drop-shadow(0 0 ${24 * glowIntensity}px rgba(0, 123, 167, ${0.55 * glowIntensity})) drop-shadow(0 0 ${12 * glowIntensity}px rgba(255, 45, 149, ${0.35 * glowIntensity}))`,
        }}
      >
        <defs>
          {/* 1. Deep Atmospheric Outer Corona Glow */}
          <radialGradient id={`outerCorona-${id}`} cx="40%" cy="50%" r="58%">
            <stop offset="0%" stopColor="#00A3D7" stopOpacity={0.45 * glowIntensity} />
            <stop offset="35%" stopColor="#007BA7" stopOpacity={0.25 * glowIntensity} />
            <stop offset="65%" stopColor="#FF2D95" stopOpacity={0.12 * glowIntensity} />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity={0} />
          </radialGradient>

          {/* 2. Soft Rim Volumetric Flare */}
          <radialGradient id={`rimFlare-${id}`} cx="20%" cy="50%" r="35%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.65 * glowIntensity} />
            <stop offset="45%" stopColor="#00A3D7" stopOpacity={0.35 * glowIntensity} />
            <stop offset="100%" stopColor="#FF2D95" stopOpacity={0} />
          </radialGradient>

          {/* 3. Cyber-Luxury Multi-Stop Satin Gradient */}
          <linearGradient id={`liquidGold-${id}`} x1="12%" y1="18%" x2="72%" y2="82%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="18%" stopColor="#CEF0FA" />
            <stop offset="42%" stopColor="#00A3D7" />
            <stop offset="68%" stopColor="#007BA7" />
            <stop offset="85%" stopColor="#C90065" />
            <stop offset="100%" stopColor="#FF2D95" />
          </linearGradient>

          {/* 4. Specular Curved Surface Sheen */}
          <linearGradient id={`specularSheen-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#00A3D7" stopOpacity="0.35" />
            <stop offset="80%" stopColor="#FF2D95" stopOpacity="0" />
          </linearGradient>

          {/* 5. Razor-Sharp Outer Edge Highlight */}
          <linearGradient id={`edgeHighlight-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00A3D7" stopOpacity="0.3" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="75%" stopColor="#FF2D95" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#007BA7" stopOpacity="0.3" />
          </linearGradient>

          {/* 6. Soft Inner Terminator Shadow Contour */}
          <radialGradient id={`terminatorShadow-${id}`} cx="59%" cy="50%" r="42%">
            <stop offset="60%" stopColor="#0A0A0A" stopOpacity="0" />
            <stop offset="85%" stopColor="#0D1118" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.95" />
          </radialGradient>

          {/* 7. Subtle Celestial Dust Texture */}
          <radialGradient id={`stardustGlow-${id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#007BA7" stopOpacity="0" />
          </radialGradient>

          {/* 
            SLENDER HIGH-FASHION GEOMETRY:
            Outer Circle: Center (50, 50), Radius = 40
            Inner Subtraction Circle: Center (60, 50), Radius = 37.2
            Yields a slender, elegant 12.8% equator thickness with flawless needle-point tips.
          */}
          <mask id={`crescentMask-${id}`}>
            <rect width="100" height="100" fill="#000000" />
            {/* Outer boundary */}
            <circle cx="50" cy="50" r="40" fill="#ffffff" />
            {/* Inner cutout */}
            <circle cx="60" cy="50" r="37.2" fill="#000000" />
          </mask>

          {/* Earthshine Mask (The mysterious darkened side of the moon) */}
          <mask id={`earthshineMask-${id}`}>
            <rect width="100" height="100" fill="#000000" />
            <circle cx="50" cy="50" r="40" fill="#ffffff" />
            {/* Cut out the illuminated crescent so earthshine only covers the dark side */}
            <circle cx="50" cy="50" r="40" fill="#ffffff" />
          </mask>
        </defs>

        {/* --- LAYER 1: Ethereal Atmospheric Corona Bloom --- */}
        <circle cx="38" cy="50" r="54" fill={`url(#outerCorona-${id})`} />
        <circle cx="22" cy="50" r="28" fill={`url(#rimFlare-${id})`} />

        {/* --- LAYER 2: Mysterious Lunar Earthshine (Dark side of the celestial orb) --- */}
        {/* Soft, barely perceptible outline of the full moon resting in space */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#00A3D7"
          strokeWidth="0.5"
          strokeOpacity={0.25 * glowIntensity}
          strokeDasharray="1 3"
        />
        <circle
          cx="50"
          cy="50"
          r="39.8"
          fill="#0A0A0A"
          fillOpacity={0.3}
        />

        {/* --- LAYER 3: The Golden Crescent Body --- */}
        <g mask={`url(#crescentMask-${id})`}>
          {/* Luxurious Liquid Champagne-Gold Base */}
          <circle cx="50" cy="50" r="40" fill={`url(#liquidGold-${id})`} />

          {/* Smooth Curvature Specular Sheen */}
          <circle cx="38" cy="45" r="35" fill={`url(#specularSheen-${id})`} />

          {/* Soft Terminator Shadow for 3D Spherical Depth */}
          <circle cx="60" cy="50" r="40" fill={`url(#terminatorShadow-${id})`} />
        </g>

        {/* --- LAYER 4: Precision Metallic Edge Glint & Rim Highlights --- */}
        {/* Primary Specular Outer Rim */}
        <circle
          cx="50"
          cy="50"
          r="39.8"
          stroke={`url(#edgeHighlight-${id})`}
          strokeWidth="0.85"
          fill="none"
          mask={`url(#crescentMask-${id})`}
        />

        {/* Intense Specular Center Glint at the Apex of the Curve */}
        <path
          d="M10.2 50 A39.8 39.8 0 0 1 15.5 32"
          stroke="#FFFFFF"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M10.2 50 A39.8 39.8 0 0 0 15.5 68"
          stroke="#FFFFFF"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />

        {/* Fine Secondary Gold Shimmer on Inner Curve */}
        <circle
          cx="60"
          cy="50"
          r="37.2"
          stroke="#FF2D95"
          strokeWidth="0.45"
          strokeOpacity="0.4"
          fill="none"
          mask={`url(#crescentMask-${id})`}
        />

        {/* --- LAYER 5: Delicate Luminous Golden Stardust Particles --- */}
        {/* Micro-sparkles hovering along the illuminated perimeter */}
        <circle cx="14" cy="38" r="0.6" fill={`url(#stardustGlow-${id})`} />
        <circle cx="11.5" cy="48" r="0.8" fill={`url(#stardustGlow-${id})`} />
        <circle cx="13" cy="58" r="0.6" fill={`url(#stardustGlow-${id})`} />
        <circle cx="18" cy="28" r="0.5" fill={`url(#stardustGlow-${id})`} />
        <circle cx="19" cy="68" r="0.5" fill={`url(#stardustGlow-${id})`} />
        <circle cx="28" cy="18" r="0.4" fill={`url(#stardustGlow-${id})`} />
        <circle cx="29" cy="78" r="0.4" fill={`url(#stardustGlow-${id})`} />
      </svg>
    </div>
  );
};
