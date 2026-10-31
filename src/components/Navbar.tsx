import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Volume2,
  VolumeX,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { luxurySound } from '../utils/audio';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

interface NavbarProps {
  onScrollToTop?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToTop }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, profile, isAdmin, signOut } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const toggleSound = async () => {
    const active = await luxurySound.toggle();
    setIsPlayingAudio(active);
  };

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    navigate('/');
  };

  const displayName =
    profile?.full_name ||
    (user as { user_metadata?: { full_name?: string } })?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Member';

  const isHome = location.pathname === '/';

  const handleEventsClick = () => {
    setMobileMenuOpen(false);
    if (isHome) {
      const el = document.getElementById('events');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate('/#events');
  };

  const handleDiscoverClick = () => {
    setMobileMenuOpen(false);
    if (isHome) {
      const el = document.getElementById('noir-experience');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate('/#noir-experience');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled || mobileMenuOpen
          ? 'bg-[#050706]/95 backdrop-blur-xl py-3.5 border-b border-[#18241E] shadow-[0_4px_30px_rgba(0,0,0,0.9)]'
          : 'bg-transparent py-5 sm:py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Left: Brand Logo text with subtle emerald dot */}
        <Link
          to="/"
          onClick={(e) => {
            if (isHome && onScrollToTop) {
              e.preventDefault();
              onScrollToTop();
            }
          }}
          className="group flex flex-col text-left focus:outline-none"
          aria-label="NOIR EVENTS Home"
        >
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-black tracking-[0.16em] text-white group-hover:text-[#00F0A0] transition-colors duration-300">
              {settings.brandName.split(' ')[0] || 'NOIR'}
            </span>
            <span className="font-display text-[11px] font-bold tracking-[0.38em] text-[#00F0A0] group-hover:text-white transition-colors duration-300">
              {settings.brandName.split(' ').slice(1).join(' ') || 'EVENTS'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0A0] shadow-[0_0_6px_#00F0A0]" />
          </div>
          <span className="font-display text-[8px] uppercase tracking-[0.38em] text-[#9CA3AF] -mt-0.5 hidden sm:block">
            {settings.cityState.split(',')[0]?.toUpperCase() || 'CHANDIGARH'}
          </span>
        </Link>

        {/* Center: Desktop Navigation Links (Pill Style inspired by SaaS reference) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#0A0E0C]/80 border border-[#18241E] text-xs font-display uppercase tracking-[0.22em] text-[#9CA3AF] backdrop-blur-md">
          <Link
            to="/"
            onClick={() => {
              if (isHome && onScrollToTop) onScrollToTop();
            }}
            className={`px-4 py-1.5 rounded-full transition-all duration-300 hover:text-white ${
              isHome ? 'bg-[#101713] text-white font-semibold shadow-[0_0_10px_rgba(5,211,138,0.15)]' : ''
            }`}
          >
            Home
          </Link>

          <button
            onClick={handleEventsClick}
            className="px-4 py-1.5 rounded-full transition-all duration-300 hover:text-white uppercase focus:outline-none"
          >
            Events
          </button>

          <Link
            to="/about"
            className={`px-4 py-1.5 rounded-full transition-all duration-300 hover:text-white ${
              location.pathname === '/about'
                ? 'bg-[#101713] text-white font-semibold shadow-[0_0_10px_rgba(5,211,138,0.15)]'
                : ''
            }`}
          >
            About
          </Link>

          <button
            onClick={handleDiscoverClick}
            className="px-4 py-1.5 rounded-full transition-all duration-300 hover:text-white uppercase focus:outline-none"
          >
            Discover
          </button>

          <Link
            to="/contact"
            className={`px-4 py-1.5 rounded-full transition-all duration-300 hover:text-white ${
              location.pathname === '/contact'
                ? 'bg-[#101713] text-white font-semibold shadow-[0_0_10px_rgba(5,211,138,0.15)]'
                : ''
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right: Audio Atmosphere, User Auth & Mobile Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Ambient Sound Toggle */}
          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#00F0A0] transition-all duration-300 focus:outline-none p-1.5"
            title={isPlayingAudio ? 'Mute atmosphere' : 'Play audio atmosphere'}
            aria-label="Toggle ambient atmosphere audio"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#00F0A0] animate-pulse" />
                <span className="hidden xl:inline font-display text-[10px] tracking-[0.22em] uppercase text-[#00F0A0] font-semibold">
                  AUDIO ON
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                <span className="hidden xl:inline font-display text-[10px] tracking-[0.22em] uppercase opacity-60 hover:opacity-100">
                  AUDIO
                </span>
              </>
            )}
          </button>

          {/* Conditional Navigation: SIGN IN / SIGN UP vs PROFILE vs ADMIN DASHBOARD */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2.5">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0A0E0C] border border-[#18241E] hover:border-[#05D38A] text-[#00F0A0] text-[10px] font-display uppercase tracking-wider font-semibold transition-all shadow-[0_0_15px_rgba(5,211,138,0.15)]"
                  title="Administrative Suite"
                >
                  <Shield className="w-3 h-3 text-[#00F0A0]" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              {/* Logged in User Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#18241E] hover:border-[#05D38A]/50 bg-[#0A0E0C] text-white text-xs transition-all duration-300"
                >
                  <div className="w-5 h-5 rounded-full bg-[#18241E] flex items-center justify-center text-[#00F0A0]">
                    <User className="w-3 h-3" />
                  </div>
                  <span className="font-display text-[11px] font-medium tracking-wider max-w-[110px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0A0E0C] border border-[#18241E] rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl">
                    <div className="px-3 py-2 border-b border-[#18241E]">
                      <p className="font-display text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold">
                        Member Account
                      </p>
                      <p className="font-medium text-white truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white hover:bg-[#101713] hover:text-[#00F0A0] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#00F0A0]" />
                        <span>Profile &amp; Settings</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#00F0A0] font-medium hover:bg-[#101713] transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-[#00F0A0]" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-[#18241E]">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Logged out: Sign In and Vibrant Mint Pill Sign Up */
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/signin"
                className="px-4 py-1.5 rounded-full text-[#9CA3AF] hover:text-white text-[11px] font-display uppercase tracking-[0.2em] transition-colors"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="btn-emerald-primary px-5 py-2 rounded-full text-[11px] font-display uppercase tracking-[0.2em] font-bold transition-all"
              >
                Become a Member
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl text-white hover:text-[#00F0A0] transition-colors focus:outline-none"
            aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#00F0A0]" /> : <Menu className="w-6 h-6 text-[#00F0A0]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 px-4 pb-6 pt-3 bg-[#050706]/98 border-b border-[#18241E] backdrop-blur-2xl animate-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col space-y-3 font-display uppercase tracking-[0.2em] text-xs">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg text-white hover:bg-[#0A0E0C] hover:text-[#00F0A0]"
            >
              Home
            </Link>
            <button
              onClick={handleEventsClick}
              className="text-left py-2.5 px-3 rounded-lg text-[#9CA3AF] hover:bg-[#0A0E0C] hover:text-[#00F0A0]"
            >
              Events
            </button>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg text-[#9CA3AF] hover:bg-[#0A0E0C] hover:text-[#00F0A0]"
            >
              About
            </Link>
            <button
              onClick={handleDiscoverClick}
              className="text-left py-2.5 px-3 rounded-lg text-[#9CA3AF] hover:bg-[#0A0E0C] hover:text-[#00F0A0]"
            >
              Discover
            </button>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg text-[#9CA3AF] hover:bg-[#0A0E0C] hover:text-[#00F0A0]"
            >
              Contact
            </Link>

            <div className="pt-3 border-t border-[#18241E] flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-lg bg-[#0A0E0C] text-[#00F0A0] flex items-center justify-between"
                  >
                    <span>My Account</span>
                    <User className="w-4 h-4 text-[#00F0A0]" />
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 px-3 rounded-lg bg-[#0A0E0C] text-white flex items-center justify-between border border-[#18241E]"
                    >
                      <span>Admin Dashboard</span>
                      <Shield className="w-4 h-4 text-[#00F0A0]" />
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="py-2.5 px-3 rounded-lg text-red-400 text-left hover:bg-red-500/10"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-lg text-[#9CA3AF] text-center border border-[#18241E]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-emerald-primary py-3 px-3 rounded-full text-center font-bold"
                  >
                    Become a Member
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
