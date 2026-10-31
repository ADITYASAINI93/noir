import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FilmGrain } from '../components/FilmGrain';
import { MapPin, ShieldCheck, Disc3, Users, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

export const AboutPage: React.FC = () => {
  const { settings } = useSiteSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `About ${settings.brandName} — ${settings.brandTagline} | ${settings.cityState}`;
  }, [settings.brandName, settings.brandTagline, settings.cityState]);

  return (
    <div className="relative min-h-screen bg-[#050706] text-[#F9FAFB] selection:bg-[#00F0A0]/30 selection:text-[#FFFFFF] overflow-x-hidden flex flex-col justify-between">
      <FilmGrain />

      {/* Volumetric Emerald Ambient Lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[750px] sm:w-[1000px] h-[500px] bg-gradient-radial from-[#05D38A]/10 via-[#064E3B]/05 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#00F0A0]/06 rounded-full blur-[180px] pointer-events-none" />

      {/* Subtle Architectural Grid */}
      <div className="absolute inset-0 bg-architectural-grid opacity-50 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 pt-32 sm:pt-36 pb-24 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-16 sm:space-y-24">
          
          {/* Header Banner */}
          <div className="text-center space-y-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101713] border border-[#1E3327] text-xs font-display uppercase tracking-[0.25em] text-[#00F0A0]">
              <Sparkles className="w-3.5 h-3.5 text-[#00F0A0]" />
              <span className="font-semibold">{settings.cityState} After Dark</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight uppercase leading-[1.05]">
              CURATING CHANDIGARH'S <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0A0] via-[#05D38A] to-[#10B981]">
                NOCTURNAL CULTURE.
              </span>
            </h1>

            <p className="font-display text-base sm:text-xl text-[#9CA3AF] font-light tracking-wide max-w-2xl mx-auto">
              Where progressive electronic soundscapes meet architectural design and refined nightlife culture.
            </p>
          </div>

          {/* Hero Atmospheric Image Frame */}
          <div className="relative w-full h-80 sm:h-[480px] rounded-3xl overflow-hidden border border-[#18241E] shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-[#0A0E0C]">
            <img
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1800&q=85"
              alt="Nightlife atmosphere in Chandigarh"
              className="w-full h-full object-cover filter contrast-125 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-black/40" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-display text-[#9CA3AF]">
              <span className="flex items-center gap-2 text-white">
                <MapPin className="w-3.5 h-3.5 text-[#00F0A0]" />
                <span>{settings.operatingRegion}</span>
              </span>
              <span className="hidden sm:inline uppercase tracking-[0.25em] text-[10px] text-[#00F0A0] font-bold">
                {settings.brandName} • {settings.brandTagline}
              </span>
            </div>
          </div>

          {/* Core Story Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start font-sans">
            <div className="p-7 sm:p-9 rounded-3xl bg-[#0A0E0C]/90 border border-[#18241E] space-y-4 backdrop-blur-xl">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#00F0A0] font-display font-semibold block">
                Our Genesis
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-white font-bold uppercase leading-snug">
                A City of Modern Architecture &amp; Emerging Sound.
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed font-light">
                Chandigarh is renowned worldwide for its clean geometric lines, modernist vision, and distinctive urban identity. As dusk falls, a vibrant community of electronic music lovers, audiophiles, and discerning partygoers gathers across the city's premier lounges, rooftop venues, and sound stages.
              </p>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed font-light">
                {settings.brandName} was established to bridge the gap between discerning guests and the finest nights Chandigarh has to offer. We eliminate cluttered flyers, unverified rumors, and generic event listings by curating authentic, high-caliber showcases.
              </p>
            </div>

            <div className="p-7 sm:p-9 rounded-3xl bg-[#0A0E0C]/90 border border-[#18241E] space-y-4 backdrop-blur-xl">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#05D38A] font-display font-semibold block">
                The Philosophy
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-white font-bold uppercase leading-snug">
                Intention, Atmosphere, and Respect for Sound.
              </h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed font-light">
                We believe a truly memorable night is defined by details: precision sound calibration, cohesive musical progression, respectful crowds, and transparent hospitality.
              </p>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed font-light">
                Whether you are exploring progressive electronic soundscapes in Sector 26, enjoying an Afro House sunset set along Madhya Marg, or celebrating a private milestone, {settings.brandName} provides direct access to the details that matter.
              </p>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="space-y-8 pt-8 border-t border-[#18241E]">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] uppercase font-display tracking-[0.3em] text-[#00F0A0] font-bold">
                Guiding Standards
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-white uppercase font-bold">
                What Sets NOIR Apart
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <div className="p-6 rounded-3xl bg-[#0A0E0C] border border-[#18241E] hover:border-[#00F0A0]/40 transition-all duration-300 space-y-3 shadow-xl group">
                <div className="w-10 h-10 rounded-2xl bg-[#101713] border border-[#1E3327] flex items-center justify-center text-[#00F0A0] group-hover:scale-105 transition-transform">
                  <Disc3 className="w-5 h-5 text-[#00F0A0]" />
                </div>
                <h4 className="font-display text-xl text-white font-bold">Acoustic Curation</h4>
                <p className="font-sans text-xs text-[#9CA3AF] leading-relaxed font-light">
                  We champion world-class melodic techno, Afro house, and progressive electronic producers alongside top regional resident selectors.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-6 rounded-3xl bg-[#0A0E0C] border border-[#18241E] hover:border-[#00F0A0]/40 transition-all duration-300 space-y-3 shadow-xl group">
                <div className="w-10 h-10 rounded-2xl bg-[#101713] border border-[#1E3327] flex items-center justify-center text-[#00F0A0] group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-[#00F0A0]" />
                </div>
                <h4 className="font-display text-xl text-white font-bold">Zero-Tolerance Safety</h4>
                <p className="font-sans text-xs text-[#9CA3AF] leading-relaxed font-light">
                  Strict 21+ age verification, zero-tolerance drug policies, and respectful crowd standards enforced across Chandigarh.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-6 rounded-3xl bg-[#0A0E0C] border border-[#18241E] hover:border-[#00F0A0]/40 transition-all duration-300 space-y-3 shadow-xl group">
                <div className="w-10 h-10 rounded-2xl bg-[#101713] border border-[#1E3327] flex items-center justify-center text-[#00F0A0] group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 text-[#00F0A0]" />
                </div>
                <h4 className="font-display text-xl text-white font-bold">Member Community</h4>
                <p className="font-sans text-xs text-[#9CA3AF] leading-relaxed font-light">
                  A unified portal allowing guests to track announcements, manage verified profiles, and connect directly with hosts.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0A0E0C] border border-[#18241E] text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#00F0A0]/08 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 space-y-3 max-w-xl mx-auto">
              <div className="w-10 h-10 rounded-2xl bg-[#101713] border border-[#1E3327] flex items-center justify-center text-[#00F0A0] mx-auto">
                <Zap className="w-4 h-4 text-[#00F0A0]" />
              </div>
              <h3 className="font-display text-3xl sm:text-4xl text-white font-bold uppercase tracking-tight">
                EXPERIENCE CHANDIGARH WITH US.
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#9CA3AF] font-light">
                Discover Chandigarh's nocturnal culture, acoustic soundscapes, or connect directly with our concierge team.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/#noir-experience"
                className="btn-emerald-primary px-8 py-3.5 rounded-full text-xs font-display uppercase tracking-[0.2em] font-bold flex items-center gap-2"
              >
                <span>Discover {settings.brandName}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3.5 rounded-full border border-[#1E3327] hover:border-[#05D38A]/50 bg-[#101713] text-white text-xs font-display uppercase tracking-[0.2em] font-semibold transition-all hover:bg-[#15221B]"
              >
                Contact Concierge
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
