import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navbar } from '../components/Navbar';
import { FilmGrain } from '../components/FilmGrain';
import { ParticleField } from '../components/ParticleField';
import { AmbientAtmosphere } from '../components/AmbientAtmosphere';
import { CustomCursor } from '../components/CustomCursor';
import { Footer } from '../components/Footer';

import { HeroCinematic } from '../components/home/HeroCinematic';
import { UpcomingEvents } from '../components/home/UpcomingEvents';
import { NoirExperience } from '../components/home/NoirExperience';
import { Philosophy } from '../components/home/Philosophy';
import { StayConnected } from '../components/home/StayConnected';

gsap.registerPlugin(ScrollTrigger);

export const HomePage: React.FC = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced-motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize smooth scrolling with Lenis
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.01 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Tasteful GSAP ScrollTrigger reveals and subtle background parallax
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.reveal-on-scroll, .reveal-stagger-item', { opacity: 1, y: 0 });
        return;
      }

      // 1. Single Element Scroll Reveals (Headings, quotes, banners)
      const revealElements = gsap.utils.toArray<HTMLElement>('.reveal-on-scroll');
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });

      // 2. Staggered Group Reveals (Pillars, value cards, buttons)
      const staggerGroups = gsap.utils.toArray<HTMLElement>('.reveal-stagger-group');
      staggerGroups.forEach((group) => {
        const items = group.querySelectorAll('.reveal-stagger-item');
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: group,
                start: 'top 86%',
                once: true,
              },
            }
          );
        }
      });

      // 3. Background Parallax for Ambient Glow Blobs only (Content is non-drifting)
      const parallaxElements = gsap.utils.toArray<HTMLElement>('.parallax-bg');
      parallaxElements.forEach((bg) => {
        gsap.to(bg, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: bg.parentElement || bg,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleScrollToDiscover = () => {
    const el = document.getElementById('noir-experience');
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleScrollToExplore = () => {
    const el = document.getElementById('events') || document.getElementById('philosophy');
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleScrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050706] text-[#F9FAFB] selection:bg-[#00F0A0]/30 selection:text-[#FFFFFF] overflow-x-hidden flex flex-col justify-between">
      {/* 1. Global Subtle Film Grain Overlay */}
      <FilmGrain />

      {/* 2. Floating Ambient Motes (Cyan, Teal, Emerald & Mint) */}
      <ParticleField />

      {/* 3. Continuous Low-Contrast Ambient Light Gradients & Sweeps */}
      <AmbientAtmosphere />

      {/* 4. Luxury Custom Cursor (Desktop Only) */}
      <CustomCursor />

      {/* 5. Luxury Floating Header */}
      <Navbar onScrollToTop={handleScrollToTop} />

      {/* 6. Main Homepage Sections */}
      <main className="relative w-full overflow-hidden flex-1 z-10">
        {/* SaaS-Inspired Rounded Hero Panel with Emerald Backlighting */}
        <HeroCinematic
          onDiscoverClick={handleScrollToDiscover}
          onExploreClick={handleScrollToExplore}
        />

        {/* Section 2: Published Showcases & Events from Admin Dashboard */}
        <UpcomingEvents />

        {/* Section 3: The NOIR Experience (BEYOND THE ORDINARY) */}
        <NoirExperience />

        {/* Section 4: Our Philosophy (NOT JUST ANOTHER NIGHT OUT) */}
        <Philosophy />

        {/* Section 5: Stay Connected (Concierge & Membership CTAs) */}
        <StayConnected />
      </main>

      {/* 7. Comprehensive Brand Footer */}
      <Footer />
    </div>
  );
};
