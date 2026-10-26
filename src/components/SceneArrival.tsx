import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CrescentMoon } from './CrescentMoon';
import { LogoNoir } from './LogoNoir';

interface SceneArrivalProps {
  onEnterScroll?: () => void;
}

export const SceneArrival: React.FC<SceneArrivalProps> = ({ onEnterScroll }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const moonWrapRef = useRef<HTMLDivElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const chdTextRef = useRef<HTMLDivElement | null>(null);
  const supportingTextRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);
  const hazeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Instantly reveal elements
      gsap.set([moonWrapRef.current, logoWrapRef.current, chdTextRef.current, supportingTextRef.current, scrollIndicatorRef.current, hazeRef.current], {
        opacity: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    // 1. Initial State: pitch black, all hidden
    gsap.set(moonWrapRef.current, { opacity: 0, scale: 0.85, filter: 'blur(12px)' });
    gsap.set(logoWrapRef.current, { opacity: 0, y: 15, filter: 'blur(8px)' });
    gsap.set(supportingTextRef.current, { opacity: 0, y: 20 });
    gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 10 });
    gsap.set(hazeRef.current, { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Step 1: 0s - completely black pause (0.4s)
    tl.to({}, { duration: 0.4 })
      // Step 2: Crescent moon slowly emerges from darkness
      .to(moonWrapRef.current, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 2.0,
        ease: 'power2.out',
      })
      // Gentle atmospheric haze illuminates behind
      .to(
        hazeRef.current,
        {
          opacity: 0.65,
          duration: 2.2,
          ease: 'power1.inOut',
        },
        '-=1.6'
      )
      // Step 3 & 4: NOIR wordmark reveals with gold reflection
      .to(
        logoWrapRef.current,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.8,
          ease: 'power3.out',
        },
        '-=1.4'
      )
      // Step 5: Supporting editorial copy reveals
      .to(
        supportingTextRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          stagger: 0.18,
          ease: 'power2.out',
        },
        '-=0.9'
      )
      // Step 6: Scroll indicator appears last
      .to(
        scrollIndicatorRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        },
        '-=0.6'
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-01"
      className="relative w-full min-h-screen flex flex-col items-center justify-between px-6 py-12 sm:py-16 overflow-hidden bg-[#050505]"
    >
      {/* Gentle Atmospheric Moonlight Haze */}
      <div
        ref={hazeRef}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[650px] sm:h-[900px] rounded-full light-beam opacity-0 transition-opacity"
        aria-hidden="true"
      />

      {/* Top spacing buffer */}
      <div className="w-full h-12 sm:h-16" />

      {/* Centerpiece: Crescent Moon & NOIR CHD Branding */}
      <div className="relative flex flex-col items-center justify-center my-auto z-20 text-center">
        {/* The Crescent Moon positioned directly above & behind the wordmark */}
        <div
          ref={moonWrapRef}
          className="relative mb-[-2.5rem] sm:mb-[-4rem] md:mb-[-5.5rem] z-10 transition-transform duration-700"
        >
          <CrescentMoon
            size={window.innerWidth < 640 ? 190 : window.innerWidth < 1024 ? 260 : 320}
            rotation={-18}
            glowIntensity={0.88}
          />
        </div>

        {/* Center Logo: NOIR CHD */}
        <div ref={logoWrapRef} className="relative z-20">
          <LogoNoir size="hero" glow={true} />
        </div>

        {/* Supporting Editorial Statements */}
        <div
          ref={supportingTextRef}
          className="mt-8 sm:mt-10 md:mt-12 flex flex-col items-center gap-2.5 sm:gap-3 text-center"
        >
          <p className="font-sans text-[11px] sm:text-xs md:text-sm tracking-[0.45em] sm:tracking-[0.6em] text-[#C9A66B] font-light uppercase">
            CHANDIGARH AFTER DARK
          </p>
          <div className="w-8 h-[1px] bg-[#C9A66B]/30 my-0.5" />
          <p className="font-editorial text-lg sm:text-2xl md:text-3xl text-[#F4EFE5]/90 tracking-[0.15em] sm:tracking-[0.2em] font-light italic">
            SOMETHING IS COMING.
          </p>
        </div>
      </div>

      {/* Minimal Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="relative z-20 flex flex-col items-center gap-3 cursor-pointer pt-6"
        onClick={onEnterScroll}
      >
        <span className="font-sans text-[10px] tracking-[0.45em] text-[#89847C] uppercase hover:text-[#C9A66B] transition-colors duration-300">
          SCROLL TO ENTER
        </span>
        {/* Thin vertical gold line that gently pulses and travels downward */}
        <div className="relative w-[1px] h-14 bg-[#C9A66B]/20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[#C9A66B] animate-scroll-line" />
        </div>
      </div>
    </section>
  );
};
