import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Gender } from '../types/registration';
import {
  User,
  Mail,
  Instagram,
  LogOut,
  Shield,
  Sparkles,
  Phone,
  Pencil,
  X,
  Loader2,
  AlertCircle,
  Calendar,
  Lock,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { FilmGrain } from '../components/FilmGrain';

export const AccountPage: React.FC = () => {
  const { user, profile, isAdmin, signOut, isLoading, updateProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Edit Profile States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editGender, setEditGender] = useState<Gender | string>('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/signin', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Populate edit fields when opening edit modal
  const openEditModal = () => {
    const meta = (user as { user_metadata?: Record<string, string> })?.user_metadata || {};
    setEditName(
      profile?.full_name ||
        meta.full_name ||
        user?.email?.split('@')[0] ||
        ''
    );
    setEditPhone(profile?.phone || meta.phone || '');
    setEditInstagram(profile?.instagram_handle || meta.instagram_handle || '');
    setEditGender(profile?.gender || meta.gender || '');
    setProfileError(null);
    setProfileSuccess(null);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!editName.trim() || editName.trim().length < 2) {
      setProfileError('Full name must be at least 2 characters.');
      return;
    }

    setSavingProfile(true);
    try {
      await updateProfile({
        full_name: editName.trim(),
        phone: editPhone.trim() || null,
        instagram_handle: editInstagram.trim() || null,
        gender: editGender || null,
      });

      // Refresh to ensure full synchronization across components
      await refreshProfile();

      setProfileSuccess('Profile updated successfully.');
      setTimeout(() => {
        setIsEditingProfile(false);
        setProfileSuccess(null);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      setProfileError(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#08090B] flex items-center justify-center text-[#F2F0EB]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-[#C6CDD5] animate-spin" />
          <span className="text-xs font-display tracking-[0.25em] uppercase text-[#7B8999]">
            Loading Profile...
          </span>
        </div>
      </div>
    );
  }

  const displayName =
    profile?.full_name ||
    (user as { user_metadata?: { full_name?: string } })?.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Member';

  const memberSinceFormatted = (() => {
    const rawDate = profile?.created_at || (user as { created_at?: string })?.created_at;
    if (!rawDate) return 'Active Member';
    try {
      return new Date(rawDate).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Active Member';
    }
  })();

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('') || 'N';

  return (
    <div className="relative min-h-screen bg-[#08090B] text-[#F2F0EB] selection:bg-[#C6CDD5]/30 selection:text-[#FFFFFF] overflow-x-hidden flex flex-col justify-between py-10 px-4 sm:px-8">
      <FilmGrain />

      {/* Ambient glow */}
      <div className="pointer-events-none fixed -top-40 right-1/4 w-[500px] h-[500px] bg-[#7B8999]/10 blur-[150px] rounded-full -z-10" />
      <div className="pointer-events-none fixed -bottom-40 left-1/4 w-[500px] h-[500px] bg-[#C6CDD5]/10 blur-[160px] rounded-full -z-10" />

      {/* Top Header */}
      <header className="relative z-20 max-w-4xl mx-auto w-full flex items-center justify-between pb-8 border-b border-[#343A43]">
        <BackButton fallbackUrl="/" fallbackLabel="Previous Page" />

        <Link to="/" className="flex items-baseline gap-2 focus:outline-none group">
          <span className="font-display text-2xl font-bold tracking-[0.25em] text-[#F2F0EB] group-hover:text-[#C6CDD5] transition-colors">
            NOIR
          </span>
          <span className="font-display text-[10px] font-bold tracking-[0.45em] text-[#C6CDD5]">
            EVENTS
          </span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-3xl mx-auto w-full my-8 space-y-6">
        {/* Profile Hero Card */}
        <div className="bg-[#17191E] border border-[#343A43] hover:border-[#7B8999] rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 transition-all duration-300">
          <div className="flex items-center gap-4 sm:gap-6 text-center sm:text-left flex-col sm:flex-row">
            {/* Avatar / Initials */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#17191E] to-[#08090B] border-2 border-[#7B8999]/50 flex items-center justify-center text-[#C6CDD5] shadow-[0_0_25px_rgba(198,205,213,0.2)] shrink-0">
              <span className="font-display text-2xl font-black tracking-wider">
                {initials}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="font-display text-2xl sm:text-3xl text-[#F2F0EB] font-bold tracking-tight">
                  {displayName}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#17191E] text-[#C6CDD5] border border-[#343A43] shadow-[0_0_10px_rgba(198,205,213,0.15)]">
                  <Sparkles className="w-3 h-3 text-[#C6CDD5]" />
                  Verified Member
                </span>
                {isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold bg-[#C6CDD5] text-[#08090B]">
                    Admin
                  </span>
                )}
              </div>

              <p className="font-sans text-xs text-[#7B8999] flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C6CDD5]" />
                <span>{user.email}</span>
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5 text-xs text-[#7B8999]">
                <Calendar className="w-3.5 h-3.5 text-[#7B8999]" />
                <span className="font-sans text-[11px] uppercase tracking-wider">
                  Member Since {memberSinceFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={openEditModal}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#343A43] hover:border-[#C6CDD5] text-[#C6CDD5] text-xs uppercase tracking-wider font-semibold bg-[#08090B] hover:bg-[#17191E] transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-500/40 hover:border-red-500 text-red-300 text-xs uppercase tracking-wider font-semibold bg-[#08090B] hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Profile Information Details Card */}
        <section className="bg-[#17191E] border border-[#343A43] rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#343A43] mb-6">
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-[#C6CDD5]" />
              <h2 className="font-display text-lg sm:text-xl text-[#F2F0EB] font-bold tracking-wider uppercase">
                Account Details
              </h2>
            </div>
            <button
              onClick={openEditModal}
              className="text-xs text-[#C6CDD5] hover:text-[#FFFFFF] flex items-center gap-1 uppercase tracking-wider transition-colors font-semibold"
            >
              <Pencil className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            {/* Full Legal Name */}
            <div className="p-4 rounded-2xl bg-[#08090B] border border-[#343A43] space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#7B8999] block font-display">
                Full Name
              </span>
              <p className="text-[#F2F0EB] font-semibold text-base">
                {displayName}
              </p>
            </div>

            {/* Email Address */}
            <div className="p-4 rounded-2xl bg-[#08090B] border border-[#343A43] space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#7B8999] block font-display">
                Email Address
              </span>
              <p className="text-[#F2F0EB] font-semibold text-base truncate flex items-center justify-between">
                <span>{user.email}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#C6CDD5] bg-[#17191E] px-2 py-0.5 rounded-full border border-[#343A43]">
                  Active
                </span>
              </p>
            </div>

            {/* Phone */}
            <div className="p-4 rounded-2xl bg-[#08090B] border border-[#343A43] space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#7B8999] flex items-center gap-1.5 font-display">
                <Phone className="w-3 h-3 text-[#C6CDD5]" />
                Contact Phone
              </span>
              <p className="text-base">
                {profile?.phone ? (
                  <span className="text-[#F2F0EB] font-semibold">{profile.phone}</span>
                ) : (
                  <span className="text-[#7B8999] italic text-xs">Not provided</span>
                )}
              </p>
            </div>

            {/* Instagram */}
            <div className="p-4 rounded-2xl bg-[#08090B] border border-[#343A43] space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#7B8999] flex items-center gap-1.5 font-display">
                <Instagram className="w-3 h-3 text-[#C6CDD5]" />
                Instagram Handle
              </span>
              <p className="text-base">
                {profile?.instagram_handle ? (
                  <span className="text-[#C6CDD5] font-semibold">{profile.instagram_handle}</span>
                ) : (
                  <span className="text-[#7B8999] italic text-xs">Not provided</span>
                )}
              </p>
            </div>

            {/* Gender Identity */}
            <div className="p-4 rounded-2xl bg-[#08090B] border border-[#343A43] space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#7B8999] block font-display">
                Gender Identity
              </span>
              <p className="text-base">
                {profile?.gender ? (
                  <span className="text-[#C6CDD5] font-semibold">{profile.gender}</span>
                ) : (
                  <span className="text-[#7B8999] italic text-xs">Not specified</span>
                )}
              </p>
            </div>

            {/* Membership Registration Date */}
            <div className="p-4 rounded-2xl bg-[#08090B] border border-[#343A43] space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#7B8999] block font-display">
                Member Status
              </span>
              <p className="text-base text-[#F2F0EB] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C6CDD5]" />
                <span>Active Account ({memberSinceFormatted})</span>
              </p>
            </div>
          </div>
        </section>

        {/* Account Security Card */}
        <section className="bg-[#17191E] border border-[#343A43] rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#343A43] mb-5">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#C6CDD5]" />
              <h2 className="font-display text-lg sm:text-xl text-[#F2F0EB] font-bold tracking-wider uppercase">
                Security &amp; Password
              </h2>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[#7B8999] font-mono">
              256-Bit TLS Security
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#08090B] border border-[#343A43]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C6CDD5]" />
                <span className="text-sm text-[#F2F0EB] font-semibold">Account Password</span>
              </div>
              <p className="text-xs text-[#7B8999]">
                Manage your credentials or request a password reset email if you wish to change your password.
              </p>
            </div>

            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#343A43] hover:border-[#C6CDD5] text-[#C6CDD5] text-xs uppercase tracking-wider font-semibold hover:bg-[#17191E] transition-all shrink-0"
            >
              <span>Reset Password</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-[11px] text-[#7B8999] mt-4 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#C6CDD5]" />
            <span>Automated 30-minute inactivity security timeout is active on this session.</span>
          </p>
        </section>

        {/* Administrator Quick Access */}
        {isAdmin && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#17191E] via-[#08090B] to-[#17191E] border border-[#343A43] hover:border-[#7B8999] flex flex-col sm:flex-row items-center justify-between gap-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-colors">
            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
              <div className="w-12 h-12 rounded-2xl bg-[#08090B] border border-[#343A43] flex items-center justify-center text-[#C6CDD5] shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <strong className="text-base text-[#F2F0EB] font-bold block font-display">
                  Administrator Privileges Active
                </strong>
                <span className="text-xs text-[#7B8999]">
                  You have steward console access to manage attendees, review verification logs, and manage events.
                </span>
              </div>
            </div>
            <Link
              to="/admin"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C6CDD5] via-[#E2E6EA] to-[#C6CDD5] text-[#08090B] text-xs font-display uppercase tracking-[0.2em] font-bold hover:brightness-110 transition-all shrink-0 shadow-[0_0_20px_rgba(198,205,213,0.3)]"
            >
              Open Dashboard
            </Link>
          </div>
        )}
      </main>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090B]/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative max-w-md w-full bg-[#17191E] border border-[#343A43] rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between pb-4 border-b border-[#343A43] mb-5">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-[#C6CDD5]" />
                <h3 className="font-display text-lg uppercase tracking-wider text-[#F2F0EB] font-bold">
                  Edit Member Profile
                </h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-[#7B8999] hover:text-[#F2F0EB] transition-colors p-1"
                aria-label="Close edit profile modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            {profileSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block font-display text-[11px] uppercase tracking-[0.25em] text-[#C6CDD5] mb-1.5 font-semibold">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={savingProfile}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#08090B] border border-[#343A43] focus:border-[#C6CDD5] outline-none text-[#F2F0EB] text-sm focus:ring-1 focus:ring-[#C6CDD5]/50"
                />
              </div>

              <div>
                <label className="block font-display text-[11px] uppercase tracking-[0.25em] text-[#C6CDD5] mb-1.5 font-semibold">
                  Contact Number
                </label>
                <input
                  type="tel"
                  disabled={savingProfile}
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl bg-[#08090B] border border-[#343A43] focus:border-[#C6CDD5] outline-none text-[#F2F0EB] text-sm focus:ring-1 focus:ring-[#C6CDD5]/50"
                />
              </div>

              <div>
                <label className="block font-display text-[11px] uppercase tracking-[0.25em] text-[#C6CDD5] mb-1.5 font-semibold">
                  Instagram Profile
                </label>
                <input
                  type="text"
                  disabled={savingProfile}
                  value={editInstagram}
                  onChange={(e) => setEditInstagram(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full px-4 py-3 rounded-xl bg-[#08090B] border border-[#343A43] focus:border-[#C6CDD5] outline-none text-[#F2F0EB] text-sm focus:ring-1 focus:ring-[#C6CDD5]/50"
                />
              </div>

              <div>
                <label className="block font-display text-[11px] uppercase tracking-[0.25em] text-[#C6CDD5] mb-1.5 font-semibold">
                  Gender Identity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Male', 'Female', 'Non-Binary', 'Prefer not to say'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      disabled={savingProfile}
                      onClick={() => setEditGender(editGender === g ? '' : g)}
                      className={`py-2 px-2 rounded-xl text-xs font-sans uppercase tracking-wider border transition-all ${
                        editGender === g
                          ? 'bg-[#C6CDD5] text-[#08090B] border-[#C6CDD5] font-bold shadow-[0_0_15px_rgba(198,205,213,0.3)]'
                          : 'bg-[#08090B] text-[#7B8999] border-[#343A43] hover:border-[#7B8999]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#C6CDD5] via-[#E2E6EA] to-[#C6CDD5] text-[#08090B] font-display text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(198,205,213,0.3)] hover:brightness-110 transition-all"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
                <button
                  type="button"
                  disabled={savingProfile}
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-3 rounded-xl border border-[#343A43] text-[#7B8999] hover:text-[#F2F0EB] text-xs uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl mx-auto w-full pt-8 border-t border-[#343A43] text-center">
        <p className="font-display text-[10px] tracking-[0.3em] uppercase text-[#7B8999]">
          OBSIDIAN • PRIVATE MEMBER PORTAL • CHANDIGARH
        </p>
      </footer>
    </div>
  );
};
