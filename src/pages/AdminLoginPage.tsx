import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, AlertCircle, ArrowLeft, Loader2, Shield } from 'lucide-react';
import { CrescentMoon } from '../components/CrescentMoon';
import { FilmGrain } from '../components/FilmGrain';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn, user, isAdmin, isLoading: authLoading, isLocalMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated and admin, redirect to /admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (!result.success) {
        setError(result.error || 'Failed to authenticate administrator.');
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unexpected login error.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F4EFE5] selection:bg-[#C9A66B]/30 selection:text-[#F4EFE5] overflow-x-hidden flex flex-col justify-between py-10 px-4 sm:px-8">
      <FilmGrain />

      {/* Top Header */}
      <header className="relative z-20 max-w-4xl mx-auto w-full flex items-center justify-between pb-8 border-b border-[#C9A66B]/15">
        <Link
          to="/"
          className="group flex items-center gap-2 text-xs font-sans tracking-[0.3em] uppercase text-[#89847C] hover:text-[#C9A66B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Public Portal</span>
        </Link>

        <Link to="/" className="flex items-baseline gap-1.5 focus:outline-none">
          <span className="font-editorial text-xl font-light tracking-[0.25em] text-[#F4EFE5]">
            NOIR
          </span>
          <span className="font-sans text-[9px] font-normal tracking-[0.4em] text-[#C9A66B]/80">
            CHD
          </span>
        </Link>
      </header>

      {/* Center Card */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto">
        <div className="bg-[#0E0E0E]/95 border border-[#C9A66B]/30 rounded-2xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-md">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-2">
              <CrescentMoon size={60} glowIntensity={0.8} />
            </div>
            <h1 className="font-editorial text-2xl font-light tracking-[0.2em] text-[#F4EFE5] uppercase">
              ADMINISTRATIVE ACCESS
            </h1>
            <div className="w-10 h-[1px] bg-[#C9A66B]/40 my-3" />
            <p className="font-sans text-[11px] tracking-[0.25em] text-[#89847C] uppercase">
              Authorized Personnel Only
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 flex items-start gap-2.5 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin_email"
                className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-2"
              >
                Administrator Email
              </label>
              <div className="relative">
                <input
                  id="admin_email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@noirchd.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/50 text-sm transition-all duration-200"
                />
                <Mail className="w-4 h-4 text-[#89847C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin_password"
                className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-2"
              >
                Security Key / Password
              </label>
              <div className="relative">
                <input
                  id="admin_password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/50 text-sm transition-all duration-200"
                />
                <Lock className="w-4 h-4 text-[#89847C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 rounded-lg border border-[#C9A66B]/60 bg-[#C9A66B] hover:bg-[#DFBE86] text-[#050505] font-sans text-xs uppercase tracking-[0.3em] font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(201,166,107,0.2)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#050505]" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-[#050505]" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#C9A66B]/15 text-center space-y-2">
            {isLocalMode && (
              <div className="p-2.5 rounded-lg bg-[#C9A66B]/10 border border-[#C9A66B]/30 text-left text-[11px] text-[#DFBE86] space-y-1">
                <span className="font-semibold block text-[#C9A66B]">✨ Local Preview Mode Active</span>
                <p className="text-[10px] text-[#89847C] leading-snug">
                  You can sign in with any email (e.g. <strong className="text-[#F4EFE5]">admin@noirchd.com</strong>) &amp; any password to view your registrations immediately.
                </p>
              </div>
            )}
            <p className="text-[11px] text-[#89847C]/80 leading-relaxed">
              Access is restricted to authorized NOIR CHD administrators. Unauthorized attempts are monitored.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-8 border-t border-[#C9A66B]/15 text-center">
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#89847C]">
          SECURE PROTOCOL • SUPABASE AUTHENTICATION
        </p>
      </footer>
    </div>
  );
};
