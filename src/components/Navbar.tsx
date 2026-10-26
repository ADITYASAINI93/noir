import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import { luxurySound } from '../utils/audio';

interface NavbarProps {
  onScrollToTop?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToTop }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = async () => {
    const active = await luxurySound.toggle();
    setIsPlayingAudio(active);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
        isScrolled
          ? 'bg-[#050505]/85 backdrop-blur-md py-4 border-b border-[#C9A66B]/15 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-6 sm:py-8 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Left: NOIR CHD wordmark */}
        <button
          onClick={onScrollToTop}
          className="group flex items-baseline gap-2 text-left focus:outline-none"
          aria-label="NOIR CHD Home"
        >
          <span className="font-editorial text-xl sm:text-2xl font-light tracking-[0.28em] text-[#F4EFE5] group-hover:text-[#C9A66B] transition-colors duration-300">
            NOIR
          </span>
          <span className="font-sans text-[9px] sm:text-[10px] font-normal tracking-[0.45em] text-[#C9A66B]/80 group-hover:text-[#C9A66B] transition-colors duration-300">
            CHD
          </span>
        </button>

        {/* Right: Sound Atmosphere Toggle & INSTAGRAM ↗ */}
        <div className="flex items-center gap-5 sm:gap-8">
          {/* Subtle Ambient Audio Toggle */}
          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 text-xs text-[#89847C] hover:text-[#C9A66B] transition-all duration-300 focus:outline-none"
            title={isPlayingAudio ? 'Mute atmosphere' : 'Play luxury atmosphere'}
            aria-label="Toggle ambient atmosphere audio"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#C9A66B] animate-pulse" />
                <span className="hidden md:inline font-sans text-[10px] tracking-[0.25em] uppercase text-[#C9A66B]">
                  ATMOSPHERE ON
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                <span className="hidden md:inline font-sans text-[10px] tracking-[0.25em] uppercase opacity-60 hover:opacity-100">
                  AUDIO
                </span>
              </>
            )}
          </button>

          {/* INSTAGRAM Link */}
          <a
            href="https://www.instagram.com/noir.chd/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-[11px] sm:text-xs font-sans uppercase tracking-[0.3em] text-[#F4EFE5] hover:text-[#C9A66B] transition-all duration-300 py-1"
          >
            <span className="relative">
              INSTAGRAM
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C9A66B] transition-all duration-300 group-hover:w-full" />
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#C9A66B]" />
          </a>
        </div>
      </div>

      {/* Ultra-thin Scroll Progress Line */}
      <div
        id="scroll-progress-line"
        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{ width: '100%' }}
      />
    </header>
  );
};
