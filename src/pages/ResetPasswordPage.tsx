import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { BackButton } from '../components/BackButton';
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
      <main className="relative z-10 max-w-md mx-auto w-full my-auto">
        <div className="bg-[#17191E] border border-[#343A43] hover:border-[#7B8999] rounded-3xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-xl transition-colors">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-2">
              <CrescentMoon size={60} glowIntensity={0.8} />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-[0.15em] text-[#F2F0EB] uppercase">
              NEW PASSWORD
            </h1>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C6CDD5] to-transparent my-3" />
            <p className="font-display text-[11px] tracking-[0.25em] text-[#7B8999] uppercase">
              Set New Account Credentials
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-4 py-3 animate-in fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-display text-2xl text-[#F2F0EB] font-bold">
                Password Updated
              </h2>
              <p className="text-xs text-[#7B8999]">
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
                {/* New Password */}
                <div>
                  <label
                    htmlFor="reset_password"
                    className="block font-display text-[11px] uppercase tracking-[0.22em] text-[#C6CDD5] mb-1.5 font-semibold"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="reset_password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
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

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="reset_confirm_password"
                    className="block font-display text-[11px] uppercase tracking-[0.22em] text-[#C6CDD5] mb-1.5 font-semibold"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="reset_confirm_password"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Retype your new password"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#08090B] border border-[#343A43] focus:border-[#C6CDD5] outline-none text-[#F2F0EB] placeholder-[#7B8999]/50 text-sm transition-all duration-300 disabled:opacity-50"
                    />
                    <Lock className="w-4 h-4 text-[#7B8999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-[#C6CDD5] via-[#E2E6EA] to-[#C6CDD5] hover:brightness-110 text-[#08090B] font-display text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(198,205,213,0.3)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#08090B]" />
                      <span>Updating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#08090B]" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-8 border-t border-[#343A43] text-center">
        <p className="font-display text-[10px] tracking-[0.3em] uppercase text-[#7B8999]">
          OBSIDIAN • CREDENTIAL SECURITY • CHANDIGARH, INDIA
        </p>
      </footer>
    </div>
  );
};
