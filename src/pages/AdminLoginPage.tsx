import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Clock } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { CrescentMoon } from '../components/CrescentMoon';
import { FilmGrain } from '../components/FilmGrain';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signInWithPassword, user, isAdmin, isLoading: authLoading, isLocalMode, sessionExpired, clearSessionExpiredBanner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already an admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please provide your administrator email.');
      return;
    }

    if (!password) {
      setError('Please provide your security credentials.');
      return;
    }

    setLoading(true);
    try {
      const res = await signInWithPassword(cleanEmail, password, rememberMe, 'admin');
      if (!res.success) {
        setError(res.error || 'Access denied. You must be an authorized administrator.');
      } else {
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during authentication.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#08090B] text-[#F2F0EB] selection:bg-[#C6CDD5]/30 selection:text-[#FFFFFF] overflow-x-hidden flex flex-col justify-between py-10 px-4 sm:px-8">
      <FilmGrain />

      {/* Top Header */}
      <header className="relative z-20 max-w-4xl mx-auto w-full flex items-center justify-between pb-8 border-b border-[#343A43]">
        <BackButton fallbackUrl="/" fallbackLabel="Previous Page" />

        <Link to="/" className="flex items-baseline gap-1.5 focus:outline-none">
          <span className="font-display text-2xl font-bold tracking-[0.18em] text-[#F2F0EB]">
            NOIR
          </span>
          <span className="font-display text-[10px] font-bold tracking-[0.4em] text-[#C6CDD5]">
            EVENTS
          </span>
        </Link>
      </header>

      {/* Center Card */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto">
        {/* Session Inactivity Timeout Notice */}
        {sessionExpired && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex items-start gap-3 text-xs leading-relaxed animate-in fade-in">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-display">
              <strong className="block font-bold text-amber-300 mb-0.5">Session Timed Out</strong>
              Your administrative session expired after 30 minutes of inactivity. Please re-authenticate below.
            </div>
            <button
              onClick={clearSessionExpiredBanner}
              className="text-amber-400 hover:text-amber-200 text-xs uppercase"
            >
              ✕
            </button>
          </div>
        )}

        <div className="bg-[#17191E] border border-[#343A43] hover:border-[#7B8999] rounded-3xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-xl transition-colors">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-2">
              <CrescentMoon size={60} glowIntensity={0.8} />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-[0.12em] text-[#F2F0EB] uppercase">
              ADMINISTRATIVE ACCESS
            </h1>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C6CDD5] to-transparent my-3" />
            <p className="font-display text-[11px] tracking-[0.25em] text-[#7B8999] uppercase">
              Authorized Personnel Portal
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
            <div>
              <label
                htmlFor="admin_email"
                className="block font-display text-[11px] uppercase tracking-[0.22em] text-[#C6CDD5] mb-1.5 font-semibold"
              >
                Administrator Email
              </label>
              <div className="relative">
                <input
                  id="admin_email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@noirevents.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#08090B] border border-[#343A43] focus:border-[#C6CDD5] outline-none text-[#F2F0EB] placeholder-[#7B8999]/50 text-sm transition-all duration-300 disabled:opacity-50"
                />
                <Mail className="w-4 h-4 text-[#7B8999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin_password"
                className="block font-display text-[11px] uppercase tracking-[0.22em] text-[#C6CDD5] mb-1.5 font-semibold"
              >
                Security Key / Password
              </label>
              <div className="relative">
                <input
                  id="admin_password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#08090B] border border-[#343A43] focus:border-[#C6CDD5] outline-none text-[#F2F0EB] placeholder-[#7B8999]/50 text-sm transition-all duration-300 disabled:opacity-50"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label htmlFor="adminRememberMe" className="flex items-center gap-2.5 cursor-pointer select-none text-[#7B8999]">
                <input
                  id="adminRememberMe"
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
              className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-[#C6CDD5] via-[#E2E6EA] to-[#C6CDD5] hover:brightness-110 text-[#08090B] font-display text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(198,205,213,0.3)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#08090B]" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-[#08090B]" />
                  <span>Authenticate &amp; Enter Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Local Mode Diagnostic Hint */}
          <div className="mt-8 pt-6 border-t border-[#343A43] text-center space-y-2">
            {isLocalMode && (
              <div className="p-3 rounded-xl bg-[#08090B] border border-[#343A43] text-left text-[11px] text-[#C6CDD5] space-y-1 font-display">
                <span className="font-bold block text-[#C6CDD5]">✨ Local Preview Mode Active</span>
                <p className="text-[10px] text-[#7B8999] leading-snug">
                  Sign in with any email (e.g. <strong className="text-[#F2F0EB]">admin@noirevents.com</strong>) and password (e.g. <strong className="text-[#F2F0EB]">noir2026</strong>) to test administrative access immediately.
                </p>
              </div>
            )}
            <p className="text-[11px] text-[#7B8999] leading-relaxed font-sans">
              Administrative access is monitored and restricted strictly to verified directory stewards.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-8 border-t border-[#343A43] text-center">
        <p className="font-display text-[10px] tracking-[0.3em] uppercase text-[#7B8999]">
          OBSIDIAN • SECURE PROTOCOL • ENCRYPTED AUTHENTICATION • CHANDIGARH, INDIA
        </p>
      </footer>
    </div>
  );
};
