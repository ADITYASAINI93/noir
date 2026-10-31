import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchDashboardStats,
  fetchRegistrations,
  fetchAllRegistrationsForExport,
  updateRegistrationStatus,
  downloadRegistrationsCSV,
  deleteRegistration,
} from '../services/registrationService';
import {
  fetchAdminUsers,
  deleteAdminUser,
  AdminUserRecord,
} from '../services/adminUserService';
import {
  fetchAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../services/eventService';
import {
  fetchAllEnquiriesAdmin,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../services/contactService';
import { NoirEvent, EventStatus, ContactEnquiry, EnquiryStatus } from '../types/event';
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
  X,
  FileSpreadsheet,
  Clock,
  Instagram,
  Database,
  Home,
  User,
  Trash2,
  Shield,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Plus,
  Pencil,
  MessageSquare,
  Sparkles,
  Settings,
  Globe,
  Phone,
  Save,
  RotateCcw,
} from 'lucide-react';
import { FilmGrain } from '../components/FilmGrain';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '../types/settings';

type AdminTab = 'overview' | 'events' | 'enquiries' | 'users' | 'registrations' | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const { user, signOut, isLocalMode } = useAuth();
  const navigate = useNavigate();

  // Active view tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Stats state
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    today: 0,
    registered: 0,
    confirmed: 0,
    attended: 0,
    cancelled: 0,
  });

  // Events state
  const [eventsList, setEventsList] = useState<NoirEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [eventsMissingTable, setEventsMissingTable] = useState<boolean>(false);
  const [eventModalOpen, setEventModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<NoirEvent | null>(null);
  const [savingEvent, setSavingEvent] = useState<boolean>(false);
  const [eventFormError, setEventFormError] = useState<string | null>(null);
  const [eventToDelete, setEventToDelete] = useState<NoirEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<boolean>(false);

  // Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventVenue, setEventVenue] = useState('Sector 26 Club District');
  const [eventLocation, setEventLocation] = useState('Chandigarh, India');
  const [eventDate, setEventDate] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventGenre, setEventGenre] = useState('Melodic Techno & Deep House');
  const [eventArtist, setEventArtist] = useState('');
  const [eventCoverCharge, setEventCoverCharge] = useState('₹1,500');
  const [eventPosterUrl, setEventPosterUrl] = useState('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80');
  const [eventDescription, setEventDescription] = useState('');
  const [eventIsFeatured, setEventIsFeatured] = useState(false);
  const [eventStatus, setEventStatus] = useState<EventStatus>('published');

  // Enquiries state
  const [enquiriesList, setEnquiriesList] = useState<ContactEnquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState<boolean>(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [enquiryStatusVal, setEnquiryStatusVal] = useState<EnquiryStatus>('pending');
  const [enquiryNotesVal, setEnquiryNotesVal] = useState('');
  const [updatingEnquiry, setUpdatingEnquiry] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<ContactEnquiry | null>(null);

  // Table & filters state for registrations
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

  // Users state
  const [usersList, setUsersList] = useState<AdminUserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');

  // Loading and feedback states
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [exportingCSV, setExportingCSV] = useState<boolean>(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Modals state for registrations
  const [selectedRecord, setSelectedRecord] = useState<Registration | null>(null);
  const [actionNotes, setActionNotes] = useState<string>('');
  const [actionStatus, setActionStatus] = useState<RegistrationStatus>('registered');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [recordToDelete, setRecordToDelete] = useState<Registration | null>(null);
  const [deletingRegistration, setDeletingRegistration] = useState<boolean>(false);

  // Destructive user deletion modal
  const [userToDelete, setUserToDelete] = useState<AdminUserRecord | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState<string>('');
  const [deletingUser, setDeletingUser] = useState<boolean>(false);

  // Global Site Settings state
  const {
    settings: globalSettings,
    updateSettings,
    reloadSettings,
    missingTable: settingsMissingTable,
  } = useSiteSettings();
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(globalSettings);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState<string | null>(null);
  const [settingsSaveError, setSettingsSaveError] = useState<string | null>(null);

  // Keep local settings form synchronized when global settings load
  useEffect(() => {
    setSettingsForm(globalSettings);
  }, [globalSettings]);

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

  // Load Events
  const loadEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const res = await fetchAllEventsAdmin();
      setEventsList(res.events || []);
      setEventsMissingTable(Boolean(res.missingTable));
      if (res.error && !res.missingTable) {
        setFeedbackError(res.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load events';
      console.error('Failed to load admin events:', msg);
      setFeedbackError(msg);
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  // Load Enquiries
  const loadEnquiries = useCallback(async () => {
    try {
      setLoadingEnquiries(true);
      const list = await fetchAllEnquiriesAdmin();
      setEnquiriesList(list);
    } catch (err) {
      console.error('Failed to load admin enquiries:', err);
    } finally {
      setLoadingEnquiries(false);
    }
  }, []);

  // Load Registrations Table
  const loadRegistrations = useCallback(async () => {
    try {
      setLoadingData(true);
      setFeedbackError(null);
      const res = await fetchRegistrations(filters);
      setRegistrations(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching registrations.';
      setFeedbackError(msg);
    } finally {
      setLoadingData(false);
    }
  }, [filters]);

  // Load User Accounts List
  const loadUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const list = await fetchAdminUsers();
      setUsersList(list);
    } catch (err: unknown) {
      console.error('Failed to load user accounts:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadEvents();
    loadEnquiries();
    loadUsers();
  }, [loadStats, loadEvents, loadEnquiries, loadUsers]);

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
      setFeedbackError(msg);
    } finally {
      setExportingCSV(false);
    }
  };

  // Open Event Modal (Create or Edit)
  const openEventModal = (evt?: NoirEvent) => {
    setEventFormError(null);
    if (evt) {
      setEditingEvent(evt);
      setEventTitle(evt.title);
      setEventVenue(evt.venue);
      setEventLocation(evt.location || 'Chandigarh, India');
      setEventDate(evt.event_date ? new Date(evt.event_date).toISOString().slice(0, 16) : '');
      setEventEndTime(evt.end_time ? new Date(evt.end_time).toISOString().slice(0, 16) : '');
      setEventGenre(evt.genre || 'Melodic Techno');
      setEventArtist(evt.artist || '');
      setEventCoverCharge(evt.cover_charge || '₹1,500');
      setEventPosterUrl(evt.poster_url || '');
      setEventDescription(evt.description || '');
      setEventIsFeatured(Boolean(evt.is_featured));
      setEventStatus(evt.status || 'published');
    } else {
      setEditingEvent(null);
      setEventTitle('');
      setEventVenue('Sector 26 Club District');
      setEventLocation('Sector 26, Chandigarh');
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      defaultDate.setHours(21, 30, 0, 0);
      setEventDate(defaultDate.toISOString().slice(0, 16));
      setEventEndTime('');
      setEventGenre('Melodic Techno & Deep House');
      setEventArtist('');
      setEventCoverCharge('₹1,500');
      setEventPosterUrl('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80');
      setEventDescription('An exclusive electronic music showcase bringing dark melodic soundscapes to Chandigarh.');
      setEventIsFeatured(false);
      setEventStatus('published');
    }
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventFormError(null);

    const cleanTitle = eventTitle.trim();
    if (!cleanTitle || cleanTitle.length < 2) {
      setEventFormError('Showcase title is required (at least 2 characters).');
      return;
    }

    const cleanVenue = eventVenue.trim();
    if (!cleanVenue) {
      setEventFormError('Venue name is required.');
      return;
    }

    if (!eventDate) {
      setEventFormError('Event date & start time are required.');
      return;
    }

    const parsedDate = new Date(eventDate);
    if (isNaN(parsedDate.getTime())) {
      setEventFormError('Please enter a valid event start date and time.');
      return;
    }

    let parsedEndTime: string | null = null;
    if (eventEndTime) {
      const parsedEnd = new Date(eventEndTime);
      if (isNaN(parsedEnd.getTime())) {
        setEventFormError('Please enter a valid end date and time.');
        return;
      }
      parsedEndTime = parsedEnd.toISOString();
    }

    setSavingEvent(true);
    try {
      const payload = {
        title: cleanTitle,
        venue: cleanVenue,
        location: eventLocation.trim() || 'Chandigarh, India',
        event_date: parsedDate.toISOString(),
        end_time: parsedEndTime,
        genre: eventGenre.trim() || 'Melodic Techno',
        artist: eventArtist.trim(),
        cover_charge: eventCoverCharge.trim() || null,
        poster_url: eventPosterUrl.trim() || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
        description: eventDescription.trim(),
        is_featured: eventIsFeatured,
        status: eventStatus,
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
        setFeedbackSuccess(`Showcase "${payload.title}" updated successfully.`);
      } else {
        await createEvent(payload);
        setFeedbackSuccess(`New showcase "${payload.title}" created successfully.`);
      }

      setEventModalOpen(false);
      await loadEvents();
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save event.';
      setEventFormError(msg);
    } finally {
      setSavingEvent(false);
    }
  };

  const handleToggleEventPublish = async (evt: NoirEvent) => {
    const nextStatus: EventStatus = evt.status === 'published' ? 'draft' : 'published';
    try {
      await updateEvent(evt.id, { status: nextStatus });
      setFeedbackSuccess(`Showcase "${evt.title}" marked as ${nextStatus}.`);
      await loadEvents();
      setTimeout(() => setFeedbackSuccess(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update event status.';
      setFeedbackError(msg);
    }
  };

  const handleConfirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    setDeletingEvent(true);
    try {
      await deleteEvent(eventToDelete.id);
      setFeedbackSuccess(`Showcase "${eventToDelete.title}" was deleted.`);
      setEventToDelete(null);
      await loadEvents();
      setTimeout(() => setFeedbackSuccess(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete event.';
      setFeedbackError(msg);
    } finally {
      setDeletingEvent(false);
    }
  };

  // Open Enquiry Details
  const openEnquiryModal = (enq: ContactEnquiry) => {
    setSelectedEnquiry(enq);
    setEnquiryStatusVal(enq.status);
    setEnquiryNotesVal(enq.admin_notes || '');
  };

  const handleSaveEnquiry = async () => {
    if (!selectedEnquiry) return;
    setUpdatingEnquiry(true);
    try {
      await updateEnquiryStatus(selectedEnquiry.id, enquiryStatusVal, enquiryNotesVal);
      setFeedbackSuccess(`Updated enquiry from ${selectedEnquiry.full_name}.`);
      setSelectedEnquiry(null);
      loadEnquiries();
      setTimeout(() => setFeedbackSuccess(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update enquiry.';
      setFeedbackError(msg);
    } finally {
      setUpdatingEnquiry(false);
    }
  };

  const handleConfirmDeleteEnquiry = async () => {
    if (!enquiryToDelete) return;
    try {
      await deleteEnquiry(enquiryToDelete.id);
      setFeedbackSuccess(`Enquiry deleted.`);
      setEnquiryToDelete(null);
      loadEnquiries();
      setTimeout(() => setFeedbackSuccess(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete enquiry.';
      setFeedbackError(msg);
    }
  };

  // Site Settings Handlers
  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaveError(null);
    setSettingsSaveSuccess(null);

    const brand = settingsForm.brandName.trim();
    if (!brand || brand.length < 2) {
      setSettingsSaveError('Brand name must be at least 2 characters.');
      return;
    }

    const email = settingsForm.contactEmail.trim();
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      setSettingsSaveError('Please provide a valid contact email address.');
      return;
    }

    const phone = settingsForm.contactPhone.trim();
    if (!phone || phone.length < 5) {
      setSettingsSaveError('Contact phone number is required.');
      return;
    }

    const region = settingsForm.operatingRegion.trim();
    if (!region || region.length < 3) {
      setSettingsSaveError('Operating region / venue text is required.');
      return;
    }

    setSavingSettings(true);
    try {
      const res = await updateSettings({
        brandName: brand,
        brandTagline: settingsForm.brandTagline.trim(),
        contactEmail: email,
        contactPhone: phone,
        operatingRegion: region,
        cityState: settingsForm.cityState.trim(),
        instagramHandle: settingsForm.instagramHandle.trim(),
        instagramUrl: settingsForm.instagramUrl.trim(),
        operatingHours: settingsForm.operatingHours.trim(),
        admissionPolicy: settingsForm.admissionPolicy.trim(),
      });

      if (res.savedToCloud) {
        setSettingsSaveSuccess('Site settings saved to Supabase PostgreSQL and published across all public pages.');
      } else {
        setSettingsSaveSuccess('Site settings saved to local cache & published across all pages. (Run migration 09_create_site_settings.sql in Supabase SQL editor to sync to PostgreSQL)');
      }
      setTimeout(() => setSettingsSaveSuccess(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save site settings.';
      setSettingsSaveError(msg);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleReloadSiteSettings = async () => {
    try {
      await reloadSettings();
      setSettingsSaveSuccess('Settings reloaded from storage.');
      setTimeout(() => setSettingsSaveSuccess(null), 3000);
    } catch {
      setSettingsSaveError('Failed to reload settings.');
    }
  };

  const handleResetSiteSettingsDefaults = () => {
    if (window.confirm('Reset all site settings to canonical NOIR EVENTS default values?')) {
      setSettingsForm(DEFAULT_SITE_SETTINGS);
      setSettingsSaveSuccess('Restored defaults. Click "Save All Changes" to persist.');
      setTimeout(() => setSettingsSaveSuccess(null), 4000);
    }
  };

  // Save updated registration status & notes
  const handleSaveRegistrationStatus = async () => {
    if (!selectedRecord) return;
    try {
      setUpdatingStatus(true);
      await updateRegistrationStatus(selectedRecord.id, actionStatus, actionNotes);
      setSelectedRecord(null);
      setFeedbackSuccess(`Updated admission status for ${selectedRecord.reference_id}.`);
      loadRegistrations();
      loadStats();
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update record.';
      setFeedbackError(msg);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Confirm permanent deletion of a registration record
  const handleConfirmDeleteRegistration = async () => {
    if (!recordToDelete) return;
    try {
      setDeletingRegistration(true);
      setFeedbackError(null);
      await deleteRegistration(recordToDelete.id);
      const deletedRef = recordToDelete.reference_id;
      setRecordToDelete(null);
      if (selectedRecord && selectedRecord.id === recordToDelete.id) {
        setSelectedRecord(null);
      }
      setFeedbackSuccess(`Registration record ${deletedRef} was permanently deleted.`);
      loadRegistrations();
      loadStats();
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete registration record.';
      setFeedbackError(msg);
    } finally {
      setDeletingRegistration(false);
    }
  };

  // Confirm permanent deletion of a user account
  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      setFeedbackError('Please type DELETE to confirm account deletion.');
      return;
    }
    if (userToDelete.id === user?.id) {
      setFeedbackError('You cannot delete your own administrator account.');
      return;
    }

    try {
      setDeletingUser(true);
      setFeedbackError(null);
      const res = await deleteAdminUser(userToDelete.id);
      const deletedEmail = userToDelete.email;
      setUserToDelete(null);
      setDeleteConfirmationText('');
      setFeedbackSuccess(res.message || `User account ${deletedEmail} was permanently deleted.`);
      loadUsers();
      setTimeout(() => setFeedbackSuccess(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete user account.';
      setFeedbackError(msg);
    } finally {
      setDeletingUser(false);
    }
  };

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

  const filteredUsers = usersList.filter((u) => {
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.instagram_handle?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  const publishedEventsCount = eventsList.filter((e) => e.status === 'published').length;
  const pendingEnquiriesCount = enquiriesList.filter((e) => e.status === 'pending').length;

  return (
    <div className="relative min-h-screen bg-[#050706] text-[#F9FAFB] selection:bg-[#00F0A0]/30 selection:text-[#FFFFFF] overflow-x-hidden flex flex-col justify-between py-6 px-4 sm:px-8">
      <FilmGrain />

      {/* Volumetric Emerald Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-radial from-[#05D38A]/08 via-[#064E3B]/03 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-architectural-grid opacity-35 pointer-events-none" />

      {/* TOP HEADER */}
      <header className="relative z-20 max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#18241E] gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="group flex items-baseline gap-2 focus:outline-none transition-transform hover:opacity-90"
            title="Return to NOIR EVENTS Homepage"
          >
            <span className="font-display text-2xl font-black tracking-[0.16em] text-white group-hover:text-[#00F0A0] transition-colors">
              {globalSettings.brandName.split(' ')[0] || 'NOIR'}
            </span>
            <span className="font-display text-[11px] font-bold tracking-[0.38em] text-[#00F0A0]">
              {globalSettings.brandName.split(' ').slice(1).join(' ') || 'EVENTS'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0A0] shadow-[0_0_6px_#00F0A0]" />
          </Link>
          <span className="hidden sm:inline-block w-[1px] h-5 bg-[#18241E]" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">
            ADMINISTRATION DIRECTORY
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Back to Website (Preserves Admin Session) */}
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#101713] border border-[#1E3327] hover:border-[#00F0A0]/50 text-white hover:text-[#00F0A0] text-xs font-display uppercase tracking-wider font-semibold transition-all shadow-md active:scale-95"
            title="Return to Public Website (Preserves Admin Session)"
          >
            <Home className="w-3.5 h-3.5 text-[#00F0A0]" />
            <span className="hidden sm:inline">Back to Website</span>
            <span className="inline sm:hidden">Website</span>
          </Link>

          {/* Member Profile Shortcut */}
          <Link
            to="/account"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#101713] border border-[#1E3327] hover:border-[#00F0A0]/40 text-[#9CA3AF] hover:text-white text-xs font-display uppercase tracking-wider transition-colors"
            title="View My Profile"
          >
            <User className="w-3.5 h-3.5 text-[#00F0A0]" />
            <span>Profile</span>
          </Link>

          {/* Database Mode Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#101713] border border-[#1E3327] text-[10px] tracking-wider uppercase font-mono">
            <Database className="w-3 h-3 text-[#00F0A0]" />
            <span className={isLocalMode ? 'text-amber-300' : 'text-[#00F0A0]'}>
              {isLocalMode ? 'Active Local DB' : 'Supabase PostgreSQL'}
            </span>
          </div>

          <div className="text-right hidden xl:block">
            <p className="text-xs text-white font-medium truncate max-w-[150px]">{user?.email}</p>
            <p className="text-[10px] text-[#00F0A0] uppercase tracking-wider font-mono">Authorized Admin</p>
          </div>

          <button
            onClick={() => {
              loadStats();
              loadEvents();
              loadEnquiries();
              loadUsers();
              loadRegistrations();
              reloadSettings();
            }}
            title="Refresh All Data"
            className="p-2.5 rounded-xl bg-[#101713] border border-[#1E3327] hover:border-[#00F0A0]/50 text-[#9CA3AF] hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            title="Sign Out of Administrator Account"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#101713] border border-red-500/30 hover:border-red-500 text-red-300 text-xs font-display uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* FEEDBACK BANNERS */}
      {feedbackSuccess && (
        <div className="relative z-20 max-w-7xl mx-auto w-full mt-4 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackSuccess}</span>
          </div>
          <button onClick={() => setFeedbackSuccess(null)} className="text-emerald-400 hover:text-emerald-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {feedbackError && (
        <div className="relative z-20 max-w-7xl mx-auto w-full mt-4 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{feedbackError}</span>
          </div>
          <button onClick={() => setFeedbackError(null)} className="text-red-400 hover:text-red-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 max-w-7xl mx-auto w-full my-6 flex-1 space-y-6">
        {/* VIEW TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#18241E] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display uppercase tracking-[0.2em] transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#00F0A0] text-[#04140B] font-bold shadow-[0_0_20px_rgba(0,240,160,0.25)] border border-[#00F0A0]'
                  : 'bg-[#0A0E0C] text-[#9CA3AF] hover:text-white border border-[#18241E] hover:border-[#05D38A]/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display uppercase tracking-[0.2em] transition-all ${
                activeTab === 'events'
                  ? 'bg-[#00F0A0] text-[#04140B] font-bold shadow-[0_0_20px_rgba(0,240,160,0.25)] border border-[#00F0A0]'
                  : 'bg-[#0A0E0C] text-[#9CA3AF] hover:text-white border border-[#18241E] hover:border-[#05D38A]/40'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Events</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'events' ? 'bg-black/25 text-[#04140B] font-semibold' : 'bg-white/5 text-[#9CA3AF]'
              }`}>
                {eventsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display uppercase tracking-[0.2em] transition-all ${
                activeTab === 'enquiries'
                  ? 'bg-[#00F0A0] text-[#04140B] font-bold shadow-[0_0_20px_rgba(0,240,160,0.25)] border border-[#00F0A0]'
                  : 'bg-[#0A0E0C] text-[#9CA3AF] hover:text-white border border-[#18241E] hover:border-[#05D38A]/40'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Enquiries</span>
              {pendingEnquiriesCount > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-black font-bold">
                  {pendingEnquiriesCount}
                </span>
              ) : (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === 'enquiries' ? 'bg-black/25 text-[#04140B] font-semibold' : 'bg-white/5 text-[#9CA3AF]'
                }`}>
                  {enquiriesList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display uppercase tracking-[0.2em] transition-all ${
                activeTab === 'users'
                  ? 'bg-[#00F0A0] text-[#04140B] font-bold shadow-[0_0_20px_rgba(0,240,160,0.25)] border border-[#00F0A0]'
                  : 'bg-[#0A0E0C] text-[#9CA3AF] hover:text-white border border-[#18241E] hover:border-[#05D38A]/40'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Users</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'users' ? 'bg-black/25 text-[#04140B] font-semibold' : 'bg-white/5 text-[#9CA3AF]'
              }`}>
                {usersList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('registrations')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display uppercase tracking-[0.2em] transition-all ${
                activeTab === 'registrations'
                  ? 'bg-[#00F0A0] text-[#04140B] font-bold shadow-[0_0_20px_rgba(0,240,160,0.25)] border border-[#00F0A0]'
                  : 'bg-[#0A0E0C] text-[#9CA3AF] hover:text-white border border-[#18241E] hover:border-[#05D38A]/40'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Door Passes</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'registrations' ? 'bg-black/25 text-[#04140B] font-semibold' : 'bg-white/5 text-[#9CA3AF]'
              }`}>
                {stats.total}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display uppercase tracking-[0.2em] transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#00F0A0] text-[#04140B] font-bold shadow-[0_0_20px_rgba(0,240,160,0.25)] border border-[#00F0A0]'
                  : 'bg-[#0A0E0C] text-[#9CA3AF] hover:text-white border border-[#18241E] hover:border-[#05D38A]/40'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Site Settings</span>
            </button>
          </div>

          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0A0] animate-pulse" />
            <span>Admin Console • {globalSettings.cityState}</span>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Metrics */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0A0E0C]/90 border border-[#18241E] rounded-3xl p-5 sm:p-6 shadow-xl hover:border-[#00F0A0]/40 transition-all backdrop-blur-xl group">
                <div className="flex items-center justify-between text-[#9CA3AF] mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Registered Users</span>
                  <div className="w-8 h-8 rounded-xl bg-[#101713] border border-[#1E3327] flex items-center justify-center text-[#00F0A0] group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4 text-[#00F0A0]" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-display font-bold text-white">
                  {loadingUsers ? '—' : usersList.length}
                </div>
                <span className="text-[10px] text-[#9CA3AF] font-light mt-1.5 block">Authentication directory</span>
              </div>

              <div className="bg-[#0A0E0C]/90 border border-[#18241E] rounded-3xl p-5 sm:p-6 shadow-xl hover:border-[#00F0A0]/40 transition-all backdrop-blur-xl group">
                <div className="flex items-center justify-between text-[#9CA3AF] mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Published Events</span>
                  <div className="w-8 h-8 rounded-xl bg-[#101713] border border-[#1E3327] flex items-center justify-center text-[#00F0A0] group-hover:scale-105 transition-transform">
                    <Calendar className="w-4 h-4 text-[#00F0A0]" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-display font-bold text-[#00F0A0]">
                  {loadingEvents ? '—' : publishedEventsCount}
                </div>
                <span className="text-[10px] text-[#9CA3AF] font-light mt-1.5 block">Live on public website</span>
              </div>

              <div className="bg-[#0A0E0C]/90 border border-[#18241E] rounded-3xl p-5 sm:p-6 shadow-xl hover:border-[#00F0A0]/40 transition-all backdrop-blur-xl group">
                <div className="flex items-center justify-between text-[#9CA3AF] mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Pending Enquiries</span>
                  <div className="w-8 h-8 rounded-xl bg-[#101713] border border-[#1E3327] flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-display font-bold text-amber-300">
                  {loadingEnquiries ? '—' : pendingEnquiriesCount}
                </div>
                <span className="text-[10px] text-[#9CA3AF] font-light mt-1.5 block">Table &amp; artist submissions</span>
              </div>

              <div className="bg-[#0A0E0C]/90 border border-[#18241E] rounded-3xl p-5 sm:p-6 shadow-xl hover:border-[#00F0A0]/40 transition-all backdrop-blur-xl group">
                <div className="flex items-center justify-between text-[#9CA3AF] mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Total Passes</span>
                  <div className="w-8 h-8 rounded-xl bg-[#101713] border border-[#1E3327] flex items-center justify-center text-[#05D38A] group-hover:scale-105 transition-transform">
                    <FileSpreadsheet className="w-4 h-4 text-[#05D38A]" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-display font-bold text-white">
                  {loadingStats ? '—' : stats.total}
                </div>
                <span className="text-[10px] text-[#9CA3AF] font-light mt-1.5 block">Accreditation records</span>
              </div>
            </section>

            {/* Quick Actions & Recent Showcases */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0A0E0C]/90 border border-[#18241E] space-y-5 shadow-2xl backdrop-blur-xl">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#00F0A0] block">
                    Operations
                  </span>
                  <h3 className="font-display text-2xl text-white uppercase font-bold mt-0.5">
                    Quick Actions
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                  <button
                    onClick={() => {
                      setActiveTab('events');
                      openEventModal();
                    }}
                    className="p-4 rounded-2xl bg-[#080D0A] border border-[#18241E] hover:border-[#00F0A0]/50 text-left transition-all group flex flex-col justify-between"
                  >
                    <Plus className="w-5 h-5 text-[#00F0A0] mb-2 group-hover:scale-110 transition-transform" />
                    <div>
                      <strong className="text-white block font-display text-sm">Create Showcase</strong>
                      <span className="text-[#9CA3AF] text-[11px]">Publish a nocturnal event</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="p-4 rounded-2xl bg-[#080D0A] border border-[#18241E] hover:border-[#00F0A0]/50 text-left transition-all group flex flex-col justify-between"
                  >
                    <MessageSquare className="w-5 h-5 text-[#00F0A0] mb-2 group-hover:scale-110 transition-transform" />
                    <div>
                      <strong className="text-white block font-display text-sm">View Enquiries</strong>
                      <span className="text-[#9CA3AF] text-[11px]">{pendingEnquiriesCount} pending submissions</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('users')}
                    className="p-4 rounded-2xl bg-[#080D0A] border border-[#18241E] hover:border-[#00F0A0]/50 text-left transition-all group flex flex-col justify-between"
                  >
                    <Users className="w-5 h-5 text-[#00F0A0] mb-2 group-hover:scale-110 transition-transform" />
                    <div>
                      <strong className="text-white block font-display text-sm">Manage Members</strong>
                      <span className="text-[#9CA3AF] text-[11px]">{usersList.length} verified accounts</span>
                    </div>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="p-4 rounded-2xl bg-[#080D0A] border border-[#18241E] hover:border-[#00F0A0]/50 text-left transition-all group flex flex-col justify-between"
                  >
                    <Download className="w-5 h-5 text-[#00F0A0] mb-2 group-hover:scale-110 transition-transform" />
                    <div>
                      <strong className="text-white block font-display text-sm">Export CSV</strong>
                      <span className="text-[#9CA3AF] text-[11px]">Guest accreditation data</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-[#0A0E0C]/90 border border-[#18241E] space-y-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#00F0A0] block">
                      Inbox
                    </span>
                    <h3 className="font-display text-2xl text-white uppercase font-bold mt-0.5">
                      Recent Inquiries
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs font-mono uppercase tracking-wider text-[#00F0A0] hover:underline"
                  >
                    View All
                  </button>
                </div>

                {enquiriesList.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF] py-8 text-center font-light">No inquiries received yet.</p>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    {enquiriesList.slice(0, 3).map((enq) => (
                      <div
                        key={enq.id}
                        onClick={() => openEnquiryModal(enq)}
                        className="p-3.5 rounded-2xl bg-[#080D0A] border border-[#18241E] hover:border-[#00F0A0]/40 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div className="space-y-0.5 truncate max-w-[240px]">
                          <strong className="text-white block truncate">{enq.full_name}</strong>
                          <span className="text-[#9CA3AF] text-[11px] block truncate">{enq.subject}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-semibold ${
                          enq.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : enq.status === 'in_progress'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {enq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVENT MANAGEMENT */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#17191E]/90 border border-[#343A43]">
              <div>
                <h3 className="font-editorial text-2xl text-[#F2F0EB] font-light uppercase">
                  Nocturnal Showcase Management
                </h3>
                <p className="font-sans text-xs text-[#7B8999]">
                  Configure events, set times, artists, cover charges, and venues in Chandigarh.
                </p>
              </div>

              <button
                onClick={() => openEventModal()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F0A0] hover:bg-[#05D38A] text-[#050706] text-xs font-sans uppercase tracking-[0.2em] font-semibold transition-all shadow-[0_0_20px_rgba(0,240,160,0.25)]"
              >
                <Plus className="w-4 h-4 text-[#050706]" />
                <span>Create New Showcase</span>
              </button>
            </div>

            {/* Supabase migration notice if table not yet found */}
            {eventsMissingTable && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-[#00F0A0]/30 text-xs font-sans text-[#C6CDD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#00F0A0] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#F2F0EB]">Supabase database table <code className="text-[#00F0A0]">events</code> pending creation</p>
                    <p className="text-[#7B8999] mt-0.5">
                      Run migration <code className="text-[#00F0A0] bg-black/40 px-1.5 py-0.5 rounded">08_create_events_and_enquiries.sql</code> in your Supabase SQL editor to activate database-backed events with RLS.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Events List Table */}
            <div className="bg-[#17191E]/90 border border-[#343A43] rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#343A43] bg-[#08090B] text-[#C6CDD5] uppercase font-sans tracking-wider text-[11px]">
                      <th className="py-4 px-4 font-normal">Event Title</th>
                      <th className="py-4 px-4 font-normal">Venue &amp; Location</th>
                      <th className="py-4 px-4 font-normal">Date &amp; Time</th>
                      <th className="py-4 px-4 font-normal">Genre / Artist</th>
                      <th className="py-4 px-4 font-normal">Admission</th>
                      <th className="py-4 px-4 font-normal">Status</th>
                      <th className="py-4 px-4 font-normal text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C6CDD5]/10 font-sans">
                    {loadingEvents ? (
                      [1, 2, 3].map((skeletonIdx) => (
                        <tr key={`evt-skeleton-${skeletonIdx}`} className="animate-pulse">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10" />
                              <div className="space-y-1.5">
                                <div className="h-3 w-32 bg-white/10 rounded" />
                                <div className="h-2 w-16 bg-white/5 rounded" />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-3 w-28 bg-white/10 rounded mb-1" />
                            <div className="h-2 w-20 bg-white/5 rounded" />
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-3 w-24 bg-white/10 rounded" />
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-3 w-20 bg-white/10 rounded mb-1" />
                            <div className="h-2 w-16 bg-white/5 rounded" />
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-3 w-16 bg-white/10 rounded" />
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-5 w-16 bg-white/10 rounded-full" />
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="h-6 w-16 bg-white/10 rounded ml-auto" />
                          </td>
                        </tr>
                      ))
                    ) : eventsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center">
                          <div className="max-w-sm mx-auto space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#00F0A0]/10 border border-[#00F0A0]/20 flex items-center justify-center text-[#00F0A0] mx-auto">
                              <Calendar className="w-6 h-6" />
                            </div>
                            <h4 className="font-editorial text-lg text-[#F2F0EB] uppercase">No events scheduled</h4>
                            <p className="text-xs text-[#7B8999]">
                              There are currently no events in the system. Create your first nocturnal showcase using the button above.
                            </p>
                            <button
                              onClick={() => openEventModal()}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00F0A0] hover:bg-[#05D38A] text-[#050706] text-xs font-sans uppercase tracking-wider font-semibold transition-all shadow-[0_0_15px_rgba(0,240,160,0.25)]"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Create First Event</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      eventsList.map((evt) => (
                        <tr key={evt.id} className="hover:bg-[#C6CDD5]/5 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-[#F2F0EB] flex items-center gap-2.5">
                            <img
                              src={evt.poster_url}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-[#343A43]"
                            />
                            <div>
                              <span className="font-editorial text-base text-[#F2F0EB] block">{evt.title}</span>
                              {evt.is_featured && (
                                <span className="text-[9px] uppercase tracking-wider text-[#00F0A0]">Featured</span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-[#7B8999]">
                            <span className="text-[#F2F0EB] block">{evt.venue}</span>
                            <span className="text-[10px] text-[#7B8999]">{evt.location}</span>
                          </td>

                          <td className="py-3.5 px-4 text-[#7B8999]">
                            {new Date(evt.event_date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>

                          <td className="py-3.5 px-4 text-[#7B8999]">
                            <span className="text-[#00F0A0] block">{evt.genre}</span>
                            <span className="text-[10px] text-[#7B8999]">{evt.artist || '—'}</span>
                          </td>

                          <td className="py-3.5 px-4 text-emerald-300 font-medium">
                            {evt.cover_charge || 'Standard Entry'}
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleEventPublish(evt)}
                              className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold transition-all ${
                                evt.status === 'published'
                                  ? 'bg-[#00F0A0]/20 text-[#00F0A0] border border-[#00F0A0]/30 hover:bg-[#00F0A0]/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                              }`}
                              title="Click to toggle status"
                            >
                              {evt.status}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEventModal(evt)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-[#C6CDD5] hover:text-[#00F0A0] transition-colors"
                                title="Edit Event Details"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEventToDelete(evt)}
                                className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                title="Delete Event"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#0A0E0C]/90 border border-[#18241E] shadow-xl backdrop-blur-xl">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#00F0A0] block">
                Inbox
              </span>
              <h3 className="font-display text-2xl text-white font-bold uppercase mt-0.5">
                Incoming Guest &amp; Table Inquiries
              </h3>
              <p className="font-sans text-xs text-[#9CA3AF] mt-1 font-light">
                Submissions from the public Contact page for VIP tables, artist submissions, and private reservations in {globalSettings.cityState}.
              </p>
            </div>

            <div className="bg-[#0A0E0C]/90 border border-[#18241E] rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#18241E] bg-[#080D0A] text-[#9CA3AF] uppercase font-mono tracking-wider text-[10px]">
                      <th className="py-4 px-4 font-normal">Guest Name</th>
                      <th className="py-4 px-4 font-normal">Email Address</th>
                      <th className="py-4 px-4 font-normal">Subject</th>
                      <th className="py-4 px-4 font-normal">Status</th>
                      <th className="py-4 px-4 font-normal">Received Date</th>
                      <th className="py-4 px-4 font-normal text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18241E] font-sans">
                    {loadingEnquiries ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#9CA3AF]">
                          <RefreshCw className="w-6 h-6 text-[#00F0A0] animate-spin mx-auto mb-2" />
                          <span>Loading enquiries...</span>
                        </td>
                      </tr>
                    ) : enquiriesList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#9CA3AF]">
                          No inquiries received yet.
                        </td>
                      </tr>
                    ) : (
                      enquiriesList.map((enq) => (
                        <tr key={enq.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-medium text-white">
                            {enq.full_name}
                          </td>
                          <td className="py-3.5 px-4 text-[#9CA3AF]">
                            {enq.email}
                          </td>
                          <td className="py-3.5 px-4 text-[#00F0A0] max-w-[220px] truncate">
                            {enq.subject}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                              enq.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : enq.status === 'in_progress'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {enq.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#9CA3AF]">
                            {new Date(enq.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEnquiryModal(enq)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-[#9CA3AF] hover:text-[#00F0A0] transition-colors"
                                title="View Enquiry Details & Update Status"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEnquiryToDelete(enq)}
                                className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                title="Delete Enquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: USER ACCOUNTS */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <section className="bg-[#0A0E0C]/90 border border-[#18241E] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search accounts by name, email, phone, or Instagram..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080D0A] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-xs text-white placeholder-[#9CA3AF]/50 transition-all"
                  />
                  <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center gap-3 text-xs text-[#9CA3AF] shrink-0">
                  <div className="px-4 py-2.5 rounded-xl bg-[#080D0A] border border-[#18241E] flex items-center gap-2 font-mono">
                    <Users className="w-4 h-4 text-[#00F0A0]" />
                    <span>{usersList.length} Registered Accounts</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#0A0E0C]/90 border border-[#18241E] rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#18241E] bg-[#080D0A] text-[#9CA3AF] uppercase font-mono tracking-wider text-[10px]">
                      <th className="py-4 px-4 font-normal">Member Name</th>
                      <th className="py-4 px-4 font-normal">Email Address</th>
                      <th className="py-4 px-4 font-normal">Role / Authorization</th>
                      <th className="py-4 px-4 font-normal">Instagram</th>
                      <th className="py-4 px-4 font-normal">Phone</th>
                      <th className="py-4 px-4 font-normal">Member Since</th>
                      <th className="py-4 px-4 font-normal text-right">Delete Account</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18241E] font-sans">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={7} className="py-14 text-center text-[#9CA3AF]">
                          <div className="flex flex-col items-center gap-2">
                            <RefreshCw className="w-6 h-6 text-[#00F0A0] animate-spin" />
                            <span className="text-xs font-mono uppercase tracking-[0.2em]">
                              Retrieving registered accounts...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-14 text-center text-[#9CA3AF]">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="w-8 h-8 text-[#9CA3AF]/40 mb-1" />
                            <p className="font-sans text-sm text-white font-light tracking-wide">
                              No user accounts found
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isSelf = user?.id === u.id;
                        const isProtectedAdmin = u.is_admin;

                        return (
                          <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#101713] border border-[#1E3327] flex items-center justify-center text-[#00F0A0] font-display text-xs font-semibold shrink-0">
                                {u.full_name?.charAt(0)?.toUpperCase() || 'M'}
                              </div>
                              <div className="truncate max-w-[150px]">
                                <span className="block font-medium text-white">{u.full_name}</span>
                                {u.gender && (
                                  <span className="text-[10px] text-[#9CA3AF] capitalize">{u.gender}</span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-[#9CA3AF]">
                              <span className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-[#00F0A0]" />
                                <span>{u.email}</span>
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              {u.is_admin ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#00F0A0] text-[#04140B]">
                                  <Shield className="w-3 h-3 text-[#04140B]" />
                                  Administrator
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium bg-[#101713] border border-[#1E3327] text-[#00F0A0]">
                                  Verified Member
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-[#9CA3AF]">
                              {u.instagram_handle ? (
                                <span className="text-white flex items-center gap-1">
                                  <Instagram className="w-3 h-3 text-[#00F0A0]" />
                                  <span>{u.instagram_handle}</span>
                                </span>
                              ) : (
                                <span className="text-[#9CA3AF]/40">—</span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-[#9CA3AF]">
                              {u.phone || '—'}
                            </td>

                            <td className="py-3.5 px-4 text-[#9CA3AF] text-[11px]">
                              {new Date(u.created_at).toLocaleDateString()}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              {isSelf ? (
                                <span className="text-[10px] uppercase font-mono tracking-wider text-[#00F0A0] bg-[#00F0A0]/10 px-2.5 py-1 rounded-full border border-[#00F0A0]/30">
                                  Current User
                                </span>
                              ) : isProtectedAdmin ? (
                                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9CA3AF] bg-[#101713] px-2.5 py-1 rounded-full border border-[#18241E]">
                                  Protected Admin
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setUserToDelete(u);
                                    setDeleteConfirmationText('');
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 hover:border-red-500 text-red-400 hover:bg-red-500/10 text-xs font-sans uppercase tracking-wider transition-all"
                                  title="Permanently Delete User Account"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                  <span>Delete User</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* TAB 5: DOOR PASSES / REGISTRATIONS */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            <section className="bg-[#0A0E0C]/90 border border-[#18241E] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value, page: 1 })}
                    placeholder="Search by guest name, email, @instagram, or NOIR reference ID..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080D0A] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-xs text-white placeholder-[#9CA3AF]/50 transition-all"
                  />
                  <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  onClick={handleExportCSV}
                  disabled={exportingCSV || totalCount === 0}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#101713] border border-[#1E3327] hover:border-[#00F0A0]/50 text-white hover:text-[#00F0A0] text-xs font-display uppercase tracking-wider transition-all disabled:opacity-40 shrink-0"
                >
                  <Download className="w-4 h-4 text-[#00F0A0]" />
                  <span>{exportingCSV ? 'Generating CSV...' : 'Export CSV'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#18241E] text-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#9CA3AF]">Status Filter:</span>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      status: e.target.value as 'all' | RegistrationStatus,
                      page: 1,
                    })
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-[#080D0A] border border-[#18241E] text-white text-xs outline-none"
                >
                  <option value="all">All Door Passes</option>
                  <option value="registered">Registered</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="attended">Attended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </section>

            <section className="bg-[#0A0E0C]/90 border border-[#18241E] rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#18241E] bg-[#080D0A] text-[#9CA3AF] uppercase font-mono tracking-wider text-[10px]">
                      <th className="py-4 px-4 font-normal">Reference ID</th>
                      <th className="py-4 px-4 font-normal">Guest Name</th>
                      <th className="py-4 px-4 font-normal">Email</th>
                      <th className="py-4 px-4 font-normal">Phone</th>
                      <th className="py-4 px-4 font-normal">Status</th>
                      <th className="py-4 px-4 font-normal">Registered Date</th>
                      <th className="py-4 px-4 font-normal text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18241E] font-sans">
                    {loadingData ? (
                      <tr>
                        <td colSpan={7} className="py-14 text-center text-[#9CA3AF]">
                          <RefreshCw className="w-6 h-6 text-[#00F0A0] animate-spin mx-auto mb-2" />
                          <span>Retrieving records...</span>
                        </td>
                      </tr>
                    ) : registrations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-14 text-center text-[#9CA3AF]">
                          No records found.
                        </td>
                      </tr>
                    ) : (
                      registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#00F0A0] font-medium">
                            {reg.reference_id}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-white">
                            {reg.full_name}
                          </td>
                          <td className="py-3.5 px-4 text-[#9CA3AF]">
                            {reg.email}
                          </td>
                          <td className="py-3.5 px-4 text-[#9CA3AF]">
                            {reg.phone || '—'}
                          </td>
                          <td className="py-3.5 px-4">
                            {getStatusBadge(reg.registration_status)}
                          </td>
                          <td className="py-3.5 px-4 text-[#9CA3AF] text-[11px]">
                            {new Date(reg.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedRecord(reg);
                                  setActionStatus(reg.registration_status);
                                  setActionNotes(reg.notes || '');
                                }}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-[#9CA3AF] hover:text-[#00F0A0] transition-colors"
                                title="View & Update Pass Status"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setRecordToDelete(reg)}
                                className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                title="Delete Registration"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Registrations Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#18241E] text-xs text-[#9CA3AF]">
                  <span className="font-mono text-[11px]">
                    Page {filters.page} of {totalPages} ({totalCount} total passes)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={filters.page <= 1}
                      onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                      className="p-1.5 rounded-lg border border-[#18241E] bg-[#101713] text-[#9CA3AF] hover:text-white disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={filters.page >= totalPages}
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                      className="p-1.5 rounded-lg border border-[#18241E] bg-[#101713] text-[#9CA3AF] hover:text-white disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 6: EDITABLE SITE SETTINGS & CONFIGURATION */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Feedback Banners inside Settings Tab */}
            {settingsSaveSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-[#00F0A0]/40 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00F0A0] shrink-0" />
                  <span>{settingsSaveSuccess}</span>
                </div>
                <button onClick={() => setSettingsSaveSuccess(null)} className="text-emerald-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {settingsSaveError && (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{settingsSaveError}</span>
                </div>
                <button onClick={() => setSettingsSaveError(null)} className="text-red-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Supabase migration helper if table not yet found in schema cache */}
            {settingsMissingTable && (
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-[#00F0A0]/30 text-xs font-sans text-[#F9FAFB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#101713] border border-[#1E3327] flex items-center justify-center text-[#00F0A0] shrink-0 mt-0.5">
                    <Database className="w-4 h-4 text-[#00F0A0]" />
                  </div>
                  <div>
                    <strong className="text-white block font-display uppercase tracking-wider text-[11px]">
                      Supabase Cloud Table Pending
                    </strong>
                    <p className="text-[#9CA3AF] mt-0.5 leading-relaxed">
                      Your changes are currently persisting in real-time local cache and active across all public pages. To persist in cloud PostgreSQL with RLS, run <code className="text-[#00F0A0] bg-black/50 px-1.5 py-0.5 rounded font-mono">09_create_site_settings.sql</code> in your Supabase SQL editor.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Editable Site Settings Form */}
            <form onSubmit={handleSaveSiteSettings} className="bg-[#0A0E0C]/90 border border-[#18241E] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#18241E]">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#00F0A0] block">
                    Public Identity &amp; Information
                  </span>
                  <h3 className="font-display text-2xl text-white uppercase font-bold mt-0.5">
                    Global Site Settings
                  </h3>
                  <p className="font-sans text-xs text-[#9CA3AF] mt-1 font-light">
                    Update shared brand attributes, contact channels, operating regions, and venue policies.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReloadSiteSettings}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#101713] border border-[#1E3327] hover:border-[#05D38A]/40 text-[#9CA3AF] hover:text-white text-xs font-display uppercase tracking-wider transition-all"
                    title="Reload latest settings from storage"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reload</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetSiteSettingsDefaults}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#101713] border border-[#1E3327] hover:border-red-500/40 text-[#9CA3AF] hover:text-red-300 text-xs font-display uppercase tracking-wider transition-all"
                    title="Restore canonical NOIR default values"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reset Defaults</span>
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
                
                {/* Section 1: Platform & Identity */}
                <div className="p-6 rounded-2xl bg-[#080D0A] border border-[#18241E] space-y-4">
                  <div className="flex items-center gap-2 text-white font-display uppercase tracking-wider text-xs pb-2 border-b border-[#18241E]">
                    <Globe className="w-4 h-4 text-[#00F0A0]" />
                    <span>Brand &amp; Identity</span>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.brandName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                      placeholder="e.g. NOIR EVENTS"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050706] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Brand Subtitle / Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.brandTagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, brandTagline: e.target.value })}
                      placeholder="e.g. THE ART OF EXCLUSIVE NIGHTLIFE"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050706] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Operating Region / Venues *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.operatingRegion}
                      onChange={(e) => setSettingsForm({ ...settingsForm, operatingRegion: e.target.value })}
                      placeholder="e.g. Sector 26 Nightlife Hub & Madhya Marg, Chandigarh, India"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050706] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] uppercase tracking-wider text-[10px] font-semibold mb-1">
                      City &amp; State Label *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.cityState}
                      onChange={(e) => setSettingsForm({ ...settingsForm, cityState: e.target.value })}
                      placeholder="e.g. Chandigarh, India"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050706] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs transition-all"
                    />
                  </div>
                </div>

                {/* Section 2: Contact Channels */}
                <div className="p-6 rounded-2xl bg-[#080D0A] border border-[#18241E] space-y-4">
                  <div className="flex items-center gap-2 text-white font-display uppercase tracking-wider text-xs pb-2 border-b border-[#18241E]">
                    <Phone className="w-4 h-4 text-[#00F0A0]" />
                    <span>Contact &amp; Concierge</span>
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Official Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={settingsForm.contactEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                      placeholder="e.g. noirchd@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050706] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Official Contact Phone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.contactPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                      placeholder="e.g. +91 81685 11261"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050706] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Instagram Handle *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.instagramHandle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                      placeholder="e.g. @noir.chd"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050706] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[#9CA3AF] uppercase tracking-wider text-[10px] font-semibold mb-1">
                      Instagram Profile URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={settingsForm.instagramUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                      placeholder="e.g. https://www.instagram.com/noir.chd/"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050706] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs transition-all"
                    />
                  </div>
                </div>

                {/* Section 3: Operations & Policy (Full Width) */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-[#080D0A] border border-[#18241E] space-y-4">
                  <div className="flex items-center gap-2 text-white font-display uppercase tracking-wider text-xs pb-2 border-b border-[#18241E]">
                    <Shield className="w-4 h-4 text-[#00F0A0]" />
                    <span>Operating Hours &amp; Admission Protocol</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#9CA3AF] uppercase tracking-wider text-[10px] font-semibold mb-1">
                        Concierge Operating Hours *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.operatingHours}
                        onChange={(e) => setSettingsForm({ ...settingsForm, operatingHours: e.target.value })}
                        placeholder="e.g. Daily: 12:00 PM — 02:00 AM IST"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#050706] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[#9CA3AF] uppercase tracking-wider text-[10px] font-semibold mb-1">
                        Admission &amp; Age Policy Text *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={settingsForm.admissionPolicy}
                        onChange={(e) => setSettingsForm({ ...settingsForm, admissionPolicy: e.target.value })}
                        placeholder="Detail the strict 21+ and zero-tolerance policy..."
                        className="w-full px-3.5 py-2 rounded-xl bg-[#050706] border border-[#18241E] focus:border-[#00F0A0] focus:ring-1 focus:ring-[#00F0A0] outline-none text-white text-xs resize-none transition-all"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit Action */}
              <div className="pt-4 border-t border-[#18241E] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-[#9CA3AF] font-light">
                  Changes save immediately and sync live across Contact, About, Footer, and Navigation.
                </span>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl btn-emerald-primary text-xs font-display uppercase tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(0,240,160,0.25)] transition-all disabled:opacity-50"
                >
                  {savingSettings ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#04140B]" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-[#04140B]" />
                      <span>Save All Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* System Diagnostic & Security Panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
              
              {/* Panel 1: Database Status */}
              <div className="p-5 rounded-2xl bg-[#0A0E0C]/90 border border-[#18241E] space-y-3">
                <h4 className="font-display text-xs uppercase tracking-[0.2em] text-[#00F0A0] font-semibold flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#00F0A0]" />
                  <span>Database State</span>
                </h4>
                <div className="space-y-2 text-[#9CA3AF]">
                  <div className="flex justify-between py-1 border-b border-[#18241E]">
                    <span>Provider:</span>
                    <span className="text-white font-mono">Supabase PostgreSQL 15</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#18241E]">
                    <span>RLS Protected:</span>
                    <span className="text-[#00F0A0] font-mono">Active (All Schemas)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Connection:</span>
                    <span className={isLocalMode ? 'text-amber-400 font-mono' : 'text-[#00F0A0] font-mono'}>
                      {isLocalMode ? 'Local Failover Mode' : 'Cloud PostgreSQL Connected'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Panel 2: Active Admin Session */}
              <div className="p-5 rounded-2xl bg-[#0A0E0C]/90 border border-[#18241E] space-y-3">
                <h4 className="font-display text-xs uppercase tracking-[0.2em] text-[#00F0A0] font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-[#00F0A0]" />
                  <span>Operator Session</span>
                </h4>
                <div className="space-y-2 text-[#9CA3AF]">
                  <div className="flex justify-between py-1 border-b border-[#18241E]">
                    <span>Email:</span>
                    <span className="text-white font-mono truncate max-w-[170px]">{user?.email || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#18241E]">
                    <span>Session UUID:</span>
                    <span className="text-[#9CA3AF] font-mono text-[10px] truncate max-w-[170px]">{user?.id || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Authorization:</span>
                    <span className="text-[#00F0A0] font-semibold">Authorized Administrator</span>
                  </div>
                </div>
              </div>

              {/* Panel 3: Sync & Quick Actions */}
              <div className="p-5 rounded-2xl bg-[#0A0E0C]/90 border border-[#18241E] space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-display text-xs uppercase tracking-[0.2em] text-[#00F0A0] font-semibold flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-4 h-4 text-[#00F0A0]" />
                    <span>Data Synchronization</span>
                  </h4>
                  <p className="text-[11px] text-[#9CA3AF] leading-relaxed font-light">
                    Force-refresh and synchronize all metrics, events, enquiries, and user lists from Supabase.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      loadStats();
                      loadEvents();
                      loadEnquiries();
                      loadUsers();
                      loadRegistrations();
                      setFeedbackSuccess('All system data caches refreshed.');
                      setTimeout(() => setFeedbackSuccess(null), 3000);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#101713] border border-[#1E3327] hover:border-[#00F0A0]/40 text-[#00F0A0] text-xs font-display uppercase tracking-wider flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Data</span>
                  </button>

                  <Link
                    to="/"
                    className="px-3.5 py-2 rounded-xl bg-[#101713] border border-[#1E3327] hover:border-[#05D38A]/40 text-[#9CA3AF] hover:text-white text-xs font-display uppercase tracking-wider flex items-center gap-1.5 transition-all"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Website</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* CREATE / EDIT EVENT MODAL */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-[#17191E] border border-[#343A43] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F2F0EB] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#343A43] mb-5">
              <h3 className="font-editorial text-2xl text-[#F2F0EB] uppercase font-light">
                {editingEvent ? 'Edit Showcase' : 'Create New Showcase'}
              </h3>
              <button
                onClick={() => setEventModalOpen(false)}
                className="text-[#7B8999] hover:text-[#F2F0EB] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {eventFormError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{eventFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEvent} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#C6CDD5] uppercase tracking-wider text-[10px] mb-1">
                    Showcase Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. Midnight Solstice"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] outline-none focus:border-[#C6CDD5] text-[#F2F0EB]"
                  />
                </div>

                <div>
                  <label className="block text-[#C6CDD5] uppercase tracking-wider text-[10px] mb-1">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    placeholder="e.g. Sector 26 Club District"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] outline-none focus:border-[#C6CDD5] text-[#F2F0EB]"
                  />
                </div>

                <div>
                  <label className="block text-[#C6CDD5] uppercase tracking-wider text-[10px] mb-1">
                    Chandigarh Location
                  </label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Sector 26, Chandigarh"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] outline-none focus:border-[#C6CDD5] text-[#F2F0EB]"
                  />
                </div>

                <div>
                  <label className="block text-[#C6CDD5] uppercase tracking-wider text-[10px] mb-1">
                    Music Genre
                  </label>
                  <input
                    type="text"
                    value={eventGenre}
                    onChange={(e) => setEventGenre(e.target.value)}
                    placeholder="Melodic Techno & Deep House"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] outline-none focus:border-[#C6CDD5] text-[#F2F0EB]"
                  />
                </div>

                <div>
                  <label className="block text-[#C6CDD5] uppercase tracking-wider text-[10px] mb-1">
                    Curators / DJs
                  </label>
                  <input
                    type="text"
                    value={eventArtist}
                    onChange={(e) => setEventArtist(e.target.value)}
                    placeholder="DJ Zora & Resident Guests"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] outline-none focus:border-[#C6CDD5] text-[#F2F0EB]"
                  />
                </div>

                <div>
                  <label className="block text-[#C6CDD5] uppercase tracking-wider text-[10px] mb-1">
                    Cover Charge / Pricing
                  </label>
                  <input
                    type="text"
                    value={eventCoverCharge}
                    onChange={(e) => setEventCoverCharge(e.target.value)}
                    placeholder="₹1,500 (Cover Charge Applicable)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] outline-none focus:border-[#C6CDD5] text-[#F2F0EB]"
                  />
                </div>

                <div>
                  <label className="block text-[#C6CDD5] uppercase tracking-wider text-[10px] mb-1">
                    Event Date &amp; Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] outline-none focus:border-[#C6CDD5] text-[#F2F0EB]"
                  />
                </div>

                <div>
                  <label className="block text-[#C6CDD5] uppercase tracking-wider text-[10px] mb-1">
                    End Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] outline-none focus:border-[#C6CDD5] text-[#F2F0EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#C6CDD5] uppercase tracking-wider text-[10px] mb-1">
                  Poster Image URL
                </label>
                <input
                  type="url"
                  value={eventPosterUrl}
                  onChange={(e) => setEventPosterUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] outline-none focus:border-[#C6CDD5] text-[#F2F0EB]"
                />
              </div>

              <div>
                <label className="block text-[#C6CDD5] uppercase tracking-wider text-[10px] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Detail the nocturnal soundscape, atmosphere, and schedule..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] outline-none focus:border-[#C6CDD5] text-[#F2F0EB] resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={eventIsFeatured}
                    onChange={(e) => setEventIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#C6CDD5]"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <div className="flex items-center gap-2 ml-auto text-xs">
                  <span className="text-[#7B8999] uppercase tracking-wider text-[10px]">Status:</span>
                  <select
                    value={eventStatus}
                    onChange={(e) => setEventStatus(e.target.value as EventStatus)}
                    className="px-3 py-1.5 rounded-lg bg-[#08090B] border border-[#343A43] text-[#F2F0EB]"
                  >
                    <option value="published">Published (Visible Publicly)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#343A43] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#343A43] text-[#7B8999] hover:text-[#F2F0EB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEvent}
                  className="px-6 py-2.5 rounded-xl bg-[#00F0A0] hover:bg-[#05D38A] text-[#050706] font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,160,0.25)] transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {savingEvent ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : editingEvent ? (
                    'Update Showcase'
                  ) : (
                    'Create Showcase'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW & UPDATE ENQUIRY MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-[#17191E] border border-[#343A43] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F2F0EB]">
            <div className="flex items-center justify-between pb-4 border-b border-[#343A43] mb-4">
              <div>
                <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C6CDD5] block">
                  Enquiry Details
                </span>
                <h3 className="font-editorial text-2xl text-[#F2F0EB] font-light">
                  {selectedEnquiry.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-[#7B8999] hover:text-[#F2F0EB]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="bg-[#08090B] p-4 rounded-xl border border-[#C6CDD5]/15 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#7B8999]">From:</span>
                  <span className="text-[#F2F0EB] font-medium">{selectedEnquiry.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7B8999]">Email:</span>
                  <span className="text-[#00A3DF]">{selectedEnquiry.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7B8999]">Submitted:</span>
                  <span className="text-[#7B8999]">{new Date(selectedEnquiry.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="text-[#C6CDD5] uppercase tracking-wider text-[10px] block mb-1">
                  Message Content:
                </span>
                <div className="p-3.5 rounded-xl bg-[#08090B] border border-[#C6CDD5]/15 text-[#F2F0EB] whitespace-pre-wrap leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div>
                <label className="block text-[#C6CDD5] uppercase tracking-wider text-[10px] mb-1">
                  Enquiry Status
                </label>
                <select
                  value={enquiryStatusVal}
                  onChange={(e) => setEnquiryStatusVal(e.target.value as EnquiryStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] text-[#F2F0EB]"
                >
                  <option value="pending">Pending Review</option>
                  <option value="in_progress">In Progress / Contacted</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-[#C6CDD5] uppercase tracking-wider text-[10px] mb-1">
                  Internal Administrative Notes
                </label>
                <textarea
                  rows={2}
                  value={enquiryNotesVal}
                  onChange={(e) => setEnquiryNotesVal(e.target.value)}
                  placeholder="Record internal steward follow-up notes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] text-[#F2F0EB] resize-none"
                />
              </div>
            </div>

            <div className="pt-5 border-t border-[#343A43] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl border border-[#343A43] text-[#7B8999] text-xs uppercase"
              >
                Close
              </button>
              <button
                type="button"
                disabled={updatingEnquiry}
                onClick={handleSaveEnquiry}
                className="px-5 py-2 rounded-xl bg-[#C6CDD5] text-[#08090B] text-xs uppercase font-semibold"
              >
                {updatingEnquiry ? 'Saving...' : 'Save Notes & Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE EVENT MODAL */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-[#17191E] border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F2F0EB]">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-400 mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl text-center uppercase tracking-wider text-[#F2F0EB]">
              Delete Showcase?
            </h3>
            <p className="text-xs text-[#7B8999] text-center my-3 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#F2F0EB]">"{eventToDelete.title}"</strong>? It will immediately disappear from the public website.
            </p>
            <div className="pt-4 border-t border-[#C6CDD5]/15 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={deletingEvent}
                onClick={() => setEventToDelete(null)}
                className="w-full py-2.5 rounded-xl border border-[#343A43] text-[#7B8999] hover:text-[#F2F0EB] text-xs uppercase transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingEvent}
                onClick={handleConfirmDeleteEvent}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs uppercase font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingEvent ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE ENQUIRY MODAL */}
      {enquiryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-[#17191E] border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F2F0EB]">
            <h3 className="font-editorial text-xl text-center uppercase tracking-wider text-[#F2F0EB]">
              Delete Contact Enquiry?
            </h3>
            <p className="text-xs text-[#7B8999] text-center my-3 leading-relaxed">
              Are you sure you want to delete the enquiry from <strong className="text-[#F2F0EB]">{enquiryToDelete.full_name}</strong>?
            </p>
            <div className="pt-4 border-t border-[#C6CDD5]/15 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setEnquiryToDelete(null)}
                className="w-full py-2.5 rounded-xl border border-[#343A43] text-[#7B8999] text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteEnquiry}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs uppercase font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTRATION DETAIL MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-[#17191E] border border-[#343A43] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F2F0EB]">
            <div className="flex items-center justify-between pb-4 border-b border-[#343A43]">
              <div>
                <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C6CDD5]">
                  Admission Record
                </span>
                <h3 className="font-editorial text-2xl text-[#F2F0EB]">
                  {selectedRecord.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-[#7B8999] hover:text-[#F2F0EB]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3 bg-[#08090B] p-4 rounded-xl border border-[#C6CDD5]/15">
                <div>
                  <span className="text-[#7B8999] text-[10px] uppercase tracking-wider block">Reference Pass</span>
                  <span className="text-[#C6CDD5] font-mono font-medium text-sm">{selectedRecord.reference_id}</span>
                </div>
                <div>
                  <span className="text-[#7B8999] text-[10px] uppercase tracking-wider block">Email</span>
                  <span className="text-[#F2F0EB] truncate block">{selectedRecord.email}</span>
                </div>
                <div>
                  <span className="text-[#7B8999] text-[10px] uppercase tracking-wider block">Phone</span>
                  <span className="text-[#F2F0EB]">{selectedRecord.phone || '—'}</span>
                </div>
                <div>
                  <span className="text-[#7B8999] text-[10px] uppercase tracking-wider block">Registered At</span>
                  <span className="text-[#7B8999]">{new Date(selectedRecord.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C6CDD5] mb-1.5">
                  Update Status
                </label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value as RegistrationStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] text-[#F2F0EB] text-xs outline-none"
                >
                  <option value="registered">Registered</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="attended">Attended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#C6CDD5] mb-1.5">
                  Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090B] border border-[#343A43] text-[#F2F0EB] text-xs resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#343A43] flex items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setRecordToDelete(selectedRecord)}
                className="px-3.5 py-2 rounded-xl border border-red-500/30 text-red-400 text-xs uppercase flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 rounded-xl border border-[#343A43] text-[#7B8999] text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={handleSaveRegistrationStatus}
                  className="px-5 py-2 rounded-xl bg-[#C6CDD5] text-[#08090B] text-xs uppercase font-medium"
                >
                  {updatingStatus ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE REGISTRATION RECORD MODAL */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-[#17191E] border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F2F0EB]">
            <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-400 mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl text-center uppercase tracking-wider text-[#F2F0EB]">
              Delete Admission Record?
            </h3>
            <div className="my-4 p-3.5 bg-[#08090B] rounded-xl border border-red-500/20 text-xs space-y-1.5 font-sans">
              <div className="flex justify-between">
                <span className="text-[#7B8999]">Reference:</span>
                <span className="text-[#C6CDD5] font-mono">{recordToDelete.reference_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7B8999]">Guest:</span>
                <span className="text-[#F2F0EB] font-semibold">{recordToDelete.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7B8999]">Email:</span>
                <span className="text-[#7B8999]">{recordToDelete.email}</span>
              </div>
            </div>
            <p className="text-xs text-[#7B8999] text-center mb-5 leading-relaxed">
              Are you sure you want to permanently delete this registration record? This action cannot be undone.
            </p>
            <div className="pt-4 border-t border-[#C6CDD5]/15 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={deletingRegistration}
                onClick={() => setRecordToDelete(null)}
                className="w-full py-2.5 rounded-xl border border-[#343A43] text-[#7B8999] text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingRegistration}
                onClick={handleConfirmDeleteRegistration}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs uppercase font-semibold flex items-center justify-center gap-2"
              >
                {deletingRegistration ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERMANENT USER ACCOUNT DELETION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-[#17191E] border border-red-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F2F0EB]">
            <div className="w-14 h-14 rounded-full bg-red-950/70 border border-red-500/60 flex items-center justify-center text-red-400 mb-4 mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <h3 className="font-editorial text-2xl text-center uppercase tracking-wider text-red-200">
              Permanently Delete User Account?
            </h3>

            <div className="my-4 p-4 rounded-xl bg-[#08090B] border border-red-500/30 text-xs space-y-2 font-sans">
              <div className="flex justify-between">
                <span className="text-[#7B8999]">Full Name:</span>
                <span className="text-[#F2F0EB] font-semibold">{userToDelete.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7B8999]">Account Email:</span>
                <span className="text-[#C6CDD5] font-mono">{userToDelete.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7B8999]">User UUID:</span>
                <span className="text-[#7B8999] font-mono text-[11px] truncate max-w-[220px]">{userToDelete.id}</span>
              </div>
            </div>

            <p className="text-[11px] text-red-300 leading-relaxed text-center mb-4 font-sans">
              This action will permanently delete this member from the Supabase Authentication service via the Admin API.
            </p>

            <div className="space-y-1.5 font-sans">
              <label className="block text-[11px] uppercase tracking-wider text-[#7B8999]">
                Type <strong className="text-red-400 font-mono">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="DELETE"
                disabled={deletingUser}
                className="w-full px-4 py-2.5 rounded-xl bg-[#08090B] border border-red-500/30 focus:border-red-500 text-red-200 font-mono text-sm uppercase tracking-widest outline-none"
              />
            </div>

            <div className="pt-5 border-t border-[#C6CDD5]/15 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={deletingUser}
                onClick={() => {
                  setUserToDelete(null);
                  setDeleteConfirmationText('');
                }}
                className="w-full py-3 rounded-xl border border-[#343A43] text-[#7B8999] font-sans text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingUser || deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
                onClick={handleConfirmDeleteUser}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-sans text-xs uppercase tracking-wider font-semibold disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {deletingUser ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting from Auth...</span>
                  </>
                ) : (
                  'Permanently Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full pt-6 border-t border-[#C6CDD5]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#7B8999] text-[10px] tracking-wider uppercase">
        <p>NOIR EVENTS • PRIVATE ADMINISTRATIVE SUITE • CHANDIGARH, INDIA</p>
        <p>STRICT ZERO-TOLERANCE DRUG POLICY ENFORCED</p>
      </footer>
    </div>
  );
};
