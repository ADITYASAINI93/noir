import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Registration,
  RegistrationSubmission,
  RegistrationResponse,
  UserProfile,
  DashboardStats,
  RegistrationFilters,
  RegistrationStatus,
} from '../types/registration';

const LOCAL_STORAGE_KEY = 'noir_chd_registrations_v1';

/**
 * Helper to generate a unique luxury reference ID: NOIR-XXXXXX
 */
export function generateReferenceId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `NOIR-${result}`;
}

/**
 * Local database storage helper (active when Supabase env keys are not yet provided)
 */
function getLocalRegistrations(): Registration[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalRegistrations(records: Registration[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to write to local storage:', err);
  }
}

/**
 * Cache an authenticated user's pass locally by their unique user UUID
 */
export function cacheUserPass(userId: string, pass: Registration): void {
  try {
    const key = `noir_user_passes_${userId}`;
    const raw = localStorage.getItem(key);
    const list: Registration[] = raw ? JSON.parse(raw) : [];
    const exists = list.some((p) => p.reference_id === pass.reference_id || (pass.id && p.id === pass.id));
    if (!exists) {
      list.unshift(pass);
      localStorage.setItem(key, JSON.stringify(list));
    }
  } catch (err) {
    console.warn('Failed to cache user pass:', err);
  }
}

/**
 * Retrieve cached passes belonging exclusively to a specific user UUID
 */
export function getUserCachedPasses(userId: string): Registration[] {
  try {
    const key = `noir_user_passes_${userId}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Public Registration Submission
 */
export async function submitRegistration(
  payload: RegistrationSubmission
): Promise<RegistrationResponse> {
  const cleanName = payload.full_name.trim();
  const cleanEmail = payload.email.trim().toLowerCase();
  const cleanPhone = payload.phone?.trim() || null;
  const cleanInstagram = payload.instagram_handle?.trim().replace(/^@+/, '') || null;
  const cleanGender = payload.gender || null;
  const cleanEventName = payload.event_name?.trim() || 'NOIR — Chandigarh After Dark';
  const cleanEventDate = payload.event_date?.trim() || 'December 2026';
  const cleanVenue = payload.venue?.trim() || 'Chandigarh, India';
  const userId = payload.user_id || null;

  // Validation
  if (cleanName.length < 2) {
    throw new Error('Please provide your full name (minimum 2 characters).');
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error('Please provide a valid email address.');
  }

  if (!payload.privacy_acknowledged) {
    throw new Error('You must acknowledge the event privacy and zero-tolerance drug policy to register.');
  }

  const reference_id = generateReferenceId();

  // If Supabase is configured, store directly in PostgreSQL
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.functions.invoke('register', {
      body: {
        full_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        instagram_handle: cleanInstagram
          ? `@${cleanInstagram}`
          : null,
        gender: cleanGender,
        event_name: cleanEventName,
        event_date: cleanEventDate,
        venue: cleanVenue,
        user_id: userId,
        privacy_acknowledged: payload.privacy_acknowledged,
      },
    });

    if (error) {
      let customErrorMsg = error.message;
      try {
        if ('context' in error && error.context) {
          const errBody = await (error as { context: Response }).context.json();
          if (errBody?.error) customErrorMsg = errBody.error;
        }
      } catch {
        // Fallback to error.message
      }
      throw new Error(
        customErrorMsg || 'Failed to submit registration. Please try again.'
      );
    }

    const registration = data?.registration ?? data;

    if (!data?.success || !registration?.reference_id) {
      throw new Error(
        data?.error || 'Registration failed. Please try again.'
      );
    }

    const result: RegistrationResponse = {
      success: true,
      reference_id: registration.reference_id,
      user_id: registration.user_id ?? userId,
      full_name: registration.full_name ?? cleanName,
      email: registration.email ?? cleanEmail,
      phone: registration.phone ?? cleanPhone,
      instagram_handle:
        registration.instagram_handle ??
        (cleanInstagram ? `@${cleanInstagram}` : null),
      gender: registration.gender ?? cleanGender,
      registration_category: registration.registration_category ?? 'Guest',
      event_name: registration.event_name ?? cleanEventName,
      event_date: registration.event_date ?? cleanEventDate,
      venue: registration.venue ?? cleanVenue,
      registration_status: registration.registration_status ?? 'registered',
      created_at: registration.created_at ?? new Date().toISOString(),
    };

    if (userId) {
      cacheUserPass(userId, {
        id: registration.id || `reg-${Date.now()}`,
        reference_id: result.reference_id,
        user_id: userId,
        full_name: result.full_name,
        email: result.email,
        phone: result.phone || null,
        instagram_handle: result.instagram_handle || null,
        gender: result.gender || null,
        registration_category: result.registration_category || 'Guest',
        event_name: result.event_name || 'NOIR — Chandigarh After Dark',
        event_date: result.event_date || 'December 2026',
        venue: result.venue || 'Chandigarh, India',
        registration_status: result.registration_status || 'registered',
        notes: null,
        created_at: result.created_at,
        updated_at: result.created_at,
      });
    }

    return result;
  }

  // Fallback: Local database mode
  const localRecords = getLocalRegistrations();
  const exists = localRecords.find(
    (r) =>
      ((userId && r.user_id === userId) || r.email.toLowerCase() === cleanEmail) &&
      (r.event_name || 'NOIR — Chandigarh After Dark').toLowerCase() === cleanEventName.toLowerCase() &&
      r.registration_status !== 'cancelled'
  );

  if (exists) {
    throw new Error("You're already on the guest list.");
  }

  const newRecord: Registration = {
    id: crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`,
    reference_id,
    user_id: userId,
    full_name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    instagram_handle: cleanInstagram ? `@${cleanInstagram}` : null,
    gender: cleanGender,
    registration_category: 'Guest',
    event_name: cleanEventName,
    event_date: cleanEventDate,
    venue: cleanVenue,
    registration_status: 'registered',
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localRecords.unshift(newRecord);
  saveLocalRegistrations(localRecords);

  return {
    success: true,
    reference_id: newRecord.reference_id,
    user_id: userId,
    full_name: newRecord.full_name,
    email: newRecord.email,
    phone: newRecord.phone,
    instagram_handle: newRecord.instagram_handle,
    gender: cleanGender,
    registration_category: 'Guest',
    event_name: cleanEventName,
    event_date: cleanEventDate,
    venue: cleanVenue,
    registration_status: 'registered',
    created_at: newRecord.created_at,
  };
}

/**
 * Fetch overview dashboard statistics from real data
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  let records: { registration_status: RegistrationStatus; created_at: string }[] = [];

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('registrations')
      .select('registration_status, created_at');

    if (error) {
      console.error('Error fetching dashboard statistics:', error);
      throw new Error('Failed to load dashboard statistics.');
    }
    records = (data || []) as { registration_status: RegistrationStatus; created_at: string }[];
  } else {
    records = getLocalRegistrations();
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let todayCount = 0;
  let registeredCount = 0;
  let confirmedCount = 0;
  let attendedCount = 0;
  let cancelledCount = 0;

  records.forEach((row) => {
    const itemDate = new Date(row.created_at).getTime();
    if (itemDate >= startOfToday) {
      todayCount++;
    }

    switch (row.registration_status) {
      case 'registered':
        registeredCount++;
        break;
      case 'confirmed':
        confirmedCount++;
        break;
      case 'attended':
        attendedCount++;
        break;
      case 'cancelled':
        cancelledCount++;
        break;
    }
  });

  return {
    total: records.length,
    today: todayCount,
    registered: registeredCount,
    confirmed: confirmedCount,
    attended: attendedCount,
    cancelled: cancelledCount,
  };
}

/**
 * Fetch registrations with filtering, search, sorting and pagination
 */
export async function fetchRegistrations(filters: RegistrationFilters): Promise<{
  data: Registration[];
  totalCount: number;
  totalPages: number;
}> {
  if (isSupabaseConfigured) {
    let query = supabase.from('registrations').select('*', { count: 'exact' });

    if (filters.status !== 'all') {
      query = query.eq('registration_status', filters.status);
    }

    const queryStr = filters.searchQuery.trim();
    if (queryStr) {
      query = query.or(
        `full_name.ilike.%${queryStr}%,email.ilike.%${queryStr}%,reference_id.ilike.%${queryStr}%,instagram_handle.ilike.%${queryStr}%`
      );
    }

    const ascending = filters.sortBy === 'oldest';
    query = query.order('created_at', { ascending });

    const from = (filters.page - 1) * filters.pageSize;
    const to = from + filters.pageSize - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) {
      throw new Error(error.message || 'Failed to retrieve registrations.');
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / filters.pageSize) || 1;

    return {
      data: (data as Registration[]) || [],
      totalCount,
      totalPages,
    };
  }

  // Local Storage Mode
  let all = getLocalRegistrations();

  if (filters.status !== 'all') {
    all = all.filter((r) => r.registration_status === filters.status);
  }

  const queryStr = filters.searchQuery.trim().toLowerCase();
  if (queryStr) {
    all = all.filter(
      (r) =>
        r.full_name.toLowerCase().includes(queryStr) ||
        r.email.toLowerCase().includes(queryStr) ||
        r.reference_id.toLowerCase().includes(queryStr) ||
        (r.instagram_handle && r.instagram_handle.toLowerCase().includes(queryStr))
    );
  }

  all.sort((a, b) => {
    const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return filters.sortBy === 'oldest' ? -diff : diff;
  });

  const totalCount = all.length;
  const totalPages = Math.ceil(totalCount / filters.pageSize) || 1;
  const from = (filters.page - 1) * filters.pageSize;
  const paged = all.slice(from, from + filters.pageSize);

  return {
    data: paged,
    totalCount,
    totalPages,
  };
}

/**
 * Fetch registrations belonging to a specific authenticated guest by user_id OR email
 */
export async function fetchUserRegistrations(
  email?: string,
  userId?: string
): Promise<Registration[]> {
  const cleanEmail = email?.trim().toLowerCase() || '';

  if (isSupabaseConfigured) {
    let records: Registration[] = [];
    let dbHasPasses = false;

    // 1. If user is authenticated, attempt to claim/link prior unlinked passes from this verified email
    if (userId) {
      try {
        await supabase.rpc('claim_guest_registrations');
      } catch {
        // Safe if RPC migration not applied yet
      }
    }

    // 2. Direct Supabase query (enforced by Row Level Security)
    try {
      let query = supabase.from('registrations').select('*').order('created_at', { ascending: false });

      if (userId && cleanEmail) {
        query = query.or(`user_id.eq.${userId},email.ilike.${cleanEmail}`);
      } else if (userId) {
        query = query.eq('user_id', userId);
      } else if (cleanEmail) {
        query = query.ilike('email', cleanEmail);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        records = data as Registration[];
        dbHasPasses = true;
      }
    } catch (directErr) {
      console.warn('Direct query for user passes notice:', directErr);
    }

    // 3. Fallback: Edge Function query using verified auth JWT
    // Allows signed-in guests to securely retrieve passes even if the RLS migration is pending
    if (records.length === 0) {
      try {
        const { data: fnData, error: fnErr } = await supabase.functions.invoke('register', {
          body: { action: 'get_user_passes' },
        });

        if (!fnErr && fnData?.registrations && Array.isArray(fnData.registrations) && fnData.registrations.length > 0) {
          records = fnData.registrations as Registration[];
          dbHasPasses = true;
        }
      } catch (fnErr) {
        console.warn('Edge function pass fetch notice:', fnErr);
      }
    }

    // 4. Merge with user-specific cached passes (preserves newly registered passes across reloads)
    if (userId) {
      const cached = getUserCachedPasses(userId);
      if (cached.length > 0) {
        const existingIds = new Set(records.map((r) => r.id || r.reference_id));
        for (const cp of cached) {
          if (!existingIds.has(cp.id || cp.reference_id)) {
            records.push(cp);
            existingIds.add(cp.id || cp.reference_id);
          }
        }
      }

      // If database confirmed passes, update cache
      if (dbHasPasses && records.length > 0) {
        try {
          localStorage.setItem(`noir_user_passes_${userId}`, JSON.stringify(records));
        } catch {}
      }
    }

    // Sort combined records descending by creation date
    records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return records;
  }

  // Local storage mode
  return getLocalRegistrations().filter((r) => {
    if (userId && r.user_id === userId) return true;
    if (cleanEmail && r.email.toLowerCase() === cleanEmail) return true;
    return false;
  });
}

/**
 * Check if the user already has an active (non-cancelled) guest registration for an event
 */
export async function checkUserActiveRegistration(
  userId?: string,
  email?: string,
  eventName?: string
): Promise<Registration | null> {
  const cleanEmail = email?.trim().toLowerCase() || '';
  const cleanEvent = eventName?.trim() || 'NOIR — Chandigarh After Dark';

  if (isSupabaseConfigured) {
    let query = supabase
      .from('registrations')
      .select('*')
      .neq('registration_status', 'cancelled');

    if (userId && cleanEmail) {
      query = query.or(`user_id.eq.${userId},email.ilike.${cleanEmail}`);
    } else if (userId) {
      query = query.eq('user_id', userId);
    } else if (cleanEmail) {
      query = query.ilike('email', cleanEmail);
    } else {
      return null;
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return null;
    }

    // Match by event name (or legacy records without event_name assigned)
    const match = (data as Registration[]).find((r) => {
      const rowEvent = r.event_name || 'NOIR — Chandigarh After Dark';
      return rowEvent.toLowerCase() === cleanEvent.toLowerCase();
    });

    return match || null;
  }

  // Local storage mode
  const found = getLocalRegistrations().find((r) => {
    if (r.registration_status === 'cancelled') return false;
    const matchesUser =
      (userId && r.user_id === userId) || (cleanEmail && r.email.toLowerCase() === cleanEmail);
    if (!matchesUser) return false;
    const rowEvent = r.event_name || 'NOIR — Chandigarh After Dark';
    return rowEvent.toLowerCase() === cleanEvent.toLowerCase();
  });

  return found || null;
}

/**
 * Update authenticated user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  if (isSupabaseConfigured) {
    const metaUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.full_name !== undefined) metaUpdates.full_name = updates.full_name.trim();
    if (updates.phone !== undefined) metaUpdates.phone = updates.phone ? updates.phone.trim() : null;
    if (updates.instagram_handle !== undefined) {
      metaUpdates.instagram_handle = updates.instagram_handle
        ? (updates.instagram_handle.startsWith('@') ? updates.instagram_handle.trim() : `@${updates.instagram_handle.trim()}`)
        : null;
    }
    if (updates.gender !== undefined) metaUpdates.gender = updates.gender || null;

    const { data, error } = await supabase.auth.updateUser({
      data: metaUpdates,
    });

    if (error) {
      throw new Error(error.message || 'Failed to update profile.');
    }

    const meta = (data.user?.user_metadata || {}) as Record<string, unknown>;
    return {
      id: data.user?.id || userId,
      email: data.user?.email || updates.email || '',
      full_name: (meta.full_name as string) || updates.full_name || 'Member',
      phone: (meta.phone as string) || updates.phone || null,
      instagram_handle: (meta.instagram_handle as string) || updates.instagram_handle || null,
      gender: (meta.gender as string) || updates.gender || null,
      updated_at: new Date().toISOString(),
    };
  }

  // Local storage mode
  const localProfKey = 'noir_user_profile';
  let profile: UserProfile = {
    id: userId,
    full_name: updates.full_name || 'NOIR Guest',
    email: updates.email || '',
    phone: updates.phone || null,
    instagram_handle: updates.instagram_handle || null,
    gender: updates.gender || null,
  };

  try {
    const existing = localStorage.getItem(localProfKey);
    if (existing) {
      profile = { ...JSON.parse(existing), ...updates, id: userId };
    }
    localStorage.setItem(localProfKey, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving local profile:', err);
  }

  return profile;
}

/**
 * Fetch all registrations for CSV export
 */
export async function fetchAllRegistrationsForExport(): Promise<Registration[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch records for CSV export.');
    }
    return (data as Registration[]) || [];
  }

  return getLocalRegistrations();
}

/**
 * Update registration status and optional notes
 */
export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
  notes?: string
): Promise<void> {
  if (isSupabaseConfigured) {
    const payload: { registration_status: RegistrationStatus; notes?: string } = {
      registration_status: status,
    };
    if (notes !== undefined) {
      payload.notes = notes;
    }
    const { error } = await supabase.from('registrations').update(payload).eq('id', id);
    if (error) {
      throw new Error(error.message || 'Failed to update registration status.');
    }
    return;
  }

  // Local Storage Mode
  const all = getLocalRegistrations();
  const idx = all.findIndex((r) => r.id === id);
  if (idx !== -1) {
    all[idx].registration_status = status;
    if (notes !== undefined) {
      all[idx].notes = notes;
    }
    all[idx].updated_at = new Date().toISOString();
    saveLocalRegistrations(all);
  }
}

/**
 * Permanently delete a registration record (Admin only)
 */
export async function deleteRegistration(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error, count } = await supabase
      .from('registrations')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) {
      throw new Error(error.message || 'Failed to delete registration record.');
    }

    if (count === 0) {
      console.warn('Registration was already deleted or not found:', id);
    }
    return;
  }

  // Local Storage Mode
  const all = getLocalRegistrations();
  const filtered = all.filter((r) => r.id !== id);
  saveLocalRegistrations(filtered);
}

/**
 * Export registrations as CSV
 */
export function downloadRegistrationsCSV(records: Registration[]): void {
  if (!records.length) {
    throw new Error('No registration records available to export.');
  }

  const headers = [
    'Reference ID',
    'Full Name',
    'Email Address',
    'Gender',
    'Instagram',
    'Phone',
    'Status',
    'Registered Date',
    'Admin Notes',
  ];

  const escapeCSV = (val: string | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const stringVal = String(val).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const rows = records.map((r) => [
    escapeCSV(r.reference_id),
    escapeCSV(r.full_name),
    escapeCSV(r.email),
    escapeCSV(r.gender || ''),
    escapeCSV(r.instagram_handle || ''),
    escapeCSV(r.phone || ''),
    escapeCSV(r.registration_status),
    escapeCSV(new Date(r.created_at).toLocaleString()),
    escapeCSV(r.notes || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  link.setAttribute('download', `NOIR-CHD-Registrations-${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
