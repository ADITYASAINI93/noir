import React from 'react';
import { Sparkles, Compass, ShieldCheck, Zap } from 'lucide-react';

export const NoirExperience: React.FC = () => {
  return (
    <section
      id="noir-experience"
      className="relative w-full py-24 sm:py-32 px-4 sm:px-8 bg-[#050706] border-t border-[#18241E] overflow-hidden selection:bg-[#00F0A0]/30 z-10"
    >
      {/* Background Volumetric Emerald & Mint Nebulas (Subtle Parallax) */}
      <div className="parallax-bg absolute top-1/2 left-0 w-96 h-96 bg-[#05D38A]/08 rounded-full blur-[170px] pointer-events-none" />
      <div className="parallax-bg absolute bottom-0 right-0 w-96 h-96 bg-[#00F0A0]/08 rounded-full blur-[170px] pointer-events-none" />

      {/* Subtle Architectural Grid Lines */}
      <div className="absolute inset-0 bg-architectural-grid opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Eyebrow */}
        <div className="reveal-on-scroll flex items-center gap-3 mb-6">
          <span className="w-8 h-[2px] bg-gradient-to-r from-[#00F0A0] to-[#05D38A]" />
          <span className="font-display text-[11px] uppercase tracking-[0.35em] text-[#00F0A0] font-semibold">
            The NOIR Experience
          </span>
        </div>

        {/* Section Layout Grid: Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="reveal-on-scroll font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.06em] text-white uppercase leading-[1.05]">
              BEYOND THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0A0] via-[#05D38A] to-[#10B981]">
                ORDINARY.
              </span>
            </h2>

            <p className="reveal-on-scroll font-display text-lg sm:text-2xl text-[#E5E7EB] font-light tracking-wide leading-relaxed">
              NOIR EVENTS represents a nexus of acoustic engineering, architecture, and luxury entertainment—engineered to redefine how Chandigarh encounters the night.
            </p>

            <div className="reveal-on-scroll space-y-5 text-sm sm:text-base text-[#9CA3AF] font-sans font-light leading-relaxed">
              <p>
                Chandigarh possesses an iconic architectural symmetry. Beneath its modernist geometry beats an underground current of electronic music culture, sensory production, and exclusive nightlife. NOIR EVENTS captures this nocturnal momentum, curating extraordinary spaces where sound design and refined hospitality converge.
              </p>
              <p>
                From progressive sonic stages to subterranean lounges across Sector 26 and Madhya Marg, we connect discerning audiences with high-caliber music culture and unforgettable atmospheres.
              </p>
            </div>

            {/* Core Values Bullet Highlights */}
            <div className="reveal-stagger-group pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#18241E]">
              <div className="reveal-stagger-item interactive-hover-lift space-y-1.5 p-4 rounded-2xl bg-[#0A0E0C] border border-[#18241E] hover:border-[#05D38A]/50 transition-all">
                <div className="flex items-center gap-2 text-[#00F0A0]">
                  <Sparkles className="w-4 h-4 text-[#00F0A0]" />
                  <span className="font-display text-xs uppercase tracking-[0.2em] font-semibold text-white">
                    Curation
                  </span>
                </div>
                <p className="text-[12px] text-[#9CA3AF] leading-normal font-sans">
                  Rigorous acoustic standards, premier sound rigs, and visual engineering.
                </p>
              </div>

              <div className="reveal-stagger-item interactive-hover-lift space-y-1.5 p-4 rounded-2xl bg-[#0A0E0C] border border-[#18241E] hover:border-[#05D38A]/50 transition-all">
                <div className="flex items-center gap-2 text-[#00F0A0]">
                  <Compass className="w-4 h-4 text-[#00F0A0]" />
                  <span className="font-display text-xs uppercase tracking-[0.2em] font-semibold text-white">
                    Discovery
                  </span>
                </div>
                <p className="text-[12px] text-[#9CA3AF] leading-normal font-sans">
                  Unveiling high-energy venues, hidden sonic lounges, and premier stages.
                </p>
              </div>

              <div className="reveal-stagger-item interactive-hover-lift space-y-1.5 p-4 rounded-2xl bg-[#0A0E0C] border border-[#18241E] hover:border-[#05D38A]/50 transition-all">
                <div className="flex items-center gap-2 text-[#00F0A0]">
                  <ShieldCheck className="w-4 h-4 text-[#00F0A0]" />
                  <span className="font-display text-xs uppercase tracking-[0.2em] font-semibold text-white">
                    Atmosphere
                  </span>
                </div>
                <p className="text-[12px] text-[#9CA3AF] leading-normal font-sans">
                  Strict 21+ code of conduct, respectful crowds, and zero tolerance.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Photography Composition */}
          <div className="reveal-on-scroll lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Emerald Glow Frame */}
              <div className="interactive-hover-card relative rounded-3xl overflow-hidden border border-[#18241E] p-2 bg-[#0A0E0C] backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:border-[#05D38A]/50 transition-all">
                <div className="relative h-[440px] sm:h-[500px] rounded-2xl overflow-hidden bg-[#050706]">
                  <img
                    src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85"
                    alt="Electronic concert stage atmosphere in Chandigarh"
                    className="w-full h-full object-cover filter contrast-115 brightness-90 hover:scale-105 transition-transform duration-1000 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-[#050706]/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#05D38A]/10 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Label */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0A0E0C]/90 backdrop-blur-md border border-[#18241E]">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#00F0A0]" />
                      <p className="font-display text-[10px] tracking-[0.3em] uppercase text-[#00F0A0] font-bold">
                        NOCTURNAL CULTURE
                      </p>
                    </div>
                    <p className="font-display text-base text-white font-semibold mt-1">
                      Elevating Chandigarh's after-dark narrative.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Accent Behind */}
              <div className="absolute -top-4 -right-4 w-32 h-32 border border-[#05D38A]/20 rounded-3xl -z-10 pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-[#18241E] rounded-3xl -z-10 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
