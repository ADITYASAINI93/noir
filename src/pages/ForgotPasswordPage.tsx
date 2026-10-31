import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, AlertCircle, Loader2, CheckCircle2, KeyRound } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { CrescentMoon } from '../components/CrescentMoon';
import { FilmGrain } from '../components/FilmGrain';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { resetPasswordForEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordForEmail(cleanEmail);
      if (!res.success) {
        setError(res.error || 'Failed to request password recovery.');
      } else {
        setSubmitted(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error processing request.';
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
              PASSWORD RECOVERY
            </h1>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C6CDD5] to-transparent my-3" />
            <p className="font-display text-[11px] tracking-[0.25em] text-[#7B8999] uppercase">
              Reset Your Credentials
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-5 py-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#17191E] border border-[#343A43] flex items-center justify-center text-[#C6CDD5] shadow-[0_0_20px_rgba(198,205,213,0.2)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-display text-2xl text-[#F2F0EB] font-bold tracking-wide">
                Recovery Link Dispatched
              </h2>
              <p className="text-xs text-[#7B8999] leading-relaxed">
                If an account exists for <strong className="text-[#F2F0EB]">{email}</strong>, you will receive password reset instructions.
              </p>
              <div className="p-3.5 rounded-xl bg-[#08090B] border border-[#343A43] text-[11px] text-[#7B8999] text-left leading-relaxed">
                <span className="text-[#C6CDD5] font-semibold block mb-1">Notice on Email Delivery:</span>
                Password reset emails require an active SMTP mail provider configured in your Supabase project settings under <strong>Authentication &gt; Email</strong>.
              </div>
              <Link
                to="/signin"
                className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C6CDD5] via-[#E2E6EA] to-[#C6CDD5] text-[#08090B] text-xs font-display uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(198,205,213,0.3)] hover:brightness-110"
              >
                Return to Sign In
              </Link>
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
                    htmlFor="recovery_email"
                    className="block font-display text-[11px] uppercase tracking-[0.22em] text-[#C6CDD5] mb-1.5 font-semibold"
                  >
                    Account Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="recovery_email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={loading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#08090B] border border-[#343A43] focus:border-[#C6CDD5] outline-none text-[#F2F0EB] placeholder-[#7B8999]/50 text-sm transition-all duration-300 disabled:opacity-50"
                    />
                    <Mail className="w-4 h-4 text-[#7B8999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                      <span>Transmitting Link...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 text-[#08090B]" />
                      <span>Send Recovery Instructions</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#343A43] text-center text-xs text-[#7B8999]">
                <span>Remembered your password? </span>
                <Link to="/signin" className="text-[#C6CDD5] hover:text-[#FFFFFF] font-display font-semibold transition-colors">
                  Sign In here
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-8 border-t border-[#343A43] text-center">
        <p className="font-display text-[10px] tracking-[0.3em] uppercase text-[#7B8999]">
          OBSIDIAN • ACCOUNT RECOVERY • CHANDIGARH, INDIA
        </p>
      </footer>
    </div>
  );
};
