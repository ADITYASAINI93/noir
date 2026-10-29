import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Registration,
  RegistrationSubmission,
  RegistrationResponse,
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
 * Public Registration Submission
 */
export async function submitRegistration(
  payload: RegistrationSubmission
): Promise<RegistrationResponse> {
  const cleanName = payload.full_name.trim();
  const cleanEmail = payload.email.trim().toLowerCase();
  const cleanPhone = payload.phone?.trim() || null;
  const cleanInstagram = payload.instagram_handle?.trim().replace(/^@+/, '') || null;

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

    return {
      success: true,
      reference_id: registration.reference_id,
      full_name: registration.full_name ?? cleanName,
      email: registration.email ?? cleanEmail,
      phone: registration.phone ?? cleanPhone,
      instagram_handle:
        registration.instagram_handle ??
        (cleanInstagram ? `@${cleanInstagram}` : null),
      created_at: registration.created_at ?? new Date().toISOString(),
    };
  }

  // Fallback: Local database mode (ready to test and view immediately without waiting for API keys)
  const localRecords = getLocalRegistrations();
  const exists = localRecords.find(
    (r) => r.email.toLowerCase() === cleanEmail && r.registration_status !== 'cancelled'
  );

  if (exists) {
    throw new Error('A registration has already been submitted with this email address.');
  }

  const newRecord: Registration = {
    id: crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`,
    reference_id,
    full_name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    instagram_handle: cleanInstagram ? `@${cleanInstagram}` : null,
    registration_category: 'Guest',
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
    full_name: newRecord.full_name,
    email: newRecord.email,
    phone: newRecord.phone,
    instagram_handle: newRecord.instagram_handle,
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
 * Fetch registrations belonging to a specific authenticated guest by email
 */
export async function fetchUserRegistrations(email: string): Promise<Registration[]> {
  const cleanEmail = email.trim().toLowerCase();
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .ilike('email', cleanEmail)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching user registrations:', error);
      return [];
    }
    return (data as Registration[]) || [];
  }

  // Local storage mode
  return getLocalRegistrations().filter(
    (r) => r.email.toLowerCase() === cleanEmail
  );
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
