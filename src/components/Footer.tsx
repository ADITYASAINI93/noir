import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full border-t border-[#C9A66B]/15 bg-[#050505] py-16 sm:py-20 px-6 sm:px-12 text-center select-none overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6">
        {/* Subtle Crescent Mark */}
        <div className="w-4 h-4 opacity-70 mb-2">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 8 A42 42 0 1 0 85 75 A34 34 0 1 1 50 8 Z"
              fill="#C9A66B"
            />
          </svg>
        </div>

        {/* Wordmark */}
        <div className="flex items-baseline gap-2">
          <span className="font-editorial text-2xl font-light tracking-[0.3em] text-[#F4EFE5]">
            NOIR
          </span>
          <span className="font-sans text-[10px] font-normal tracking-[0.5em] text-[#C9A66B]">
            CHD
          </span>
        </div>

        {/* Location */}
        <p className="font-sans text-[11px] sm:text-xs tracking-[0.45em] text-[#89847C] uppercase font-light">
          CHANDIGARH, INDIA
        </p>

        {/* Brand Tagline */}
        <p className="font-editorial text-lg sm:text-xl text-[#F4EFE5]/90 italic font-light tracking-[0.15em] pt-2">
          THE NIGHT IS YET TO BEGIN.
        </p>

        {/* Divider */}
        <div className="w-16 h-[1px] bg-[#C9A66B]/25 my-4" />

        {/* Instagram & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-4 gap-4 sm:gap-0 text-[10px] sm:text-[11px] font-sans tracking-[0.35em] text-[#89847C]/70 uppercase">
          <a
            href="https://www.instagram.com/noir.chd/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#C9A66B] transition-colors duration-300"
          >
            Instagram: @noir.chd
          </a>
          <span>&copy; 2026 NOIR CHD</span>
        </div>
      </div>
    </footer>
  );
};
