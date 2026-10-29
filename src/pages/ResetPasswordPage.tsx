import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CrescentMoon } from '../components/CrescentMoon';
import { FilmGrain } from '../components/FilmGrain';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { updateUserPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify carefully.');
      return;
    }

    setLoading(true);
    try {
      const res = await updateUserPassword(password);
      if (!res.success) {
        setError(res.error || 'Failed to update password.');
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/account', { replace: true });
        }, 2500);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F4EFE5] selection:bg-[#C9A66B]/30 selection:text-[#F4EFE5] overflow-x-hidden flex flex-col justify-between py-10 px-4 sm:px-8">
      <FilmGrain />

      {/* Header */}
      <header className="relative z-20 max-w-4xl mx-auto w-full flex items-center justify-between pb-8 border-b border-[#C9A66B]/15">
        <Link
          to="/signin"
          className="group flex items-center gap-2 text-xs font-sans tracking-[0.3em] uppercase text-[#89847C] hover:text-[#C9A66B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Sign In</span>
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
              NEW PASSWORD
            </h1>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent my-3" />
            <p className="font-sans text-[11px] tracking-[0.25em] text-[#89847C] uppercase">
              Set New Account Credentials
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-4 py-3 animate-in fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-editorial text-2xl text-[#F4EFE5]">
                Password Updated
              </h2>
              <p className="text-xs text-[#89847C]">
                Your new password has been verified. Redirecting to your account portal...
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 flex items-start gap-2.5 text-xs leading-relaxed animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="new_password"
                    className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-1.5"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new_password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300"
                    />
                    <Lock className="w-4 h-4 text-[#89847C] absolute left-4 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="p-1 text-[#89847C] hover:text-[#C9A66B] absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm_new_password"
                    className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-1.5"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm_new_password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Retype new password"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300"
                    />
                    <Lock className="w-4 h-4 text-[#89847C] absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3.5 rounded-xl border border-[#C9A66B]/60 bg-gradient-to-r from-[#DFBE86] via-[#C9A66B] to-[#A8874F] text-[#050505] font-sans text-xs uppercase tracking-[0.3em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(201,166,107,0.2)] hover:opacity-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#050505]" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#050505]" />
                      <span>Save New Password</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-8 border-t border-[#C9A66B]/15 text-center">
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#89847C]">
          NOIR CHD • CREDENTIAL UPDATE
        </p>
      </footer>
    </div>
  );
};
