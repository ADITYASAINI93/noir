import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SceneDarkness: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLHeadingElement | null>(null);
  const line2Ref = useRef<HTMLHeadingElement | null>(null);
  const goldRayRef = useRef<HTMLDivElement | null>(null);
  const metallicSurfaceRef = useRef<HTMLDivElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Line by line reveal animation driven by scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'bottom 40%',
          scrub: 1.2,
        },
      });

      // Gold ray drifts and rotates slowly
      tl.fromTo(
        goldRayRef.current,
        { opacity: 0.1, rotate: -25, scale: 0.8 },
        { opacity: 0.45, rotate: -10, scale: 1.25, duration: 1.8 }
      )
        // Metallic surface reflection sweeps
        .fromTo(
          metallicSurfaceRef.current,
          { opacity: 0, x: '-20%' },
          { opacity: 0.6, x: '10%', duration: 2 },
          0
        )
        // First Editorial Statement: NOT EVERY NIGHT IS MEANT TO BE ORDINARY.
        .fromTo(
          line1Ref.current,
          { opacity: 0, y: 50, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' },
          0.3
        )
        // Subtle divider reveal
        .fromTo(
          dividerRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 0.4, duration: 1.2, ease: 'power2.inOut' },
          0.9
        )
        // Underneath: SOME ARE MEANT TO BE REMEMBERED.
        .fromTo(
          line2Ref.current,
          { opacity: 0, y: 40, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' },
          1.2
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scene-02"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 sm:px-12 py-32 overflow-hidden bg-gradient-to-b from-[#0A0A0A] via-[#111318] to-[#0A0A0A]"
    >
      {/* Volumetric Champagne-Gold Light Ray */}
      <div
        ref={goldRayRef}
        className="pointer-events-none absolute -top-40 right-[-10%] w-[800px] h-[900px] rounded-full light-beam mix-blend-screen opacity-20 transform -rotate-12 transition-transform"
        aria-hidden="true"
      />

      {/* Abstract dark metallic reflective plane */}
      <div
        ref={metallicSurfaceRef}
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[350px] bg-gradient-to-t from-[#007BA7]/[0.03] to-transparent blur-3xl opacity-30"
        aria-hidden="true"
      />

      {/* Chapter Marker */}
      <div className="relative z-10 mb-8 sm:mb-12 flex items-center gap-4">
        <span className="w-6 sm:w-10 h-[1px] bg-[#007BA7]/40" />
        <span className="font-sans text-[10px] sm:text-xs tracking-[0.5em] text-[#007BA7] uppercase font-light">
          PROLOGUE
        </span>
        <span className="w-6 sm:w-10 h-[1px] bg-[#007BA7]/40" />
      </div>

      {/* Large Editorial Statements */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8">
        <h2
          ref={line1Ref}
          className="font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#F5F5F5] leading-[1.15] sm:leading-[1.1] tracking-[-0.01em]"
        >
          NOT EVERY NIGHT IS MEANT
          <br className="hidden sm:inline" /> TO BE ORDINARY.
        </h2>

        {/* Delicate Champagne-Gold Accent Line */}
        <div
          ref={dividerRef}
          className="w-24 sm:w-36 h-[1px] bg-gradient-to-r from-transparent via-[#007BA7] to-transparent origin-center my-4"
        />

        <p
          ref={line2Ref}
          className="font-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light italic text-gold-pure leading-relaxed tracking-[0.04em]"
        >
          SOME ARE MEANT TO BE REMEMBERED.
        </p>

        {/* Ambient Coordinates / Subtext */}
        <p className="pt-8 sm:pt-12 font-sans text-[11px] sm:text-xs tracking-[0.4em] uppercase text-[#A1A1AA]/70 font-light">
          30.7333° N, 76.7794° E &bull; CHANDIGARH
        </p>
      </div>

      {/* Bottom ambient transition mist */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
    </section>
  );
};
