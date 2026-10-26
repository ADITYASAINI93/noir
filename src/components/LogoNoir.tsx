import React from 'react';

interface LogoNoirProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showMoon?: boolean;
  className?: string;
  glow?: boolean;
}

export const LogoNoir: React.FC<LogoNoirProps> = ({
  size = 'md',
  showMoon = false,
  className = '',
  glow = false,
}) => {
  const sizeClasses = {
    sm: {
      container: 'gap-1',
      noir: 'text-lg tracking-[0.25em]',
      chd: 'text-[9px] tracking-[0.45em]',
      moonSize: 'w-6 h-6',
    },
    md: {
      container: 'gap-1.5',
      noir: 'text-2xl sm:text-3xl tracking-[0.28em]',
      chd: 'text-[10px] sm:text-[11px] tracking-[0.5em]',
      moonSize: 'w-9 h-9',
    },
    lg: {
      container: 'gap-2.5',
      noir: 'text-4xl sm:text-6xl md:text-7xl tracking-[0.3em]',
      chd: 'text-xs sm:text-sm md:text-base tracking-[0.6em]',
      moonSize: 'w-14 h-14 sm:w-20 sm:h-20',
    },
    hero: {
      container: 'gap-3 sm:gap-4',
      noir: 'text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] tracking-[0.25em] sm:tracking-[0.32em]',
      chd: 'text-xs sm:text-base md:text-lg tracking-[0.65em] sm:tracking-[0.8em]',
      moonSize: 'w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48',
    },
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center text-center select-none ${sizeClasses.container} ${className}`}>
      {/* Optional Integrated Crescent Moon Symbol */}
      {showMoon && (
        <div className={`relative mb-2 ${sizeClasses.moonSize}`}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-[0_0_15px_rgba(201,166,107,0.4)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="goldMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F4EFE5" />
                <stop offset="35%" stopColor="#DFBE86" />
                <stop offset="70%" stopColor="#C9A66B" />
                <stop offset="100%" stopColor="#8A6B34" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Elegant crescent moon matching profile picture */}
            <path
              d="M50 10 C28 10 10 28 10 50 C10 72 28 90 50 90 C34 76 34 24 50 10 Z"
              fill="url(#goldMoonGrad)"
              filter="url(#softGlow)"
            />
            {/* Subtle inner illuminated edge */}
            <path
              d="M50 12 C30 13 13 29 12 50 C12 68 28 85 48 88 C34 74 34 26 50 12 Z"
              stroke="#F4EFE5"
              strokeWidth="0.6"
              strokeOpacity="0.75"
              fill="none"
            />
          </svg>
        </div>
      )}

      {/* Main Serif Wordmark "NOIR" */}
      <h1
        className={`font-editorial font-light uppercase leading-none pl-[0.25em] ${sizeClasses.noir} ${
          glow ? 'gold-text-glow' : ''
        }`}
        style={{
          background: 'linear-gradient(180deg, #F9F6F0 0%, #E2C798 38%, #C9A66B 70%, #9E7D47 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: glow ? '0 0 35px rgba(201,166,107,0.3)' : 'none',
        }}
      >
        NOIR
      </h1>

      {/* Refined "CHD" Sub-lettering */}
      <div className="flex items-center justify-center w-full overflow-hidden">
        <span
          className={`font-sans font-light uppercase pl-[0.6em] text-[#C9A66B]/90 ${sizeClasses.chd}`}
          style={{
            letterSpacing: size === 'hero' ? '0.75em' : '0.55em',
          }}
        >
          CHD
        </span>
      </div>
    </div>
  );
};
