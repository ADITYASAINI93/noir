import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AdminUserRecord {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  instagram_handle?: string | null;
  gender?: string | null;
  created_at: string;
  last_sign_in_at?: string | null;
  is_admin: boolean;
  admin_role?: string | null;
}

const LOCAL_USERS_KEY = 'noir_admin_mock_users';

function getLocalUsers(): AdminUserRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  const initialMock: AdminUserRecord[] = [
    {
      id: 'admin-master-001',
      email: 'admin@noirevents.com',
      full_name: 'NOIR Chief Steward',
      phone: '+91 98765 00000',
      instagram_handle: '@noir.chd',
      gender: 'Prefer not to say',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      is_admin: true,
      admin_role: 'admin',
    },
    {
      id: 'member-002',
      email: 'kabir.sharma@example.com',
      full_name: 'Kabir Sharma',
      phone: '+91 98111 22334',
      instagram_handle: '@kabir_noir',
      gender: 'Male',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      is_admin: false,
    },
    {
      id: 'member-003',
      email: 'aanya.mehta@example.com',
      full_name: 'Aanya Mehta',
      phone: '+91 98222 33445',
      instagram_handle: '@aanya.m',
      gender: 'Female',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      is_admin: false,
    },
  ];

  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initialMock));
  } catch {
    // ignore
  }

  return initialMock;
}

/**
 * Fetch all user accounts for administrator review
 */
export async function fetchAdminUsers(): Promise<AdminUserRecord[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('admin-manage-users', {
        body: { action: 'list' },
      });

      if (!error && data?.users && Array.isArray(data.users)) {
        return data.users as AdminUserRecord[];
      }
    } catch (edgeErr) {
      console.warn('Edge Function admin-manage-users list unavailable, falling back:', edgeErr);
    }

    // Fallback: Query admin_users and combine with authenticated user
    try {
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('user_id, role, created_at');

      const { data: { user: currentUser } } = await supabase.auth.getUser();

      const adminUsersList: AdminUserRecord[] = [];
      if (currentUser) {
        const meta = currentUser.user_metadata || {};
        const isAdm = (adminData || []).some((a) => a.user_id === currentUser.id);
        adminUsersList.push({
          id: currentUser.id,
          email: currentUser.email || '',
          full_name: (meta.full_name as string) || currentUser.email?.split('@')[0] || 'Administrator',
          phone: (meta.phone as string) || null,
          instagram_handle: (meta.instagram_handle as string) || null,
          gender: (meta.gender as string) || null,
          created_at: currentUser.created_at,
          last_sign_in_at: currentUser.last_sign_in_at || null,
          is_admin: isAdm,
          admin_role: isAdm ? 'admin' : null,
        });
      }

      // Also discover any registered user_ids from registrations table
      const { data: regUsers } = await supabase
        .from('registrations')
        .select('user_id, full_name, email, phone, instagram_handle, gender, created_at')
        .not('user_id', 'is', null);

      if (regUsers && regUsers.length > 0) {
        const seen = new Set(adminUsersList.map((u) => u.id));
        for (const r of regUsers) {
          if (r.user_id && !seen.has(r.user_id)) {
            seen.add(r.user_id);
            adminUsersList.push({
              id: r.user_id,
              email: r.email,
              full_name: r.full_name,
              phone: r.phone || null,
              instagram_handle: r.instagram_handle || null,
              gender: r.gender || null,
              created_at: r.created_at,
              is_admin: false,
            });
          }
        }
      }

      return adminUsersList;
    } catch (fallbackErr) {
      console.error('Error fetching admin users fallback:', fallbackErr);
    }
  }

  return getLocalUsers();
}

/**
 * Permanently delete a user account via secure backend Edge Function (Supabase Auth Admin API)
 */
export async function deleteAdminUser(
  targetUserId: string
): Promise<{ success: boolean; message?: string }> {
  if (!targetUserId) {
    throw new Error('Target user ID is required.');
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.functions.invoke('admin-manage-users', {
      body: { action: 'delete', targetUserId },
    });

    if (error) {
      throw new Error(error.message || 'Server error occurred during account deletion.');
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    return {
      success: true,
      message: data?.message || 'User account permanently deleted.',
    };
  }

  // Local storage mode
  const all = getLocalUsers();
  const filtered = all.filter((u) => u.id !== targetUserId);
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }

  return {
    success: true,
    message: 'User account removed from local directory.',
  };
}
