import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navbar } from './components/Navbar';
import { FilmGrain } from './components/FilmGrain';
import { ParticleField } from './components/ParticleField';
import { CustomCursor } from './components/CustomCursor';
import { SceneArrival } from './components/SceneArrival';
import { SceneDarkness } from './components/SceneDarkness';
import { SceneMoonExperience } from './components/SceneMoonExperience';
import { SceneAnticipation } from './components/SceneAnticipation';
import { SceneFinalReveal } from './components/SceneFinalReveal';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize smooth scrolling with Lenis
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.01 : 1.25,
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

    // Update global scroll progress line
    const progressLine = document.getElementById('scroll-progress-line');
    lenis.on('scroll', ({ progress }: { progress: number }) => {
      if (progressLine) {
        progressLine.style.transform = `scaleX(${progress})`;
        progressLine.style.transformOrigin = 'left';
        progressLine.style.opacity = progress > 0.02 ? '1' : '0';
      }
    });

    // Refresh ScrollTrigger after initial mount and images/fonts settle
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(refreshTimer);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleScrollToScene2 = () => {
    const scene2 = document.getElementById('scene-02');
    if (scene2 && lenisRef.current) {
      lenisRef.current.scrollTo(scene2, { duration: 1.6 });
    }
  };

  const handleScrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.8 });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F4EFE5] selection:bg-[#C9A66B]/30 selection:text-[#F4EFE5] overflow-x-hidden">
      {/* 1. Global Cinematic Film Grain Overlay */}
      <FilmGrain />

      {/* 2. Floating Golden Stardust Particles */}
      <ParticleField />

      {/* 3. Luxury Custom Cursor (Desktop Only) */}
      <CustomCursor />

      {/* 4. Minimal Floating Header */}
      <Navbar onScrollToTop={handleScrollToTop} />

      {/* 5. Main Cinematic Storyboard (5 Connected Scenes) */}
      <main className="relative w-full overflow-hidden">
        {/* Scene 01 — The Arrival */}
        <SceneArrival onEnterScroll={handleScrollToScene2} />

        {/* Scene 02 — Into The Darkness */}
        <SceneDarkness />

        {/* Scene 03 — The Moon Experience (Sticky visual centerpiece) */}
        <SceneMoonExperience />

        {/* Scene 04 — The Anticipation */}
        <SceneAnticipation />

        {/* Scene 05 — The Final Reveal (Coming Soon) */}
        <SceneFinalReveal />
      </main>

      {/* 6. Minimal Luxury Brand Footer */}
      <Footer />
    </div>
  );
};

export default App;
