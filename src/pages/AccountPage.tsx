import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserRegistrations } from '../services/registrationService';
import { Registration } from '../types/registration';
import {
  User,
  Mail,
  Instagram,
  Ticket,
  LogOut,
  ArrowLeft,
  Shield,
  Sparkles,
  Clock,
  CheckCircle2,
  UserCheck,
  XCircle,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { FilmGrain } from '../components/FilmGrain';

export const AccountPage: React.FC = () => {
  const { user, profile, isAdmin, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/signin', { replace: true });
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const loadUserRegistrations = async () => {
      if (user?.email) {
        setLoadingRegs(true);
        try {
          const list = await fetchUserRegistrations(user.email);
          setRegistrations(list);
        } catch (err) {
          console.warn('Failed to load user registrations:', err);
        } finally {
          setLoadingRegs(false);
        }
      }
    };

    loadUserRegistrations();
  }, [user]);

  const handleCopy = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setCopiedId(refId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'registered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3" /> Registered
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'attended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium bg-sky-500/10 text-sky-300 border border-sky-500/30">
            <UserCheck className="w-3 h-3" /> Attended
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#F4EFE5]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-[#C9A66B] animate-spin" />
          <span className="text-xs font-sans tracking-widest uppercase text-[#89847C]">
            Loading Profile...
          </span>
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name || (user as { user_metadata?: { full_name?: string } })?.user_metadata?.full_name || user.email?.split('@')[0] || 'NOIR Guest';

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

      {/* Main Container */}
      <main className="relative z-10 max-w-3xl mx-auto w-full my-8 space-y-8">
        {/* Profile Header Card */}
        <div className="bg-[#0E0E0E]/95 border border-[#C9A66B]/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-16 h-16 rounded-full bg-[#C9A66B]/15 border border-[#C9A66B]/40 flex items-center justify-center text-[#C9A66B] shadow-[0_0_20px_rgba(201,166,107,0.2)] shrink-0">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-editorial text-2xl sm:text-3xl text-[#F4EFE5] font-light">
                  {displayName}
                </h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold bg-[#C9A66B] text-[#050505]">
                    Admin
                  </span>
                )}
              </div>
              <p className="font-sans text-xs text-[#89847C] mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C9A66B]" />
                <span>{user.email}</span>
              </p>
              {profile?.instagram_handle && (
                <p className="font-sans text-xs text-[#C9A66B] mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                  <Instagram className="w-3.5 h-3.5" />
                  <span>{profile.instagram_handle}</span>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 hover:border-red-500 text-red-300 text-xs uppercase tracking-wider font-medium bg-[#050505] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Admin Quick Access (If Authorized) */}
        {isAdmin && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#C9A66B]/10 border border-[#C9A66B]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#C9A66B] shrink-0" />
              <div>
                <strong className="text-sm text-[#F4EFE5] font-medium block">
                  Administrator Privileges Active
                </strong>
                <span className="text-xs text-[#89847C]">
                  You have authorized steward access to view all guest registrations and manage entry lists.
                </span>
              </div>
            </div>
            <Link
              to="/admin"
              className="px-5 py-2.5 rounded-xl bg-[#C9A66B] text-[#050505] text-xs font-sans uppercase tracking-[0.2em] font-semibold hover:bg-[#DFBE86] transition-colors shrink-0"
            >
              Open Dashboard
            </Link>
          </div>
        )}

        {/* My Registrations Section */}
        <section className="bg-[#0E0E0E]/95 border border-[#C9A66B]/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#C9A66B]/20 mb-6">
            <div className="flex items-center gap-2.5">
              <Ticket className="w-5 h-5 text-[#C9A66B]" />
              <h2 className="font-editorial text-xl sm:text-2xl text-[#F4EFE5] tracking-wider uppercase">
                My Event Registrations
              </h2>
            </div>
            <Link
              to="/register"
              className="px-3.5 py-1.5 rounded-full border border-[#C9A66B]/40 hover:border-[#C9A66B] text-[#C9A66B] text-[11px] uppercase tracking-wider transition-colors"
            >
              + New Guest Pass
            </Link>
          </div>

          {loadingRegs ? (
            <div className="py-12 text-center text-[#89847C]">
              <RefreshCw className="w-5 h-5 text-[#C9A66B] animate-spin mx-auto mb-2" />
              <span className="text-xs font-sans uppercase tracking-wider">Loading your passes...</span>
            </div>
          ) : registrations.length === 0 ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#C9A66B]/10 border border-[#C9A66B]/20 flex items-center justify-center text-[#C9A66B]">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-sm text-[#F4EFE5] font-light">No reservations registered yet</p>
              <p className="text-xs text-[#89847C] max-w-sm mx-auto">
                Join our private guest list for the upcoming showcase to receive exclusive entry pass accreditation.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#DFBE86] via-[#C9A66B] to-[#A8874F] text-[#050505] text-xs font-sans uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-4 h-4 text-[#050505]" />
                <span>Register for Guest Pass</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-[#050505] border border-[#C9A66B]/25 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base sm:text-lg font-medium text-[#C9A66B]">
                        {reg.reference_id}
                      </span>
                      {getStatusBadge(reg.registration_status)}
                    </div>
                    <p className="text-xs text-[#F4EFE5] font-medium">{reg.full_name}</p>
                    <p className="text-[11px] text-[#89847C]">
                      Registered on {new Date(reg.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleCopy(reg.reference_id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C9A66B]/15 hover:bg-[#C9A66B]/30 text-[#C9A66B] text-xs transition-colors border border-[#C9A66B]/30"
                    >
                      {copiedId === reg.reference_id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-green-400 font-sans text-[10px] tracking-wider">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="font-sans text-[10px] tracking-wider">COPY ID</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-8 border-t border-[#C9A66B]/15 text-center">
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#89847C]">
          NOIR CHD • GUEST RECEPTION & PASS PORTAL
        </p>
      </footer>
    </div>
  );
};
