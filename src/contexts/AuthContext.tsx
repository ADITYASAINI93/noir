import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, REMEMBER_ME_KEY } from '../lib/supabase';
import { UserProfile } from '../types/registration';

interface AuthContextType {
  user: User | { id: string; email: string; user_metadata?: Record<string, unknown> } | null;
  session: Session | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isLocalMode: boolean;
  sessionExpired: boolean;
  clearSessionExpiredBanner: () => void;
  signInWithPassword: (
    email: string,
    password: string,
    rememberMe?: boolean,
    expectedRole?: 'guest' | 'admin'
  ) => Promise<{ success: boolean; error?: string }>;
  signUpWithPassword: (
    email: string,
    password: string,
    fullName: string,
    phone?: string,
    instagramHandle?: string,
    rememberMe?: boolean
  ) => Promise<{
    success: boolean;
    sessionAvailable?: boolean;
    error?: string;
  }>;
  resetPasswordForEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUserPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  signOut: (isTimeout?: boolean) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LOCAL_AUTH_KEY = 'noir_admin_session';
const LOCAL_PROFILE_KEY = 'noir_user_profile';
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { id: string; email: string; user_metadata?: Record<string, unknown> } | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);

  const lastActivityRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<number | null>(null);

  // Check admin role in Supabase admin_users table
  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return false;
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error checking admin status:', error.message);
        return false;
      }
      return !!data && data.role === 'admin';
    } catch {
      return false;
    }
  };

  // Fetch or create user profile
  const fetchProfile = async (
    userId: string,
    userEmail: string,
    metadata?: { full_name?: string; phone?: string; instagram_handle?: string }
  ): Promise<UserProfile | null> => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
      return {
        id: userId,
        full_name: metadata?.full_name || userEmail.split('@')[0] || 'NOIR Guest',
        email: userEmail,
        phone: metadata?.phone || null,
        instagram_handle: metadata?.instagram_handle || null,
      };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Failed to load profile from database:', error.message);
      }

      if (data) {
        return data as UserProfile;
      }

      // If profile does not exist yet but metadata is provided, insert it
      if (metadata?.full_name) {
        const insertPayload = {
          id: userId,
          full_name: metadata.full_name,
          email: userEmail,
          phone: metadata.phone || null,
          instagram_handle: metadata.instagram_handle || null,
        };

        const { data: created, error: createErr } = await supabase
          .from('profiles')
          .insert([insertPayload])
          .select('*')
          .single();

        if (!createErr && created) {
          return created as UserProfile;
        }
      }

      return {
        id: userId,
        full_name: userEmail.split('@')[0] || 'NOIR Guest',
        email: userEmail,
      };
    } catch (err) {
      console.warn('Exception loading user profile:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user?.id && user.email) {
      const p = await fetchProfile(user.id, user.email);
      setProfile(p);
    }
  };

  const clearSessionExpiredBanner = () => {
    setSessionExpired(false);
  };

  const signOut = useCallback(
    async (isTimeout = false) => {
      if (isSupabaseConfigured) {
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.error('Error during signOut:', err);
        }
      } else {
        localStorage.removeItem(LOCAL_AUTH_KEY);
        localStorage.removeItem(LOCAL_PROFILE_KEY);
      }
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);

      if (isTimeout) {
        setSessionExpired(true);
      }
    },
    []
  );

  // Inactivity tracking
  const recordActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (sessionExpired) {
      setSessionExpired(false);
    }
  }, [sessionExpired]);

  useEffect(() => {
    if (!user) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    lastActivityRef.current = Date.now();

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'pointerdown'];
    let throttleTimeout: number | null = null;

    const handleUserInteraction = () => {
      if (!throttleTimeout) {
        throttleTimeout = window.setTimeout(() => {
          recordActivity();
          throttleTimeout = null;
        }, 1000);
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserInteraction, { passive: true });
    });

    timerIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        console.warn('[NOIR CHD] User session timed out after 30 minutes of inactivity.');
        signOut(true);
      }
    }, 15000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          console.warn('[NOIR CHD] Session timed out while tab was backgrounded.');
          signOut(true);
        } else {
          recordActivity();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [user, recordActivity, signOut]);

  // Initial session restoration
  useEffect(() => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(LOCAL_AUTH_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          setIsAdmin(parsed.id === 'admin-local-master');
          const savedProfile = localStorage.getItem(LOCAL_PROFILE_KEY);
          if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
          }
        } catch {
          localStorage.removeItem(LOCAL_AUTH_KEY);
        }
      }
      setIsLoading(false);
      return;
    }

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error || !initialSession?.user) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setProfile(null);
        } else {
          setSession(initialSession);
          setUser(initialSession.user);
          const authorized = await checkAdminStatus(initialSession.user.id);
          setIsAdmin(authorized);
          const p = await fetchProfile(initialSession.user.id, initialSession.user.email || '');
          setProfile(p);
        }
      } catch (e) {
        console.error('Failed to initialize auth session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const authorized = await checkAdminStatus(currentUser.id);
        setIsAdmin(authorized);
        const p = await fetchProfile(currentUser.id, currentUser.email || '');
        setProfile(p);
      } else {
        setIsAdmin(false);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Password-based Sign In for Guests and Admins
   */
  const signInWithPassword = async (
    email: string,
    password: string,
    rememberMe = true,
    expectedRole: 'guest' | 'admin' = 'guest'
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');
    } catch {
      // Ignored
    }

    if (!isSupabaseConfigured) {
      // Local preview mode
      if (password.length >= 4) {
        const isAdm = expectedRole === 'admin';
        const localUser = {
          id: isAdm ? 'admin-local-master' : `guest-${Date.now()}`,
          email: cleanEmail,
        };
        setUser(localUser);
        setIsAdmin(isAdm);
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser));

        const existingProfile = localStorage.getItem(LOCAL_PROFILE_KEY);
        if (existingProfile) {
          setProfile(JSON.parse(existingProfile));
        } else {
          setProfile({
            id: localUser.id,
            full_name: cleanEmail.split('@')[0],
            email: cleanEmail,
          });
        }
        return { success: true };
      }
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return {
            success: false,
            error: 'Invalid email or password. Please verify your credentials or select Sign Up.',
          };
        }
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Authentication could not be completed.' };
      }

      // Check admin authorization if signing into admin portal
      if (expectedRole === 'admin') {
        const isAuthorizedAdmin = await checkAdminStatus(data.user.id);
        if (!isAuthorizedAdmin) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Access denied. This account does not possess administrator privileges.',
          };
        }
        setIsAdmin(true);
      }

      setUser(data.user);
      setSession(data.session);

      const p = await fetchProfile(data.user.id, data.user.email || cleanEmail);
      setProfile(p);

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed unexpectedly.';
      return { success: false, error: message };
    }
  };

  /**
   * Password-based Sign Up for Guests
   */
  const signUpWithPassword = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string,
    instagramHandle?: string,
    rememberMe = true
  ): Promise<{
    success: boolean;
    sessionAvailable?: boolean;
    error?: string;
  }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone?.trim() || undefined;
    const cleanInsta = instagramHandle?.trim()
      ? (instagramHandle.startsWith('@') ? instagramHandle.trim() : `@${instagramHandle.trim()}`)
      : undefined;

    try {
      localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');
    } catch {
      // Ignored
    }

    if (!isSupabaseConfigured) {
      // Local preview mode
      const localUser = {
        id: `guest-${Date.now()}`,
        email: cleanEmail,
      };
      const mockProfile: UserProfile = {
        id: localUser.id,
        full_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone || null,
        instagram_handle: cleanInsta || null,
      };
      setUser(localUser);
      setIsAdmin(false);
      setProfile(mockProfile);
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser));
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(mockProfile));
      return { success: true, sessionAvailable: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone,
            instagram_handle: cleanInsta,
          },
        },
      });

      if (error) {
        const errorMsg = error.message || '';
        if (errorMsg.includes('User already registered') || errorMsg.includes('already exists')) {
          return {
            success: false,
            error: 'An account with this email address already exists. Please select Sign In.',
          };
        }

        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Registration failed. Please try again.' };
      }

      // Check if session was returned immediately
      if (data.session) {
        setUser(data.user);
        setSession(data.session);

        const p = await fetchProfile(data.user.id, cleanEmail, {
          full_name: cleanName,
          phone: cleanPhone,
          instagram_handle: cleanInsta,
        });
        setProfile(p);
        return { success: true, sessionAvailable: true };
      }

      // User created in Supabase without immediate session
      return {
        success: true,
        sessionAvailable: false,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed unexpectedly.';
      return { success: false, error: message };
    }
  };

  /**
   * Password Recovery: Send Password Reset Email via Supabase Auth
   */
  const resetPasswordForEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!isSupabaseConfigured) {
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send password recovery email.';
      return { success: false, error: msg };
    }
  };

  /**
   * Update password (used when clicking reset link)
   */
  const updateUserPassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password.';
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        isLoading,
        isLocalMode: !isSupabaseConfigured,
        sessionExpired,
        clearSessionExpiredBanner,
        signInWithPassword,
        signUpWithPassword,
        resetPasswordForEmail,
        updateUserPassword,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
