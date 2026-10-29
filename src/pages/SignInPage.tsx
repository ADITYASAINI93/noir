import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { CrescentMoon } from '../components/CrescentMoon';
import { FilmGrain } from '../components/FilmGrain';

export const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const isSubmittingRef = React.useRef(false);

  const { signInWithPassword, user, isLoading: authLoading, isLocalMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated, or consume incoming state
  useEffect(() => {
    if (!authLoading && user) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/account';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  useEffect(() => {
    const locState = location.state as { email?: string; accountCreated?: boolean } | null;
    if (locState?.email && !email) {
      setEmail(locState.email);
    }
    if (locState?.accountCreated) {
      setSuccessNotice('Account created successfully. Please sign in with your credentials.');
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isSubmittingRef.current) return;

    setError(null);
    setSuccessNotice(null);

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    try {
      const res = await signInWithPassword(cleanEmail, password, rememberMe, 'guest');
      if (!res.success) {
        setError(res.error || 'Invalid email or password.');
      } else {
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/account';
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed unexpectedly.';
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
      <main className="relative z-10 max-w-md mx-auto w-full my-auto">
        <div className="bg-[#0E0E0E]/95 border border-[#C9A66B]/30 rounded-3xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-2">
              <CrescentMoon size={60} glowIntensity={0.8} />
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-light tracking-[0.2em] text-[#F4EFE5] uppercase">
              SIGN IN
            </h1>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent my-3" />
            <p className="font-sans text-[11px] tracking-[0.25em] text-[#89847C] uppercase">
              Guest Portal
            </p>
          </div>

          {/* Success */}
          {successNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-start gap-2.5 text-xs leading-relaxed animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 flex items-start gap-2.5 text-xs leading-relaxed animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="signin_email"
                className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="signin_email"
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <Mail className="w-4 h-4 text-[#89847C] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="signin_password"
                  className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B]"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-[#89847C] hover:text-[#C9A66B] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="signin_password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300 disabled:opacity-50"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label htmlFor="signinRememberMe" className="flex items-center gap-2.5 cursor-pointer select-none text-[#89847C]">
                <input
                  id="signinRememberMe"
                  type="checkbox"
                  disabled={loading}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#C9A66B]/40 bg-[#050505] text-[#C9A66B] focus:ring-[#C9A66B] accent-[#C9A66B] disabled:opacity-50"
                />
                <span>Remember me</span>
              </label>
              <Link to="/signup" className="text-[#C9A66B] hover:text-[#DFBE86] transition-colors">
                Need an account?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 rounded-xl border border-[#C9A66B]/60 bg-gradient-to-r from-[#DFBE86] via-[#C9A66B] to-[#A8874F] text-[#050505] font-sans text-xs uppercase tracking-[0.3em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(201,166,107,0.2)] hover:opacity-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#050505]" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#050505]" />
                  <span>Sign In to NOIR</span>
                </>
              )}
            </button>
          </form>

          {/* Footer link to Sign Up */}
          <div className="mt-8 pt-6 border-t border-[#C9A66B]/15 text-center text-xs text-[#89847C]">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-[#C9A66B] hover:text-[#DFBE86] font-medium transition-colors">
              Sign Up here
            </Link>
          </div>

          {isLocalMode && (
            <div className="mt-4 p-2.5 rounded-xl bg-[#C9A66B]/10 border border-[#C9A66B]/20 text-center">
              <p className="text-[10px] text-[#DFBE86]">
                Preview Mode: Enter any email and password (4+ chars) to sign in.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-8 border-t border-[#C9A66B]/15 text-center">
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#89847C]">
          NOIR CHD • SECURE GUEST SIGN IN
        </p>
      </footer>
    </div>
  );
};
