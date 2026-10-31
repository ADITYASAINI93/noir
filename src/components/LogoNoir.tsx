import React from 'react';

interface LogoNoirProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showMoon?: boolean;
  className?: string;
  glow?: boolean;
  subtitle?: string;
}

export const LogoNoir: React.FC<LogoNoirProps> = ({
  size = 'md',
  showMoon = false,
  className = '',
  glow = false,
  subtitle = 'EVENTS',
}) => {
  const sizeClasses = {
    sm: {
      container: 'gap-1',
      noir: 'text-lg tracking-[0.2em]',
      chd: 'text-[9px] tracking-[0.4em]',
      moonSize: 'w-6 h-6',
    },
    md: {
      container: 'gap-1.5',
      noir: 'text-2xl sm:text-3xl tracking-[0.22em]',
      chd: 'text-[10px] sm:text-[11px] tracking-[0.45em]',
      moonSize: 'w-9 h-9',
    },
    lg: {
      container: 'gap-2.5',
      noir: 'text-4xl sm:text-6xl md:text-7xl tracking-[0.25em]',
      chd: 'text-xs sm:text-sm md:text-base tracking-[0.55em]',
      moonSize: 'w-14 h-14 sm:w-20 sm:h-20',
    },
    hero: {
      container: 'gap-3 sm:gap-4',
      noir: 'text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] tracking-[0.22em]',
      chd: 'text-xs sm:text-base md:text-lg tracking-[0.65em]',
      moonSize: 'w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48',
    },
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center text-center select-none ${sizeClasses.container} ${className}`}>
      {/* Optional Integrated Symbol */}
      {showMoon && (
        <div className={`relative mb-2 ${sizeClasses.moonSize}`}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-[0_0_15px_rgba(198,205,213,0.3)]"
          >
            <defs>
              <linearGradient id="chromeLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#C6CDD5" />
                <stop offset="100%" stopColor="#7B8999" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="44" fill="#08090B" stroke="#343A43" strokeWidth="2" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="url(#chromeLogoGrad)" strokeWidth="3" />
            <path
              d="M34 30 L66 30 L38 70 L66 70"
              fill="none"
              stroke="url(#chromeLogoGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Main Wordmark */}
      <div className="flex flex-col items-center">
        <span
          className={`font-display font-black leading-none text-[#F2F0EB] ${sizeClasses.noir} ${
            glow ? 'drop-shadow-[0_0_20px_rgba(198,205,213,0.3)]' : ''
          }`}
        >
          NOIR
        </span>

        {subtitle && (
          <span
            className={`font-display font-bold uppercase leading-none text-[#C6CDD5] mt-1 ${sizeClasses.chd}`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
