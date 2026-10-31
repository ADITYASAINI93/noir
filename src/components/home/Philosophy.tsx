import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

export const Philosophy: React.FC = () => {
  return (
    <section
      id="philosophy"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 bg-[#050706] border-t border-[#18241E] overflow-hidden selection:bg-[#00F0A0]/30 z-10"
    >
      {/* Background Volumetric Emerald Glows (Subtle Parallax) */}
      <div className="parallax-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#05D38A]/08 rounded-full blur-[180px] pointer-events-none" />
      <div className="parallax-bg absolute bottom-10 right-10 w-[450px] h-[300px] bg-[#00F0A0]/06 rounded-full blur-[170px] pointer-events-none" />

      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-architectural-grid opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center space-y-12">
        {/* Top Ornament */}
        <div className="reveal-on-scroll flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0A0E0C] border border-[#18241E] flex items-center justify-center text-[#00F0A0] shadow-[0_0_20px_rgba(0,240,160,0.15)]">
            <Zap className="w-5 h-5 text-[#00F0A0]" />
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#00F0A0]" />
            <span className="font-display text-[11px] uppercase tracking-[0.35em] text-[#00F0A0] font-semibold">
              Our Philosophy
            </span>
            <span className="w-8 h-[2px] bg-[#05D38A]" />
          </div>
        </div>

        {/* Section Heading: NOT JUST ANOTHER NIGHT OUT. */}
        <h2 className="reveal-on-scroll font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.06em] text-white uppercase max-w-4xl mx-auto leading-tight">
          NOT JUST ANOTHER{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0A0] via-[#05D38A] to-[#10B981]">
            NIGHT OUT.
          </span>
        </h2>

        {/* Editorial Subtitle Quote */}
        <p className="reveal-on-scroll font-display text-xl sm:text-2xl md:text-3xl text-[#E5E7EB] font-light tracking-wide max-w-3xl mx-auto leading-relaxed">
          "The future of nightlife belongs to intentional sound, immersive visual production, and a crowd that values the pulse of the room over superficial noise."
        </p>

        {/* Story Text Grid */}
        <div className="reveal-on-scroll grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 text-left max-w-4xl mx-auto text-sm sm:text-base text-[#9CA3AF] font-sans font-light leading-relaxed pt-4 border-t border-[#18241E]">
          <p>
            In a nocturnal environment often crowded with routine formats and generic club nights, NOIR EVENTS was envisioned as a forward-looking catalyst for Chandigarh. We treat electronic music not as passive background sound, but as an art form that transforms spaces, elevates energy, and unites people.
          </p>
          <p>
            From subterranean techno rooms in Madhya Marg to elevated rooftop sound lounges in Sector 26, our focus is uncompromising: curating cutting-edge acoustic fidelity, championing visionary selectors, and cultivating a safe, high-energy community for music enthusiasts across Chandigarh.
          </p>
        </div>

        {/* Heritage Statement */}
        <div className="reveal-on-scroll pt-8">
          <div className="interactive-hover-card inline-block p-6 sm:p-8 rounded-3xl bg-[#0A0E0C] border border-[#18241E] hover:border-[#05D38A]/50 backdrop-blur-xl max-w-2xl mx-auto shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#00F0A0]" />
              <p className="font-display text-[11px] tracking-[0.3em] uppercase text-[#00F0A0] font-bold">
                ROOTED IN CHANDIGARH
              </p>
            </div>
            <p className="font-display text-lg text-white font-medium leading-normal">
              Inspired by the geometric balance and bold modernism of our city, engineered for those who embrace the energy of the dark.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
