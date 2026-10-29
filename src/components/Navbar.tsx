import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowUpRight, User, Shield, LogOut, Ticket, ChevronDown } from 'lucide-react';
import { luxurySound } from '../utils/audio';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onScrollToTop?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToTop }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
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

  const toggleSound = async () => {
    const active = await luxurySound.toggle();
    setIsPlayingAudio(active);
  };

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    navigate('/');
  };

  const displayName =
    profile?.full_name ||
    (user as { user_metadata?: { full_name?: string } })?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Guest';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
        isScrolled
          ? 'bg-[#050505]/90 backdrop-blur-md py-3.5 border-b border-[#C9A66B]/15 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-5 sm:py-7 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Left: NOIR CHD wordmark */}
        <button
          onClick={onScrollToTop}
          className="group flex items-baseline gap-2 text-left focus:outline-none"
          aria-label="NOIR CHD Home"
        >
          <span className="font-editorial text-xl sm:text-2xl font-light tracking-[0.28em] text-[#F4EFE5] group-hover:text-[#C9A66B] transition-colors duration-300">
            NOIR
          </span>
          <span className="font-sans text-[9px] sm:text-[10px] font-normal tracking-[0.45em] text-[#C9A66B]/80 group-hover:text-[#C9A66B] transition-colors duration-300">
            CHD
          </span>
        </button>

        {/* Right: Auth Options, Registration & Atmosphere */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Subtle Ambient Audio Toggle */}
          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 text-xs text-[#89847C] hover:text-[#C9A66B] transition-all duration-300 focus:outline-none"
            title={isPlayingAudio ? 'Mute atmosphere' : 'Play luxury atmosphere'}
            aria-label="Toggle ambient atmosphere audio"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#C9A66B] animate-pulse" />
                <span className="hidden lg:inline font-sans text-[10px] tracking-[0.25em] uppercase text-[#C9A66B]">
                  ATMOSPHERE ON
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                <span className="hidden lg:inline font-sans text-[10px] tracking-[0.25em] uppercase opacity-60 hover:opacity-100">
                  AUDIO
                </span>
              </>
            )}
          </button>

          {/* INSTAGRAM Link */}
          <a
            href="https://www.instagram.com/noir.chd/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-[11px] font-sans uppercase tracking-[0.25em] text-[#89847C] hover:text-[#C9A66B] transition-colors duration-300"
          >
            <span>INSTAGRAM</span>
            <ArrowUpRight className="w-3 h-3 text-[#C9A66B]" />
          </a>

          {/* Conditional User Navigation vs Sign In / Sign Up */}
          {user ? (
            /* Logged in User Menu */
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C9A66B]/40 hover:border-[#C9A66B] bg-[#0E0E0E] text-[#F4EFE5] text-xs transition-all duration-300"
              >
                <div className="w-5 h-5 rounded-full bg-[#C9A66B]/20 flex items-center justify-center text-[#C9A66B]">
                  <User className="w-3 h-3" />
                </div>
                <span className="font-sans text-[11px] font-medium tracking-wider max-w-[110px] truncate">
                  {displayName}
                </span>
                <ChevronDown className="w-3 h-3 text-[#C9A66B]" />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0E0E0E] border border-[#C9A66B]/35 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-[#C9A66B]/15">
                    <p className="font-sans text-[10px] uppercase tracking-wider text-[#C9A66B]">Signed in as</p>
                    <p className="font-medium text-[#F4EFE5] truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#F4EFE5] hover:bg-[#C9A66B]/15 hover:text-[#DFBE86] transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#C9A66B]" />
                      <span>My Account &amp; Profile</span>
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#F4EFE5] hover:bg-[#C9A66B]/15 hover:text-[#DFBE86] transition-colors"
                    >
                      <Ticket className="w-3.5 h-3.5 text-[#C9A66B]" />
                      <span>Get Event Pass</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#C9A66B] font-medium hover:bg-[#C9A66B]/20 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#C9A66B]" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-[#C9A66B]/15">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-300 hover:bg-red-500/15 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged out: Sign In, Sign Up, & Register buttons */
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/signin"
                className="px-2.5 sm:px-3 py-1.5 rounded-full text-[#89847C] hover:text-[#C9A66B] text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] transition-colors"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="px-2.5 sm:px-3 py-1.5 rounded-full border border-[#C9A66B]/30 hover:border-[#C9A66B] text-[#F4EFE5] hover:text-[#DFBE86] text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] transition-colors"
              >
                Sign Up
              </Link>

              <Link
                to="/register"
                className="px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#DFBE86] via-[#C9A66B] to-[#A8874F] text-[#050505] text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] font-semibold hover:opacity-90 shadow-[0_0_15px_rgba(201,166,107,0.3)] transition-all"
              >
                RSVP
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Ultra-thin Scroll Progress Line */}
      <div
        id="scroll-progress-line"
        className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{ width: '100%' }}
      />
    </header>
  );
};
