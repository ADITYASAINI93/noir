import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full border-t border-[#C9A66B]/15 bg-[#050505] py-16 sm:py-20 px-6 sm:px-12 text-center select-none overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6">
        {/* Subtle Crescent Mark */}
        <div className="w-5 h-5 opacity-80 mb-2">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="footerMoonMask">
              <rect width="100" height="100" fill="#000" />
              <circle cx="50" cy="50" r="40" fill="#fff" />
              <circle cx="60" cy="50" r="37.2" fill="#000" />
            </mask>
            <circle cx="50" cy="50" r="40" fill="#C9A66B" mask="url(#footerMoonMask)" />
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

        {/* Navigation, Instagram & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-4 gap-4 sm:gap-0 text-[10px] sm:text-[11px] font-sans tracking-[0.35em] text-[#89847C]/70 uppercase">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
            <Link to="/register" className="hover:text-[#C9A66B] transition-colors duration-300">
              Registration
            </Link>
            <Link to="/signin" className="hover:text-[#C9A66B] transition-colors duration-300">
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-[#C9A66B] transition-colors duration-300">
              Sign Up
            </Link>
            <Link to="/admin/login" className="hover:text-[#C9A66B] transition-colors duration-300 opacity-60 hover:opacity-100">
              Admin Portal
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/noir.chd/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C9A66B] transition-colors duration-300"
            >
              @noir.chd
            </a>
            <span>&copy; 2026 NOIR CHD</span>
          </div>
        </div>

        {/* Zero Tolerance Drug Policy Notice in Small Words at End of Website */}
        <p className="text-[9px] tracking-[0.28em] text-[#89847C]/50 uppercase pt-2">
          Strict Zero-Tolerance Drug Policy Enforced • Strictly 21+ • Right of Admission Reserved
        </p>
      </div>
    </footer>
  );
};
