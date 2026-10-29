import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseUrl.startsWith('https://') &&
    supabasePublishableKey &&
    supabasePublishableKey.length > 10
);

if (!isSupabaseConfigured) {
  console.warn(
    '[NOIR CHD] Supabase credentials not found or incomplete. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env.local file.'
  );
}

// Fallback dummy credentials to prevent createClient from throwing if env is unset during build
const clientUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const clientKey = isSupabaseConfigured ? supabasePublishableKey : 'placeholder-anon-key';

export const REMEMBER_ME_KEY = 'noir_remember_me';

/**
 * Storage adapter for the single Supabase client.
 * Dynamically switches between localStorage (Remember Me = true)
 * and sessionStorage (Remember Me = false).
 */
export const dynamicAuthStorage = {
  getItem: (key: string): string | null => {
    try {
      const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) !== 'false';
      if (rememberMe) {
        return localStorage.getItem(key);
      }
      return sessionStorage.getItem(key) || localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) !== 'false';
      if (rememberMe) {
        localStorage.setItem(key, value);
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, value);
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('[NOIR CHD] Failed to write auth session storage:', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (e) {
      console.warn('[NOIR CHD] Failed to clear auth session storage:', e);
    }
  },
};

export const supabase = createClient(clientUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: dynamicAuthStorage,
  },
});
