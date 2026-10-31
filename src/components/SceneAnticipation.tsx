import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SceneAnticipation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const line1Ref = useRef<HTMLHeadingElement | null>(null);
  const line2Ref = useRef<HTMLHeadingElement | null>(null);
  const subCopyRef = useRef<HTMLParagraphElement | null>(null);
  const beamRef = useRef<HTMLDivElement | null>(null);
  const clubAuraRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          end: 'bottom 35%',
          scrub: 1.2,
        },
      });

      // Horizontal beam sweeps slowly across
      tl.fromTo(
        beamRef.current,
        { opacity: 0, scaleX: 0.2 },
        { opacity: 0.8, scaleX: 1, duration: 1.5, ease: 'power2.inOut' }
      )
        // Nightclub atmospheric pulse
        .fromTo(
          clubAuraRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 0.35, scale: 1.15, duration: 2, ease: 'power1.out' },
          0
        )
        // Small label: AN EXPERIENCE YET TO BE REVEALED
        .fromTo(
          labelRef.current,
          { opacity: 0, y: 30, letterSpacing: '0.3em' },
          { opacity: 1, y: 0, letterSpacing: '0.6em', duration: 1.2, ease: 'power2.out' },
          0.3
        )
        // Line 1 (Ivory): "GOOD TASTE."
        .fromTo(
          line1Ref.current,
          { opacity: 0, y: 60, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out' },
          0.7
        )
        // Line 2 (Muted Champagne Gold): "BAD DECISIONS."
        .fromTo(
          line2Ref.current,
          { opacity: 0, y: 60, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out' },
          1.2
        )
        // Supporting copy: "Chandigarh, something different is on its way."
        .fromTo(
          subCopyRef.current,
          { opacity: 0, y: 30 },
          { opacity: 0.85, y: 0, duration: 1.4, ease: 'power2.out' },
          1.7
        );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="scene-04"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 py-36 overflow-hidden bg-[#0A0A0A]"
    >
      {/* Horizontal Champagne-Gold Laser / Light Beam */}
      <div
        ref={beamRef}
        className="pointer-events-none absolute top-1/2 left-0 right-0 h-[1.5px] horizontal-beam transform -translate-y-1/2 opacity-0"
        aria-hidden="true"
      />

      {/* Abstract Nightclub Lighting: Slow undulating midnight glow */}
      <div
        ref={clubAuraRef}
        className="pointer-events-none absolute w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-gradient-to-tr from-[#007BA7]/[0.06] via-[#A8874F]/[0.03] to-transparent blur-[120px] opacity-0 animate-pulse-subtle"
        aria-hidden="true"
      />

      {/* Content wrapper */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center space-y-8 sm:space-y-12">
        {/* Small Editorial Label */}
        <p
          ref={labelRef}
          className="font-sans text-[10px] sm:text-xs md:text-sm tracking-[0.55em] sm:tracking-[0.65em] uppercase text-[#007BA7] font-medium"
        >
          AN EXPERIENCE YET TO BE REVEALED
        </p>

        {/* Oversized Statement */}
        <div className="flex flex-col items-center space-y-2 sm:space-y-4">
          {/* First Line: Warm Ivory */}
          <h2
            ref={line1Ref}
            className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-light text-[#F5F5F5] leading-[0.95] tracking-tight uppercase"
          >
            GOOD TASTE.
          </h2>

          {/* Second Line: Muted Champagne Gold */}
          <h2
            ref={line2Ref}
            className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-light text-gold-muted leading-[0.95] tracking-tight uppercase italic"
          >
            BAD DECISIONS.
          </h2>
        </div>

        {/* Minimal Supporting Copy */}
        <div ref={subCopyRef} className="pt-6 sm:pt-10 flex flex-col items-center gap-4">
          <div className="w-12 h-[1px] bg-[#007BA7]/30" />
          <p className="font-editorial text-xl sm:text-2xl md:text-3xl text-[#F5F5F5]/80 font-light italic tracking-wide max-w-xl">
            &ldquo;Chandigarh, something different is on its way.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};
