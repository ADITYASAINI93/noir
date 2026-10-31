import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Gender } from '../types/registration';
import { BackButton } from '../components/BackButton';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Instagram,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { CrescentMoon } from '../components/CrescentMoon';
import { FilmGrain } from '../components/FilmGrain';

export const SignUpPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [gender, setGender] = useState<Gender | string>('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSubmittingRef = useRef(false);

  const { signUpWithPassword, user, isLoading: authLoading, isLocalMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/account', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const clearError = () => {
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isSubmittingRef.current) {
      return;
    }

    setError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please provide your full legal or preferred name (at least 2 characters).');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please retype carefully.');
      return;
    }

    if (!termsAgreed) {
      setError('You must accept the terms, privacy policy, and zero-tolerance drug policy to proceed.');
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    try {
      const res = await signUpWithPassword(
        cleanEmail,
        password,
        fullName,
        phone,
        instagram,
        gender,
        rememberMe
      );

      if (!res.success) {
        setError(res.error || 'Failed to create account.');
      } else if (res.sessionAvailable) {
        navigate('/account', { replace: true });
      } else {
        navigate('/signin', { replace: true, state: { accountCreated: true } });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed unexpectedly.';
      setError(msg);
    } finally {
      isSubmittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#08090B] text-[#F2F0EB] selection:bg-[#C6CDD5]/30 selection:text-[#FFFFFF] overflow-x-hidden flex flex-col justify-between py-10 px-4 sm:px-8">
      <FilmGrain />

      {/* Header */}
      <header className="relative z-20 max-w-4xl mx-auto w-full flex items-center justify-between pb-8 border-b border-[#343A43]">
        <BackButton fallbackUrl="/signin" fallbackLabel="Previous Page" />

        <Link to="/" className="flex items-baseline gap-1.5 focus:outline-none">
          <span className="font-display text-2xl font-bold tracking-[0.18em] text-[#F2F0EB]">
            NOIR
          </span>
          <span className="font-display text-[10px] font-bold tracking-[0.4em] text-[#C6CDD5]">
            EVENTS
          </span>
        </Link>
      </header>

      {/* Main Card */}
      <main className="relative z-10 max-w-lg mx-auto w-full my-auto">
        <div className="bg-[#17191E] border border-[#343A43] hover:border-[#7B8999] rounded-3xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-xl transition-colors">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-2">
              <CrescentMoon size={60} glowIntensity={0.8} />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-[0.15em] text-[#F2F0EB] uppercase">
              CREATE ACCOUNT
            </h1>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C6CDD5] to-transparent my-3" />
            <p className="font-display text-[11px] tracking-[0.25em] text-[#7B8999] uppercase">
              Member Registration Portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 flex items-start gap-2.5 text-xs leading-relaxed animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="signup_name"
                className="block font-display text-[11px] uppercase tracking-[0.22em] text-[#C6CDD5] mb-1.5 font-semibold"
              >
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup_name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  disabled={loading}
                  value={fullName}
                  onChange={(e) => {
                    clearError();
                    setFullName(e.target.value);
                  }}
                  placeholder="e.g. Kabir Mehra"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#08090B] border border-[#343A43] focus:border-[#C6CDD5] outline-none text-[#F2F0EB] placeholder-[#7B8999]/50 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <User className="w-4 h-4 text-[#7B8999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="signup_email"
                className="block font-display text-[11px] uppercase tracking-[0.22em] text-[#C6CDD5] mb-1.5 font-semibold"
              >
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup_email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => {
                    clearError();
                    setEmail(e.target.value);
                  }}
                  placeholder="kabir@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#08090B] border border-[#343A43] focus:border-[#C6CDD5] outline-none text-[#F2F0EB] placeholder-[#7B8999]/50 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <Mail className="w-4 h-4 text-[#7B8999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup_password"
                className="block font-display text-[11px] uppercase tracking-[0.22em] text-[#C6CDD5] mb-1.5 font-semibold"
              >
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup_password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => {
                    clearError();
                    setPassword(e.target.value);
                  }}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#08090B] border border-[#343A43] focus:border-[#C6CDD5] outline-none text-[#F2F0EB] placeholder-[#7B8999]/50 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <Lock className="w-4 h-4 text-[#7B8999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="p-1 text-[#7B8999] hover:text-[#C6CDD5] absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="signup_confirm_password"
                className="block font-display text-[11px] uppercase tracking-[0.22em] text-[#C6CDD5] mb-1.5 font-semibold"
              >
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup_confirm_password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => {
                    clearError();
                    setConfirmPassword(e.target.value);
                  }}
                  placeholder="Retype your password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#08090B] border border-[#343A43] focus:border-[#C6CDD5] outline-none text-[#F2F0EB] placeholder-[#7B8999]/50 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <Lock className="w-4 h-4 text-[#7B8999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block font-display text-[11px] uppercase tracking-[0.22em] text-[#C6CDD5] mb-1.5 font-semibold">
                Gender <span className="text-[10px] text-[#7B8999] lowercase font-normal">(optional)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Male', 'Female', 'Non-Binary', 'Prefer not to say'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      clearError();
                      setGender(gender === g ? '' : g);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-display uppercase tracking-wider border transition-all ${
                      gender === g
                        ? 'bg-[#C6CDD5] text-[#08090B] border-[#C6CDD5] font-bold shadow-[0_0_15px_rgba(198,205,213,0.3)]'
                        : 'bg-[#08090B] text-[#7B8999] border-[#343A43] hover:border-[#7B8999]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Instagram Handle */}
            <div>
              <label
                htmlFor="signup_instagram"
                className="block font-display text-[11px] uppercase tracking-[0.22em] text-[#C6CDD5] mb-1.5 font-semibold"
              >
                Instagram Profile <span className="text-[10px] text-[#7B8999] lowercase font-normal">(optional)</span>
              </label>
              <div className="relative">
                <input
                  id="signup_instagram"
                  name="instagram"
                  type="text"
                  disabled={loading}
                  value={instagram}
                  onChange={(e) => {
                    clearError();
                    setInstagram(e.target.value);
                  }}
                  placeholder="@yourhandle"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#08090B] border border-[#343A43] focus:border-[#C6CDD5] outline-none text-[#F2F0EB] placeholder-[#7B8999]/50 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <Instagram className="w-4 h-4 text-[#7B8999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="signup_phone"
                className="block font-display text-[11px] uppercase tracking-[0.22em] text-[#C6CDD5] mb-1.5 font-semibold"
              >
                Contact Number <span className="text-[10px] text-[#7B8999] lowercase font-normal">(optional)</span>
              </label>
              <div className="relative">
                <input
                  id="signup_phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  disabled={loading}
                  value={phone}
                  onChange={(e) => {
                    clearError();
                    setPhone(e.target.value);
                  }}
                  placeholder="+91 98765 43210"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#08090B] border border-[#343A43] focus:border-[#C6CDD5] outline-none text-[#F2F0EB] placeholder-[#7B8999]/50 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <Phone className="w-4 h-4 text-[#7B8999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Policy & Terms Agreement */}
            <div className="pt-2">
              <div className="flex items-start gap-3 bg-[#08090B]/90 p-3 rounded-xl border border-[#343A43] text-xs text-[#7B8999]">
                <input
                  id="signupTerms"
                  type="checkbox"
                  disabled={loading}
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[#343A43] bg-[#08090B] text-[#C6CDD5] focus:ring-[#C6CDD5] accent-[#C6CDD5] shrink-0 disabled:opacity-50"
                />
                <label htmlFor="signupTerms" className="cursor-pointer select-none leading-relaxed font-sans">
                  I accept the OBSIDIAN Terms &amp; Conditions and understand that a{' '}
                  <strong className="text-[#F2F0EB]">Strict Zero-Tolerance Drug Policy</strong> is enforced.
                </label>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label htmlFor="signupRememberMe" className="flex items-center gap-2.5 cursor-pointer select-none text-[#7B8999]">
                <input
                  id="signupRememberMe"
                  type="checkbox"
                  disabled={loading}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#343A43] bg-[#08090B] text-[#C6CDD5] focus:ring-[#C6CDD5] accent-[#C6CDD5] disabled:opacity-50"
                />
                <span className="font-display">Remember me across sessions</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-[#C6CDD5] via-[#E2E6EA] to-[#C6CDD5] hover:brightness-110 text-[#08090B] font-display text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(198,205,213,0.3)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#08090B]" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#08090B]" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer link to Sign In */}
          <div className="mt-8 pt-6 border-t border-[#343A43] text-center text-xs text-[#7B8999]">
            <span>Already have an account? </span>
            <Link to="/signin" className="text-[#C6CDD5] hover:text-[#FFFFFF] font-display font-semibold transition-colors">
              Sign In here
            </Link>
          </div>

          {isLocalMode && (
            <div className="mt-4 p-2.5 rounded-xl bg-[#17191E] border border-[#343A43] text-center">
              <p className="text-[10px] text-[#7B8999] font-display">
                Preview Mode: Fill in the form to register and log in instantly.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-8 border-t border-[#343A43] text-center">
        <p className="font-display text-[10px] tracking-[0.3em] uppercase text-[#7B8999]">
          OBSIDIAN • EXCLUSIVE MEMBER ACCESS • CHANDIGARH, INDIA
        </p>
      </footer>
    </div>
  );
};
