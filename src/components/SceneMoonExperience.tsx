import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CrescentMoon } from './CrescentMoon';

gsap.registerPlugin(ScrollTrigger);

export const SceneMoonExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const moonHolderRef = useRef<HTMLDivElement | null>(null);
  const text1Ref = useRef<HTMLDivElement | null>(null);
  const text2Ref = useRef<HTMLDivElement | null>(null);
  const coronaAuraRef = useRef<HTMLDivElement | null>(null);
  const moonBaseRotation = -15;

  useEffect(() => {
    const container = containerRef.current;
    const sticky = stickyRef.current;
    if (!container || !sticky) return;

    const ctx = gsap.context(() => {
      // Sticky pinned timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=220%', // Generous sticky duration for smooth luxury pacing
          pin: sticky,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      // 1. Initial State
      gsap.set(text1Ref.current, { opacity: 0, y: 50, filter: 'blur(10px)' });
      gsap.set(text2Ref.current, { opacity: 0, y: 50, filter: 'blur(10px)' });
      gsap.set(coronaAuraRef.current, { opacity: 0.2, scale: 0.8 });

      // 2. Phase 1: Moon grows in scale and halo intensifies, text 1 enters
      tl.to(moonHolderRef.current, {
        scale: 1.35,
        x: '12%',
        y: '-5%',
        rotate: -8,
        duration: 2,
        ease: 'power2.inOut',
      })
        .to(
          coronaAuraRef.current,
          {
            opacity: 0.75,
            scale: 1.3,
            duration: 2,
          },
          0
        )
        // "THE CITY SLEEPS." reveals with editorial power
        .to(
          text1Ref.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power2.out',
          },
          0.4
        )
        // 3. Phase 2: Text 1 fades out gracefully into darkness
        .to(
          text1Ref.current,
          {
            opacity: 0,
            y: -40,
            filter: 'blur(8px)',
            duration: 1.2,
            ease: 'power2.in',
          },
          2.2
        )
        // Moon expands further and illuminated edge becomes magnificent
        .to(
          moonHolderRef.current,
          {
            scale: 1.7,
            x: '-8%',
            y: '4%',
            rotate: -22,
            duration: 2.2,
            ease: 'power1.inOut',
          },
          2.2
        )
        .to(
          coronaAuraRef.current,
          {
            opacity: 0.9,
            scale: 1.6,
            duration: 2.2,
          },
          2.2
        )
        // "WE BEGIN." bursts in with champagne-gold grandeur
        .to(
          text2Ref.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.6,
            ease: 'power2.out',
          },
          2.8
        )
        // Brief lingering hold before exiting smoothly
        .to({}, { duration: 0.8 });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="scene-03"
      className="relative w-full bg-[#050505] selection:bg-[#C9A66B]/30"
      style={{ height: '320vh' }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#050505]"
      >
        {/* Soft Volumetric Background Corona Bloom */}
        <div
          ref={coronaAuraRef}
          className="pointer-events-none absolute w-[700px] sm:w-[1000px] h-[700px] sm:h-[1000px] rounded-full light-beam transition-transform duration-700"
          aria-hidden="true"
        />

        {/* Ambient Dark Horizon Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-radial-gradient opacity-40" />

        {/* The Signature Crescent Moon Visual Centerpiece */}
        <div
          ref={moonHolderRef}
          className="absolute z-10 flex items-center justify-center transition-transform will-change-transform"
        >
          <CrescentMoon
            size={window.innerWidth < 640 ? 300 : window.innerWidth < 1024 ? 420 : 540}
            rotation={moonBaseRotation}
            glowIntensity={0.95}
            enableCraters={true}
          />
        </div>

        {/* Text Layer 1: "THE CITY SLEEPS." */}
        <div
          ref={text1Ref}
          className="absolute z-20 max-w-5xl px-6 text-center sm:text-left sm:left-[12%] pointer-events-none select-none"
        >
          <span className="font-sans text-[10px] sm:text-xs tracking-[0.6em] text-[#C9A66B] uppercase block mb-3 font-light">
            ACT I &bull; THE WITCHING HOUR
          </span>
          <h2 className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-light text-[#F4EFE5] leading-[0.95] tracking-tight">
            THE CITY
            <br />
            <span className="italic font-light text-[#DFBE86]">SLEEPS.</span>
          </h2>
        </div>

        {/* Text Layer 2: "WE BEGIN." */}
        <div
          ref={text2Ref}
          className="absolute z-20 max-w-5xl px-6 text-center sm:text-right sm:right-[12%] pointer-events-none select-none"
        >
          <span className="font-sans text-[10px] sm:text-xs tracking-[0.6em] text-[#C9A66B] uppercase block mb-3 font-light">
            ACT II &bull; THE REIGN
          </span>
          <h2 className="font-editorial text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-light text-gold-pure leading-[0.9] tracking-tight">
            WE
            <br />
            <span className="italic font-light text-[#F4EFE5] gold-text-glow">BEGIN.</span>
          </h2>
          <p className="mt-6 font-sans text-xs sm:text-sm tracking-[0.45em] uppercase text-[#89847C] font-light">
            WHERE RESTRAINT GIVES WAY TO DESIRE
          </p>
        </div>

        {/* Scene progress indicator on the right edge */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 text-[9px] font-sans tracking-[0.3em] text-[#89847C]/50 uppercase">
          <span>03</span>
          <div className="w-[1px] h-16 bg-[#C9A66B]/20" />
          <span>MOON</span>
        </div>
      </div>
    </div>
  );
};
