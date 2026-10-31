import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();

  const sanitizeTelHref = (phoneStr: string) => {
    return phoneStr.replace(/[^0-9+]/g, '');
  };

  return (
    <footer className="relative w-full border-t border-[#18241E] bg-[#050706] text-[#9CA3AF] font-sans selection:bg-[#00F0A0]/20">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 pb-12 border-b border-[#18241E]">
          {/* Brand Column (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-baseline gap-2">
              <span className="font-display text-2xl sm:text-3xl font-black tracking-[0.16em] text-white">
                {settings.brandName.split(' ')[0] || 'NOIR'}
              </span>
              <span className="font-display text-[11px] font-bold tracking-[0.38em] text-[#00F0A0]">
                {settings.brandName.split(' ').slice(1).join(' ') || 'EVENTS'}
              </span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-[#00F0A0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0A0] shadow-[0_0_6px_#00F0A0]" />
              <p className="font-display text-[11px] uppercase tracking-[0.25em] text-[#00F0A0] font-semibold">
                {settings.brandTagline}
              </p>
            </div>

            <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-sm font-light">
              Chandigarh's curated platform for elevated nocturnal culture, acoustic engineering, and exclusive nightlife experiences across {settings.operatingRegion}.
            </p>

            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-4 h-4 text-[#00F0A0]" />
                <span className="font-display tracking-wider uppercase text-[11px]">{settings.cityState}</span>
              </div>
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Mail className="w-4 h-4 text-[#00F0A0]" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-[#00F0A0] transition-colors text-[11px]">
                  {settings.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Phone className="w-4 h-4 text-[#00F0A0]" />
                <a href={`tel:${sanitizeTelHref(settings.contactPhone)}`} className="hover:text-[#00F0A0] transition-colors text-[11px]">
                  {settings.contactPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Column 1: Discover */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-white font-bold">
              Discover
            </h4>
            <ul className="space-y-2.5 font-display tracking-wider text-[11px]">
              <li>
                <a href="/#events" className="hover:text-[#00F0A0] transition-colors">
                  Upcoming Showcases
                </a>
              </li>
              <li>
                <a href="/#noir-experience" className="hover:text-[#00F0A0] transition-colors">
                  The NOIR Experience
                </a>
              </li>
              <li>
                <a href="/#philosophy" className="hover:text-[#00F0A0] transition-colors">
                  Our Philosophy
                </a>
              </li>
              <li>
                <a href="/#stay-connected" className="hover:text-[#00F0A0] transition-colors">
                  Stay Connected
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Brand & Portal */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-white font-bold">
              Brand &amp; Access
            </h4>
            <ul className="space-y-2.5 font-display tracking-wider text-[11px]">
              <li>
                <Link to="/about" className="hover:text-[#00F0A0] transition-colors">
                  About NOIR
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#00F0A0] transition-colors">
                  Contact &amp; Concierge
                </Link>
              </li>
              <li>
                <Link to="/signin" className="hover:text-[#00F0A0] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-[#00F0A0] transition-colors">
                  Sign Up (Membership)
                </Link>
              </li>
              <li>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#00F0A0] transition-colors"
                >
                  <span>Instagram {settings.instagramHandle}</span>
                  <ArrowUpRight className="w-3 h-3 text-[#05D38A]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Governance */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-white font-bold">
              Governance
            </h4>
            <ul className="space-y-2.5 font-display tracking-wider text-[11px]">
              <li>
                <Link to="/privacy" className="hover:text-[#00F0A0] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#00F0A0] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#00F0A0] transition-colors">
                  Administrator Portal
                </Link>
              </li>
            </ul>

            <div className="pt-2 text-[10px] text-[#9CA3AF] space-y-1">
              <span className="flex items-center gap-1.5 font-display uppercase tracking-wider text-[#00F0A0]">
                <ShieldCheck className="w-3.5 h-3.5" />
                21+ Strict Admission
              </span>
              <p className="font-light">Government photo identification required at venue doors.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="font-display tracking-[0.2em] uppercase text-[10px] text-[#9CA3AF]">
            &copy; {new Date().getFullYear()} NOIR EVENTS • CHANDIGARH, INDIA. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-6 font-display tracking-wider text-[10px] text-[#9CA3AF]">
            <Link to="/privacy" className="hover:text-[#00F0A0] transition-colors">
              PRIVACY
            </Link>
            <Link to="/terms" className="hover:text-[#00F0A0] transition-colors">
              TERMS
            </Link>
            <Link to="/contact" className="hover:text-[#00F0A0] transition-colors">
              CONCIERGE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
