import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchDashboardStats,
  fetchRegistrations,
  fetchAllRegistrationsForExport,
  updateRegistrationStatus,
  downloadRegistrationsCSV,
} from '../services/registrationService';
import {
  Registration,
  RegistrationStatus,
  DashboardStats,
  RegistrationFilters,
} from '../types/registration';
import {
  Users,
  Calendar,
  CheckCircle,
  UserCheck,
  XCircle,
  Search,
  Download,
  RefreshCw,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertTriangle,
  X,
  FileSpreadsheet,
  Clock,
  Filter,
  Instagram,
  Database,
} from 'lucide-react';
import { FilmGrain } from '../components/FilmGrain';

export const AdminDashboardPage: React.FC = () => {
  const { user, signOut, isLocalMode } = useAuth();
  const navigate = useNavigate();

  // Stats state
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    today: 0,
    registered: 0,
    confirmed: 0,
    attended: 0,
    cancelled: 0,
  });

  // Table & filters state
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [filters, setFilters] = useState<RegistrationFilters>({
    searchQuery: '',
    status: 'all',
    sortBy: 'newest',
    page: 1,
    pageSize: 10,
  });

  // Loading and error states
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [exportingCSV, setExportingCSV] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals state
  const [selectedRecord, setSelectedRecord] = useState<Registration | null>(null);
  const [actionNotes, setActionNotes] = useState<string>('');
  const [actionStatus, setActionStatus] = useState<RegistrationStatus>('registered');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  // Destructive cancellation confirm modal
  const [recordToCancel, setRecordToCancel] = useState<Registration | null>(null);
  const [cancelling, setCancelling] = useState<boolean>(false);

  // Load KPI Stats
  const loadStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err: unknown) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Load Registrations Table
  const loadRegistrations = useCallback(async () => {
    try {
      setLoadingData(true);
      setErrorMsg(null);
      const res = await fetchRegistrations(filters);
      setRegistrations(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching registrations.';
      setErrorMsg(msg);
    } finally {
      setLoadingData(false);
    }
  }, [filters]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  // Handle Logout
  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  // CSV Export handler
  const handleExportCSV = async () => {
    try {
      setExportingCSV(true);
      const allRecords = await fetchAllRegistrationsForExport();
      downloadRegistrationsCSV(allRecords);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to export CSV.';
      alert(msg);
    } finally {
      setExportingCSV(false);
    }
  };

  // Detail Modal Open
  const openDetailModal = (reg: Registration) => {
    setSelectedRecord(reg);
    setActionStatus(reg.registration_status);
    setActionNotes(reg.notes || '');
  };

  // Save updated status & notes
  const handleSaveStatus = async () => {
    if (!selectedRecord) return;
    try {
      setUpdatingStatus(true);
      await updateRegistrationStatus(selectedRecord.id, actionStatus, actionNotes);
      setSelectedRecord(null);
      loadRegistrations();
      loadStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update record.';
      alert(msg);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Confirm and execute cancellation
  const handleConfirmCancel = async () => {
    if (!recordToCancel) return;
    try {
      setCancelling(true);
      await updateRegistrationStatus(recordToCancel.id, 'cancelled');
      setRecordToCancel(null);
      loadRegistrations();
      loadStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel registration.';
      alert(msg);
    } finally {
      setCancelling(false);
    }
  };

  // Status badge styling
  const getStatusBadge = (status: RegistrationStatus) => {
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
            <CheckCircle className="w-3 h-3" /> Confirmed
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
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F4EFE5] selection:bg-[#C9A66B]/30 selection:text-[#F4EFE5] overflow-x-hidden flex flex-col justify-between py-6 px-4 sm:px-8">
      <FilmGrain />

      {/* TOP HEADER */}
      <header className="relative z-20 max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#C9A66B]/20 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-1.5">
            <span className="font-editorial text-2xl font-light tracking-[0.25em] text-[#F4EFE5]">
              NOIR
            </span>
            <span className="font-sans text-[10px] font-normal tracking-[0.45em] text-[#C9A66B]">
              CHD
            </span>
          </div>
          <span className="hidden sm:inline-block w-[1px] h-5 bg-[#C9A66B]/30" />
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#89847C]">
            ADMINISTRATION DIRECTORY
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Database Mode Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E0E0E] border border-[#C9A66B]/25 text-[10px] tracking-wider uppercase">
            <Database className="w-3 h-3 text-[#C9A66B]" />
            <span className={isLocalMode ? 'text-amber-300' : 'text-emerald-300'}>
              {isLocalMode ? 'Active Local DB' : 'Supabase PostgreSQL'}
            </span>
          </div>

          <div className="text-right hidden md:block">
            <p className="text-xs text-[#F4EFE5] font-medium">{user?.email}</p>
            <p className="text-[10px] text-[#C9A66B] uppercase tracking-wider">Authorized Admin</p>
          </div>

          <button
            onClick={() => {
              loadStats();
              loadRegistrations();
            }}
            title="Refresh Data"
            className="p-2 rounded-xl bg-[#0E0E0E] border border-[#C9A66B]/25 hover:border-[#C9A66B] text-[#C9A66B] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0E0E0E] border border-red-500/30 hover:border-red-500 text-red-300 text-xs uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 max-w-7xl mx-auto w-full my-6 flex-1 space-y-6">
        {/* KPI OVERVIEW METRICS */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Total */}
          <div className="bg-[#0E0E0E]/90 border border-[#C9A66B]/20 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#89847C] mb-2">
              <span className="text-[11px] font-sans uppercase tracking-wider">Total Guests</span>
              <Users className="w-4 h-4 text-[#C9A66B]" />
            </div>
            <div className="text-2xl sm:text-3xl font-light tracking-wider text-[#F4EFE5]">
              {loadingStats ? '—' : stats.total}
            </div>
            <span className="text-[10px] text-[#89847C] tracking-wide mt-1 block">All registered guests</span>
          </div>

          {/* Today */}
          <div className="bg-[#0E0E0E]/90 border border-[#C9A66B]/20 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#89847C] mb-2">
              <span className="text-[11px] font-sans uppercase tracking-wider">Today</span>
              <Calendar className="w-4 h-4 text-[#C9A66B]" />
            </div>
            <div className="text-2xl sm:text-3xl font-light tracking-wider text-[#C9A66B]">
              {loadingStats ? '—' : stats.today}
            </div>
            <span className="text-[10px] text-[#89847C] tracking-wide mt-1 block">New registrations</span>
          </div>

          {/* Confirmed */}
          <div className="bg-[#0E0E0E]/90 border border-[#C9A66B]/20 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#89847C] mb-2">
              <span className="text-[11px] font-sans uppercase tracking-wider">Confirmed</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-light tracking-wider text-emerald-300">
              {loadingStats ? '—' : stats.confirmed}
            </div>
            <span className="text-[10px] text-[#89847C] tracking-wide mt-1 block">Approved admissions</span>
          </div>

          {/* Attended */}
          <div className="bg-[#0E0E0E]/90 border border-[#C9A66B]/20 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#89847C] mb-2">
              <span className="text-[11px] font-sans uppercase tracking-wider">Attended</span>
              <UserCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-light tracking-wider text-sky-300">
              {loadingStats ? '—' : stats.attended}
            </div>
            <span className="text-[10px] text-[#89847C] tracking-wide mt-1 block">Checked in at venue</span>
          </div>

          {/* Cancelled */}
          <div className="col-span-2 lg:col-span-1 bg-[#0E0E0E]/90 border border-[#C9A66B]/20 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#89847C] mb-2">
              <span className="text-[11px] font-sans uppercase tracking-wider">Cancelled</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-light tracking-wider text-rose-300">
              {loadingStats ? '—' : stats.cancelled}
            </div>
            <span className="text-[10px] text-[#89847C] tracking-wide mt-1 block">Revoked records</span>
          </div>
        </section>

        {/* CONTROLS / FILTER BAR */}
        <section className="bg-[#0E0E0E]/90 border border-[#C9A66B]/20 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value, page: 1 })}
                placeholder="Search by guest name, email, @instagram, or NOIR reference ID..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#050505] border border-[#C9A66B]/25 focus:border-[#C9A66B] outline-none text-xs text-[#F4EFE5] placeholder-[#89847C]/60 transition-all"
              />
              <Search className="w-4 h-4 text-[#89847C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Actions: CSV Export */}
            <button
              onClick={handleExportCSV}
              disabled={exportingCSV || totalCount === 0}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C9A66B]/15 border border-[#C9A66B]/40 hover:bg-[#C9A66B] hover:text-[#050505] text-[#C9A66B] text-xs font-sans uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{exportingCSV ? 'Generating CSV...' : 'Export CSV'}</span>
            </button>
          </div>

          {/* Status & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#C9A66B]/10 text-xs">
            <div className="flex items-center gap-2 text-[#89847C]">
              <Filter className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span className="text-[11px] uppercase tracking-wider">Status:</span>
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value as 'all' | RegistrationStatus,
                  page: 1,
                })
              }
              className="px-3.5 py-2 rounded-lg bg-[#050505] border border-[#C9A66B]/25 text-[#F4EFE5] text-xs outline-none focus:border-[#C9A66B]"
            >
              <option value="all">All Registrations</option>
              <option value="registered">Registered</option>
              <option value="confirmed">Confirmed</option>
              <option value="attended">Attended</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Sort Order */}
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sortBy: e.target.value as 'newest' | 'oldest',
                  page: 1,
                })
              }
              className="px-3.5 py-2 rounded-lg bg-[#050505] border border-[#C9A66B]/25 text-[#F4EFE5] text-xs outline-none focus:border-[#C9A66B] ml-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </section>

        {/* ERROR STATE */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadRegistrations}
              className="px-3 py-1 rounded bg-red-900/50 hover:bg-red-900 text-xs uppercase"
            >
              Retry
            </button>
          </div>
        )}

        {/* REGISTRATIONS TABLE */}
        <section className="bg-[#0E0E0E]/95 border border-[#C9A66B]/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050505] border-b border-[#C9A66B]/20 text-[#89847C] font-sans uppercase tracking-[0.15em] text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Ref ID</th>
                  <th className="py-3.5 px-4">Guest Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Instagram</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A66B]/10">
                {loadingData ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#89847C]">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-[#C9A66B] animate-spin" />
                        <span className="font-sans text-xs tracking-wider uppercase">
                          Retrieving records...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-14 text-center text-[#89847C]">
                      <div className="flex flex-col items-center gap-2">
                        <FileSpreadsheet className="w-8 h-8 text-[#C9A66B]/40 mb-1" />
                        <p className="font-sans text-sm text-[#F4EFE5] font-light tracking-wide">
                          No registrations found
                        </p>
                        <p className="text-xs text-[#89847C]/80 max-w-sm">
                          {filters.searchQuery || filters.status !== 'all'
                            ? 'No entries match your active filters. Try clearing search or status filters.'
                            : 'Registrations submitted via /register will appear here in real time.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr
                      key={reg.id}
                      className="hover:bg-[#C9A66B]/5 transition-colors group"
                    >
                      {/* Ref ID */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#C9A66B] font-medium tracking-wider">
                        {reg.reference_id}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 font-medium text-[#F4EFE5]">
                        {reg.full_name}
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-[#89847C]">
                        {reg.email}
                      </td>

                      {/* Instagram */}
                      <td className="py-3.5 px-4">
                        {reg.instagram_handle ? (
                          <a
                            href={`https://instagram.com/${reg.instagram_handle.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#C9A66B] hover:text-[#DFBE86] transition-colors"
                          >
                            <Instagram className="w-3 h-3 text-[#C9A66B]" />
                            <span>{reg.instagram_handle}</span>
                          </a>
                        ) : (
                          <span className="text-[#89847C]/50">—</span>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-[#89847C]">
                        {reg.phone || '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(reg.registration_status)}
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-[#89847C] text-[11px]">
                        {new Date(reg.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetailModal(reg)}
                            className="p-1.5 rounded-lg hover:bg-[#C9A66B]/20 text-[#C9A66B] transition-colors"
                            title="View / Edit Guest"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {reg.registration_status !== 'cancelled' && (
                            <button
                              onClick={() => setRecordToCancel(reg)}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                              title="Cancel Admission"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER / PAGINATION */}
          <div className="p-4 bg-[#050505] border-t border-[#C9A66B]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#89847C]">
            <div>
              Showing <span className="text-[#F4EFE5] font-medium">{registrations.length}</span> of{' '}
              <span className="text-[#F4EFE5] font-medium">{totalCount}</span> entries
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={filters.page <= 1 || loadingData}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                className="p-1.5 rounded-lg bg-[#0E0E0E] border border-[#C9A66B]/20 hover:border-[#C9A66B] disabled:opacity-30 disabled:cursor-not-allowed text-[#F4EFE5] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs">
                Page <span className="text-[#C9A66B]">{filters.page}</span> of {totalPages}
              </span>
              <button
                disabled={filters.page >= totalPages || loadingData}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                className="p-1.5 rounded-lg bg-[#0E0E0E] border border-[#C9A66B]/20 hover:border-[#C9A66B] disabled:opacity-30 disabled:cursor-not-allowed text-[#F4EFE5] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* DETAIL & STATUS EDIT MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-[#0E0E0E] border border-[#C9A66B]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F4EFE5]">
            <div className="flex items-center justify-between pb-4 border-b border-[#C9A66B]/20">
              <div>
                <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C9A66B]">
                  Guest Record
                </span>
                <h3 className="font-editorial text-2xl text-[#F4EFE5]">
                  {selectedRecord.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-[#89847C] hover:text-[#F4EFE5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#050505] p-4 rounded-xl border border-[#C9A66B]/15">
                <div>
                  <span className="text-[#89847C] text-[10px] uppercase tracking-wider block">Reference Pass</span>
                  <span className="text-[#C9A66B] font-mono font-medium text-sm">{selectedRecord.reference_id}</span>
                </div>
                <div>
                  <span className="text-[#89847C] text-[10px] uppercase tracking-wider block">Instagram</span>
                  <span className="text-[#DFBE86]">{selectedRecord.instagram_handle || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[#89847C] text-[10px] uppercase tracking-wider block">Email</span>
                  <span className="text-[#F4EFE5] break-all">{selectedRecord.email}</span>
                </div>
                <div>
                  <span className="text-[#89847C] text-[10px] uppercase tracking-wider block">Phone</span>
                  <span className="text-[#F4EFE5]">{selectedRecord.phone || 'Not provided'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#89847C] text-[10px] uppercase tracking-wider block">Registered At</span>
                  <span className="text-[#89847C]">{new Date(selectedRecord.created_at).toLocaleString()}</span>
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C9A66B] mb-1.5">
                  Update Guest Admission Status
                </label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value as RegistrationStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-[#C9A66B]/30 text-[#F4EFE5] text-xs outline-none focus:border-[#C9A66B]"
                >
                  <option value="registered">Registered (Initial Entry)</option>
                  <option value="confirmed">Confirmed (Approved Guest)</option>
                  <option value="attended">Attended (Checked-In at Reception)</option>
                  <option value="cancelled">Cancelled (Revoked / Denied)</option>
                </select>
              </div>

              {/* Internal Admin Notes */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C9A66B] mb-1.5">
                  Internal Administrative Notes
                </label>
                <textarea
                  rows={3}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="e.g. VIP guest, table verified, or badge issued..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050505] border border-[#C9A66B]/30 text-[#F4EFE5] text-xs outline-none focus:border-[#C9A66B] placeholder-[#89847C]/50 resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#C9A66B]/20 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl border border-[#C9A66B]/20 hover:border-[#C9A66B]/40 text-[#89847C] font-sans text-xs uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingStatus}
                onClick={handleSaveStatus}
                className="px-5 py-2 rounded-xl bg-[#C9A66B] hover:bg-[#DFBE86] text-[#050505] font-sans text-xs uppercase tracking-wider font-medium transition-colors disabled:opacity-50"
              >
                {updatingStatus ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESTRUCTIVE CONFIRMATION MODAL */}
      {recordToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-[#0E0E0E] border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F4EFE5]">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-400 mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-editorial text-xl text-center uppercase tracking-wider text-[#F4EFE5]">
              Cancel Guest Admission?
            </h3>
            <p className="text-xs text-[#89847C] text-center my-3 leading-relaxed">
              Are you sure you want to cancel registration{' '}
              <span className="text-[#C9A66B] font-mono font-medium">{recordToCancel.reference_id}</span>{' '}
              for <strong className="text-[#F4EFE5]">{recordToCancel.full_name}</strong>?
            </p>

            <div className="pt-4 border-t border-[#C9A66B]/15 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setRecordToCancel(null)}
                className="w-full py-2.5 rounded-xl border border-[#C9A66B]/30 hover:border-[#C9A66B] text-[#89847C] font-sans text-xs uppercase tracking-wider transition-colors"
              >
                No, Keep
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-sans text-xs uppercase tracking-wider font-medium transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full pt-6 border-t border-[#C9A66B]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#89847C] text-[10px] tracking-wider uppercase">
        <p>NOIR CHD • PRIVATE ADMINISTRATIVE SUITE</p>
        <p>STRICT ZERO-TOLERANCE DRUG POLICY ENFORCED</p>
      </footer>
    </div>
  );
};
