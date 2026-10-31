import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, UserPlus, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

export const StayConnected: React.FC = () => {
  const { user } = useAuth();
  const { settings } = useSiteSettings();

  const sanitizeTelHref = (phoneStr: string) => {
    return phoneStr.replace(/[^0-9+]/g, '');
  };

  return (
    <section
      id="stay-connected"
      className="relative w-full py-28 sm:py-36 px-4 sm:px-8 bg-[#050706] border-t border-[#18241E] overflow-hidden selection:bg-[#00F0A0]/30 z-10"
    >
      {/* Background Volumetric Emerald Glows (Subtle Parallax) */}
      <div className="parallax-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-[#05D38A]/08 rounded-full blur-[190px] pointer-events-none" />
      <div className="parallax-bg absolute top-1/2 left-1/3 -translate-y-1/2 w-[400px] h-[350px] bg-[#00F0A0]/06 rounded-full blur-[180px] pointer-events-none" />

      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-architectural-grid opacity-35 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center space-y-10">
        {/* Top Eyebrow */}
        <div className="reveal-on-scroll flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0A0E0C] border border-[#18241E] flex items-center justify-center text-[#00F0A0] shadow-[0_0_20px_rgba(0,240,160,0.15)]">
            <Zap className="w-5 h-5 text-[#00F0A0]" />
          </div>
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#00F0A0]" />
            <span className="font-display text-[11px] uppercase tracking-[0.35em] text-[#00F0A0] font-semibold">
              Join The Circle
            </span>
            <span className="w-8 h-[2px] bg-[#05D38A]" />
          </div>
        </div>

        {/* Section Heading: YOUR NEXT CHAPTER STARTS AFTER DARK. */}
        <div className="reveal-on-scroll space-y-4">
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.06em] text-white uppercase max-w-4xl mx-auto leading-tight">
            YOUR NEXT CHAPTER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0A0] via-[#05D38A] to-[#10B981]">
              STARTS AFTER DARK.
            </span>
          </h2>

          {/* Supporting text */}
          <p className="font-sans text-base sm:text-xl text-[#9CA3AF] font-light max-w-2xl mx-auto">
            Stay connected with NOIR EVENTS and discover what comes next.
          </p>
        </div>

        {/* 3 Call-To-Action Options: Instagram, Contact, and Member Access */}
        <div className="reveal-stagger-group flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
          {/* 1. Instagram Link */}
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal-stagger-item interactive-hover-lift group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#0A0E0C] border border-[#18241E] hover:border-[#05D38A]/50 text-white font-display text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase transition-all shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:bg-[#0E1511] active:scale-[0.98]"
          >
            <Instagram className="w-4 h-4 text-[#00F0A0] group-hover:scale-110 transition-transform" />
            <span>INSTAGRAM {settings.instagramHandle.toUpperCase()}</span>
          </a>

          {/* 2. Contact Concierge */}
          <Link
            to="/contact"
            className="reveal-stagger-item interactive-hover-lift w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#0A0E0C] border border-[#18241E] hover:border-[#05D38A]/50 text-white font-display text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase transition-all shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:bg-[#0E1511] active:scale-[0.98]"
          >
            <Mail className="w-4 h-4 text-[#00F0A0]" />
            <span>CONTACT US</span>
          </Link>

          {/* 3. Member Sign Up / Profile (Vibrant Mint CTA) */}
          <Link
            to={user ? '/account' : '/signup'}
            className="reveal-stagger-item interactive-hover-lift w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full btn-emerald-primary font-display text-xs sm:text-sm font-bold tracking-[0.22em] uppercase active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4 text-[#04140B]" />
            <span>{user ? 'VIEW MEMBER PROFILE' : 'BECOME A MEMBER'}</span>
            <ArrowRight className="w-4 h-4 text-[#04140B]" />
          </Link>
        </div>

        {/* Direct Contact & Footnote */}
        <div className="pt-8 space-y-3 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-sans text-xs text-[#9CA3AF]">
            <a href={`mailto:${settings.contactEmail}`} className="inline-flex items-center gap-2 hover:text-[#00F0A0] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#00F0A0]" />
              <span>{settings.contactEmail}</span>
            </a>
            <span className="text-[#18241E] hidden sm:inline">•</span>
            <a href={`tel:${sanitizeTelHref(settings.contactPhone)}`} className="inline-flex items-center gap-2 hover:text-[#00F0A0] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#00F0A0]" />
              <span>{settings.contactPhone}</span>
            </a>
          </div>
          <p className="font-display text-[10px] sm:text-[11px] tracking-[0.25em] text-[#6B7280] uppercase font-medium">
            {settings.cityState.toUpperCase()} • STRICT 21+ POLICY • ZERO-TOLERANCE CODE OF CONDUCT
          </p>
        </div>
      </div>
    </section>
  );
};
