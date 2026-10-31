import React from 'react';

/**
 * AmbientAtmosphere
 * Continuous, ultra-smooth ambient background motion:
 * - Slow cyan/teal and emerald volumetric light gradients
 * - Soft diagonal light sweep
 * - Low-contrast, high-end nightlife atmosphere
 * - Hardware-accelerated and strictly respects prefers-reduced-motion
 */
export const AmbientAtmosphere: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* 1. Slow Cyan / Teal Volumetric Gradient Orb (Top-Right / Mid) */}
      <div
        className="absolute -top-32 right-[-10%] w-[650px] sm:w-[900px] h-[650px] sm:h-[900px] rounded-full animate-ambient-drift-1"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.07) 0%, rgba(5, 211, 138, 0.03) 45%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />

      {/* 2. Slow Emerald / Mint Volumetric Gradient Orb (Center-Left / Mid) */}
      <div
        className="absolute top-[40%] -left-40 w-[600px] sm:w-[850px] h-[600px] sm:h-[850px] rounded-full animate-ambient-drift-2"
        style={{
          background: 'radial-gradient(circle, rgba(0, 240, 160, 0.06) 0%, rgba(5, 211, 138, 0.025) 50%, transparent 70%)',
          filter: 'blur(130px)',
        }}
      />

      {/* 3. Deep Nocturnal Teal Base Ambient (Bottom-Right) */}
      <div
        className="absolute -bottom-40 right-[15%] w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] rounded-full animate-ambient-drift-1"
        style={{
          background: 'radial-gradient(circle, rgba(5, 211, 138, 0.05) 0%, rgba(0, 229, 255, 0.02) 45%, transparent 70%)',
          filter: 'blur(140px)',
        }}
      />

      {/* 4. Soft, ultra-low-contrast light sweep bar */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div
          className="w-[200%] h-48 -top-10 -left-1/2 animate-light-sweep bg-gradient-to-r from-transparent via-[#00F0A0]/[0.035] to-transparent"
        />
      </div>
    </div>
  );
};
