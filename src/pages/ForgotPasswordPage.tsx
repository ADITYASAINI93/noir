import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, AlertCircle, ArrowLeft, Loader2, CheckCircle2, KeyRound } from 'lucide-react';
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
    <div className="relative min-h-screen bg-[#050505] text-[#F4EFE5] selection:bg-[#C9A66B]/30 selection:text-[#F4EFE5] overflow-x-hidden flex flex-col justify-between py-10 px-4 sm:px-8">
      <FilmGrain />

      {/* Header */}
      <header className="relative z-20 max-w-4xl mx-auto w-full flex items-center justify-between pb-8 border-b border-[#C9A66B]/15">
        <Link
          to="/signin"
          className="group flex items-center gap-2 text-xs font-sans tracking-[0.3em] uppercase text-[#89847C] hover:text-[#C9A66B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Sign In</span>
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
              PASSWORD RECOVERY
            </h1>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent my-3" />
            <p className="font-sans text-[11px] tracking-[0.25em] text-[#89847C] uppercase">
              Reset Your Credentials
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-5 py-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#C9A66B]/15 border border-[#C9A66B]/40 flex items-center justify-center text-[#C9A66B]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-editorial text-2xl text-[#F4EFE5] tracking-wide">
                Recovery Link Dispatched
              </h2>
              <p className="text-xs text-[#89847C] leading-relaxed">
                If an account exists for <strong className="text-[#F4EFE5]">{email}</strong>, you will receive password reset instructions.
              </p>
              <div className="p-3.5 rounded-xl bg-[#050505] border border-[#C9A66B]/20 text-[11px] text-[#89847C] text-left leading-relaxed">
                <span className="text-[#C9A66B] font-semibold block mb-1">Notice on Email Delivery:</span>
                Password reset emails require an active SMTP mail provider configured in your Supabase project settings under <strong>Authentication &gt; Email</strong>.
              </div>
              <Link
                to="/signin"
                className="inline-block px-6 py-2.5 rounded-xl bg-[#C9A66B] text-[#050505] text-xs uppercase tracking-wider font-semibold"
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
                    className="block font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A66B] mb-1.5"
                  >
                    Account Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="recovery_email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]/40 outline-none text-[#F4EFE5] placeholder-[#89847C]/40 text-sm transition-all duration-300"
                    />
                    <Mail className="w-4 h-4 text-[#89847C] absolute left-4 top-1/2 -translate-y-1/2" />
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
                      <span>Transmitting Link...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 text-[#050505]" />
                      <span>Send Recovery Instructions</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#C9A66B]/15 text-center text-xs text-[#89847C]">
                <span>Remembered your password? </span>
                <Link to="/signin" className="text-[#C9A66B] hover:text-[#DFBE86] font-medium transition-colors">
                  Sign In here
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-8 border-t border-[#C9A66B]/15 text-center">
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#89847C]">
          NOIR CHD • ACCOUNT RECOVERY
        </p>
      </footer>
    </div>
  );
};
