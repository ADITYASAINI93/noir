import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  ArrowLeft,
  X,
  Loader2,
  User,
  Mail,
  Phone,
  Instagram,
  Ban,
  Sparkles,
} from 'lucide-react';
import { submitRegistration } from '../services/registrationService';
import { RegistrationResponse } from '../types/registration';
import { CrescentMoon } from '../components/CrescentMoon';
import { FilmGrain } from '../components/FilmGrain';
import { ParticleField } from '../components/ParticleField';
import { CustomCursor } from '../components/CustomCursor';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<RegistrationResponse | null>(null);

  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize smooth scroll & cinematic entrance
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.01 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
    });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const animId = requestAnimationFrame(raf);

    if (!prefersReducedMotion && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 28, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.1 }
      );
    }

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please provide your full legal or preferred name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!privacyAgreed) {
      setError('You must acknowledge the event privacy and zero-tolerance drug policy to proceed.');
      return;
    }

    setLoading(true);

    try {
      const response = await submitRegistration({
        full_name: fullName,
        email,
        phone: phone.trim() ? phone : undefined,
        instagram_handle: instagram.trim() ? instagram : undefined,
        privacy_acknowledged: privacyAgreed,
      });

      setSuccessData(response);

      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while submitting.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReference = () => {
    if (successData?.reference_id) {
      navigator.clipboard.writeText(successData.reference_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setInstagram('');
    setPrivacyAgreed(false);
    setSuccessData(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F4EFE5] selection:bg-[#C9A66B]/30 selection:text-[#F4EFE5] overflow-x-hidden flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-8">
      {/* Cinematic Overlays */}
      <FilmGrain />
      <ParticleField />
      <CustomCursor />

      {/* Ambient Radial Golden Aura */}
      <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] light-beam opacity-25" />

      {/* Top Header / Brand Bar */}
      <header className="relative z-20 max-w-4xl mx-auto w-full flex items-center justify-between pb-8 border-b border-[#C9A66B]/15">
        <Link
          to="/"
          className="group flex items-center gap-2 text-xs font-sans tracking-[0.3em] uppercase text-[#89847C] hover:text-[#C9A66B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Experience</span>
        </Link>

        <Link to="/" className="flex items-baseline gap-1.5 focus:outline-none">
          <span className="font-editorial text-2xl font-light tracking-[0.25em] text-[#F4EFE5]">
            NOIR
          </span>
          <span className="font-sans text-[10px] font-normal tracking-[0.45em] text-[#C9A66B]">
            CHD
          </span>
        </Link>
      </header>

      {/* Main Body */}
      <main className="relative z-10 max-w-xl mx-auto w-full my-8">
        <div ref={cardRef}>
          {!successData ? (
            /* REGISTRATION CARD */
            <div className="relative bg-[#0E0E0E]/95 border border-[#C9A66B]/30 hover:border-[#C9A66B]/50 transition-colors duration-500 rounded-3xl p-6 sm:p-11 shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-xl">
              {/* Subtle top gold highlight line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent" />

              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-3">
                  <CrescentMoon size={75} glowIntensity={0.85} />
                </div>
                <h1 className="font-editorial text-3xl sm:text-4xl font-light tracking-[0.2em] text-[#F4EFE5] uppercase">
                  GUEST LIST ACCESS
                </h1>
                <div className="w-14 h-[1px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent my-3.5" />
                <p className="font-sans text-xs tracking-[0.3em] text-[#C9A66B] uppercase font-light">
                  Chandigarh Private Showcase
                </p>
                <p className="font-sans text-[11px] text-[#89847C] mt-2 max-w-sm leading-relaxed">
                  Register for exclusive entry accreditation, private notifications, and event schedule reveals.
                </p>
              </div>

              {/* Error Notification */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 flex items-start gap-3 text-xs leading-relaxed animate-in fade-in duration-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="full_name"
                    className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-2"
                  >
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="full_name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kabir Mehra"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300"
                    />
                    <User className="w-4 h-4 text-[#89847C] absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-2"
                  >
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kabir@example.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300"
                    />
                    <Mail className="w-4 h-4 text-[#89847C] absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Instagram Handle (New requirement) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="instagram"
                      className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B]"
                    >
                      Instagram Profile
                    </label>
                    <span className="font-sans text-[10px] tracking-[0.1em] text-[#89847C]/80">
                      Recommended for guest verification
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="instagram"
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@yourhandle"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300"
                    />
                    <Instagram className="w-4 h-4 text-[#C9A66B] absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="phone"
                      className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B]"
                    >
                      Contact Number
                    </label>
                    <span className="font-sans text-[10px] tracking-[0.1em] text-[#89847C]/80">
                      Optional (SMS / WhatsApp)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300"
                    />
                    <Phone className="w-4 h-4 text-[#89847C] absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Privacy & No Drug Policy Agreement */}
                <div className="pt-2">
                  <div className="flex items-start gap-3 bg-[#050505]/70 p-3.5 rounded-xl border border-[#C9A66B]/15">
                    <input
                      id="privacy"
                      type="checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-[#C9A66B]/40 bg-[#050505] text-[#C9A66B] focus:ring-[#C9A66B] focus:ring-offset-0 cursor-pointer accent-[#C9A66B] shrink-0"
                    />
                    <label htmlFor="privacy" className="text-xs text-[#89847C] leading-relaxed cursor-pointer select-none">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setShowPolicyModal(true)}
                        className="text-[#C9A66B] underline underline-offset-2 hover:text-[#DFBE86] transition-colors"
                      >
                        Privacy & Event Policies
                      </button>
                      . I understand that NOIR CHD strictly enforces a{' '}
                      <strong className="text-[#F4EFE5]">Zero-Tolerance Drug Policy</strong>.
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group mt-4 py-4 rounded-xl border border-[#C9A66B]/60 bg-gradient-to-r from-[#DFBE86]/20 via-[#C9A66B]/30 to-[#A8874F]/20 hover:from-[#DFBE86] hover:via-[#C9A66B] hover:to-[#A8874F] text-[#F4EFE5] hover:text-[#050505] font-sans text-xs uppercase tracking-[0.35em] font-medium transition-all duration-500 flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(201,166,107,0.15)] hover:shadow-[0_0_35px_rgba(201,166,107,0.35)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C9A66B] group-hover:text-[#050505]" />
                      <span>Confirming Guest Record...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#C9A66B] group-hover:text-[#050505] transition-colors" />
                      <span>Confirm Guest Registration</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* BEAUTIFUL CONFIRMATION PASS */
            <div className="relative bg-[#0E0E0E]/95 border border-[#C9A66B]/45 rounded-3xl p-6 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.95)] backdrop-blur-xl text-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent" />

              {/* Pass Stamp / Seal */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#C9A66B]/15 border border-[#C9A66B]/50 flex items-center justify-center text-[#C9A66B] shadow-[0_0_30px_rgba(201,166,107,0.3)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl font-light tracking-[0.2em] text-[#F4EFE5] uppercase">
                Access Granted
              </h2>
              <div className="w-14 h-[1px] bg-[#C9A66B]/40 mx-auto my-3" />
              <p className="font-sans text-xs tracking-[0.25em] text-[#C9A66B] uppercase mb-6">
                Official NOIR CHD Guest Record
              </p>

              {/* Reference ID Card */}
              <div className="bg-[#050505] border border-[#C9A66B]/30 rounded-2xl p-5 mb-6 text-left relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#89847C]">
                    Guest Reference Pass
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Registered
                  </span>
                </div>

                <div className="flex items-center justify-between my-2">
                  <span className="font-sans text-2xl sm:text-3xl font-light tracking-[0.25em] text-[#C9A66B]">
                    {successData.reference_id}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyReference}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C9A66B]/15 hover:bg-[#C9A66B]/30 text-[#C9A66B] text-xs transition-colors border border-[#C9A66B]/30"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400 font-sans text-[10px] tracking-wider">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="font-sans text-[10px] tracking-wider">COPY PASS</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="border-t border-[#C9A66B]/15 mt-4 pt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#89847C] text-[10px] uppercase tracking-wider block">Registrant</span>
                    <span className="text-[#F4EFE5] font-medium">{successData.full_name}</span>
                  </div>
                  <div>
                    <span className="text-[#89847C] text-[10px] uppercase tracking-wider block">Instagram</span>
                    <span className="text-[#C9A66B]">{successData.instagram_handle || 'Not Provided'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#89847C] text-[10px] uppercase tracking-wider block">Email Address</span>
                    <span className="text-[#F4EFE5] break-all">{successData.email}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#89847C] leading-relaxed mb-8 max-w-md mx-auto">
                Your credentials have been securely logged. Present your reference ID or email upon arrival at reception.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#C9A66B]/30 hover:border-[#C9A66B] text-[#C9A66B] font-sans text-xs uppercase tracking-[0.25em] transition-colors"
                >
                  Register Another Guest
                </button>
                <Link
                  to="/"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C9A66B] text-[#050505] font-sans text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#DFBE86] transition-colors"
                >
                  Return to Experience
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* POLICY MODAL WITH EXPLICIT ZERO-TOLERANCE DRUG POLICY */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300">
          <div className="relative max-w-lg w-full bg-[#0E0E0E] border border-[#C9A66B]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F4EFE5] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#C9A66B]/20">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C9A66B]" />
                <h3 className="font-editorial text-lg tracking-[0.15em] text-[#F4EFE5] uppercase">
                  NOIR CHD Policies & Code of Conduct
                </h3>
              </div>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="text-[#89847C] hover:text-[#F4EFE5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-xs text-[#89847C] space-y-3.5 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              {/* Highlighted No Drug Policy Box */}
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200">
                <div className="flex items-center gap-2 mb-1.5 font-sans uppercase tracking-wider font-semibold text-red-300">
                  <Ban className="w-4 h-4 text-red-400" />
                  <span>Strict Zero-Tolerance Drug Policy</span>
                </div>
                <p className="text-[11px] leading-relaxed text-red-200/90">
                  NOIR CHD strictly enforces a zero-tolerance policy against illegal drugs, narcotics, and banned substances of any kind. Possession, consumption, solicitation, or distribution on premises will result in immediate refusal of entry, unconditional removal from the venue, permanent blacklisting from future showcases, and handover to law enforcement authorities.
                </p>
              </div>

              <div>
                <strong className="text-[#F4EFE5] block mb-1">Age Requirement:</strong>
                <p>This event is strictly 21+. Valid government-issued photo identification is mandatory at the door.</p>
              </div>

              <div>
                <strong className="text-[#F4EFE5] block mb-1">Data Collection & Privacy:</strong>
                <p>We collect your full name, email address, contact number, and Instagram profile solely for guest identification, admission coordination, and direct updates. We do not sell or share personal information with third parties.</p>
              </div>

              <div>
                <strong className="text-[#F4EFE5] block mb-1">Right of Admission:</strong>
                <p>Management reserves the ultimate right of admission. Security protocols including personal and bag screenings will be conducted at entry.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C9A66B]/20 flex justify-end">
              <button
                onClick={() => setShowPolicyModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#C9A66B] text-[#050505] font-sans text-xs uppercase tracking-wider font-medium hover:bg-[#DFBE86] transition-colors"
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer with Small Words Drug Policy Notice */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-8 border-t border-[#C9A66B]/15 text-center space-y-1.5">
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#89847C]">
          NOIR CHD • PRIVATE EVENT DIRECTORY • CHANDIGARH
        </p>
        <p className="font-sans text-[9px] tracking-[0.25em] text-[#89847C]/60 uppercase">
          Strict Zero-Tolerance Drug Policy Enforced • Strictly 21+ • Right of Admission Reserved
        </p>
      </footer>
    </div>
  );
};
