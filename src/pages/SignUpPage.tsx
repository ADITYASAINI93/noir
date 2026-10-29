import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Instagram,
  AlertCircle,
  ArrowLeft,
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
    <div className="relative min-h-screen bg-[#050505] text-[#F4EFE5] selection:bg-[#C9A66B]/30 selection:text-[#F4EFE5] overflow-x-hidden flex flex-col justify-between py-10 px-4 sm:px-8">
      <FilmGrain />

      {/* Header */}
      <header className="relative z-20 max-w-4xl mx-auto w-full flex items-center justify-between pb-8 border-b border-[#C9A66B]/15">
        <Link
          to="/"
          className="group flex items-center gap-2 text-xs font-sans tracking-[0.3em] uppercase text-[#89847C] hover:text-[#C9A66B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Home</span>
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

      {/* Main Card */}
      <main className="relative z-10 max-w-lg mx-auto w-full my-auto">
        <div className="bg-[#0E0E0E]/95 border border-[#C9A66B]/30 rounded-3xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-2">
              <CrescentMoon size={60} glowIntensity={0.8} />
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-light tracking-[0.2em] text-[#F4EFE5] uppercase">
              CREATE ACCOUNT
            </h1>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent my-3" />
            <p className="font-sans text-[11px] tracking-[0.25em] text-[#89847C] uppercase">
              Guest Registration Portal
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
                className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-1.5"
              >
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup_name"
                  type="text"
                  required
                  disabled={loading}
                  value={fullName}
                  onChange={(e) => {
                    clearError();
                    setFullName(e.target.value);
                  }}
                  placeholder="e.g. Kabir Mehra"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <User className="w-4 h-4 text-[#89847C] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="signup_email"
                className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-1.5"
              >
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup_email"
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => {
                    clearError();
                    setEmail(e.target.value);
                  }}
                  placeholder="kabir@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <Mail className="w-4 h-4 text-[#89847C] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup_password"
                className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-1.5"
              >
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => {
                    clearError();
                    setPassword(e.target.value);
                  }}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <Lock className="w-4 h-4 text-[#89847C] absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="p-1 text-[#89847C] hover:text-[#C9A66B] absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors disabled:opacity-50"
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
                className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-1.5"
              >
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup_confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => {
                    clearError();
                    setConfirmPassword(e.target.value);
                  }}
                  placeholder="Retype your password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <Lock className="w-4 h-4 text-[#89847C] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Instagram Handle */}
            <div>
              <label
                htmlFor="signup_instagram"
                className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-1.5"
              >
                Instagram Profile <span className="text-[10px] text-[#89847C] lowercase">(optional)</span>
              </label>
              <div className="relative">
                <input
                  id="signup_instagram"
                  type="text"
                  disabled={loading}
                  value={instagram}
                  onChange={(e) => {
                    clearError();
                    setInstagram(e.target.value);
                  }}
                  placeholder="@yourhandle"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <Instagram className="w-4 h-4 text-[#C9A66B] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="signup_phone"
                className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-1.5"
              >
                Contact Number <span className="text-[10px] text-[#89847C] lowercase">(optional)</span>
              </label>
              <div className="relative">
                <input
                  id="signup_phone"
                  type="tel"
                  disabled={loading}
                  value={phone}
                  onChange={(e) => {
                    clearError();
                    setPhone(e.target.value);
                  }}
                  placeholder="+91 98765 43210"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <Phone className="w-4 h-4 text-[#89847C] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Policy & Terms Agreement */}
            <div className="pt-2">
              <div className="flex items-start gap-3 bg-[#050505]/70 p-3 rounded-xl border border-[#C9A66B]/15 text-xs text-[#89847C]">
                <input
                  id="signupTerms"
                  type="checkbox"
                  disabled={loading}
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[#C9A66B]/40 bg-[#050505] text-[#C9A66B] focus:ring-[#C9A66B] accent-[#C9A66B] shrink-0 disabled:opacity-50"
                />
                <label htmlFor="signupTerms" className="cursor-pointer select-none leading-relaxed">
                  I accept the NOIR CHD Terms &amp; Conditions and understand that a{' '}
                  <strong className="text-[#F4EFE5]">Strict Zero-Tolerance Drug Policy</strong> is enforced.
                </label>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label htmlFor="signupRememberMe" className="flex items-center gap-2.5 cursor-pointer select-none text-[#89847C]">
                <input
                  id="signupRememberMe"
                  type="checkbox"
                  disabled={loading}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#C9A66B]/40 bg-[#050505] text-[#C9A66B] focus:ring-[#C9A66B] accent-[#C9A66B] disabled:opacity-50"
                />
                <span>Remember me across sessions</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl border border-[#C9A66B]/60 bg-gradient-to-r from-[#DFBE86] via-[#C9A66B] to-[#A8874F] text-[#050505] font-sans text-xs uppercase tracking-[0.3em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(201,166,107,0.2)] hover:opacity-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#050505]" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#050505]" />
                  <span>Create Guest Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer link to Sign In */}
          <div className="mt-8 pt-6 border-t border-[#C9A66B]/15 text-center text-xs text-[#89847C]">
            <span>Already registered? </span>
            <Link to="/signin" className="text-[#C9A66B] hover:text-[#DFBE86] font-medium transition-colors">
              Sign In here
            </Link>
          </div>

          {isLocalMode && (
            <div className="mt-4 p-2.5 rounded-xl bg-[#C9A66B]/10 border border-[#C9A66B]/20 text-center">
              <p className="text-[10px] text-[#DFBE86]">
                Preview Mode: Fill in the form to register and log in instantly.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-8 border-t border-[#C9A66B]/15 text-center">
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#89847C]">
          NOIR CHD • EXCLUSIVE GUEST DIRECTORY
        </p>
      </footer>
    </div>
  );
};