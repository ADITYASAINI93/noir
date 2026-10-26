import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, ArrowRight } from 'lucide-react';
import { CrescentMoon } from './CrescentMoon';
import { LogoNoir } from './LogoNoir';

gsap.registerPlugin(ScrollTrigger);

export const SceneFinalReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const moonRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const comingSoonRef = useRef<HTMLDivElement | null>(null);
  const dateLocationRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLAnchorElement | null>(null);
  const handleRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 65%',
          end: 'bottom 80%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        moonRef.current,
        { opacity: 0, scale: 0.7, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.6, ease: 'power2.out' }
      )
        .fromTo(
          logoRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' },
          '-=1.1'
        )
        .fromTo(
          comingSoonRef.current,
          { opacity: 0, letterSpacing: '0.3em' },
          { opacity: 1, letterSpacing: '0.65em', duration: 1.2, ease: 'power2.out' },
          '-=0.8'
        )
        .fromTo(
          dateLocationRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' },
          '-=0.6'
        )
        .fromTo(
          buttonRef.current,
          { opacity: 0, scale: 0.94, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'back.out(1.4)' },
          '-=0.5'
        )
        .fromTo(
          handleRef.current,
          { opacity: 0 },
          { opacity: 0.8, duration: 0.8, ease: 'power1.out' },
          '-=0.4'
        );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-05"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-28 sm:py-36 overflow-hidden bg-[#050505]"
    >
      {/* Luxury Vignette & Soft Moon Corona */}
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient opacity-60" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] light-beam opacity-25" />

      {/* Main Content Box */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Refined Crescent Moon matching original profile picture identity */}
        <div ref={moonRef} className="relative mb-[-1.5rem] sm:mb-[-2.5rem] z-10">
          <CrescentMoon
            size={220}
            rotation={0}
            glowIntensity={0.92}
            className="w-36 h-36 sm:w-48 sm:h-48"
          />
        </div>

        {/* Prominent NOIR CHD Wordmark */}
        <div ref={logoRef} className="relative z-20 mb-8 sm:mb-10">
          <LogoNoir size="lg" glow={true} />
        </div>

        {/* COMING SOON Announcement */}
        <div ref={comingSoonRef} className="mb-4 sm:mb-5">
          <h2 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-light text-[#F4EFE5] uppercase tracking-[0.5em] sm:tracking-[0.65em] pl-[0.5em]">
            COMING SOON.
          </h2>
        </div>

        {/* Date & Location */}
        <div
          ref={dateLocationRef}
          className="flex flex-col items-center gap-2 mb-12 sm:mb-14"
        >
          <div className="w-10 h-[1px] bg-[#C9A66B]/40 mb-1" />
          <p className="font-sans text-xs sm:text-sm tracking-[0.55em] text-[#C9A66B] font-light uppercase pl-[0.55em]">
            DECEMBER 2026
          </p>
          <p className="font-sans text-[11px] sm:text-xs tracking-[0.45em] text-[#89847C] font-light uppercase pl-[0.45em]">
            CHANDIGARH, INDIA
          </p>
        </div>

        {/* Luxury CTA Button: FOLLOW THE UNKNOWN */}
        <div className="flex flex-col items-center gap-4">
          <a
            ref={buttonRef}
            href="https://www.instagram.com/noir.chd/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-4.5 rounded-full border border-[#C9A66B]/50 hover:border-[#C9A66B] bg-[#0E0E0E]/80 backdrop-blur-sm text-[#F4EFE5] hover:text-[#050505] transition-all duration-500 ease-out overflow-hidden gold-glow-subtle gold-glow-hover"
          >
            {/* Shimmer background on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-[#DFBE86] via-[#C9A66B] to-[#A8874F] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

            {/* Icon */}
            <Instagram className="relative z-10 w-4 h-4 text-[#C9A66B] group-hover:text-[#050505] transition-colors duration-500" />

            {/* Label */}
            <span className="relative z-10 font-sans text-xs sm:text-sm font-medium tracking-[0.35em] uppercase">
              FOLLOW THE UNKNOWN
            </span>

            {/* Arrow */}
            <ArrowRight className="relative z-10 w-4 h-4 text-[#C9A66B] group-hover:text-[#050505] transition-transform duration-500 group-hover:translate-x-1" />
          </a>

          {/* Instagram Handle Subtext */}
          <p
            ref={handleRef}
            className="font-sans text-xs tracking-[0.45em] text-[#89847C] font-light uppercase pt-1"
          >
            @NOIR.CHD
          </p>
        </div>
      </div>
    </section>
  );
};
