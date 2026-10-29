import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | { id: string; email: string } | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  isLocalMode: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LOCAL_AUTH_KEY = 'noir_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { id: string; email: string } | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check admin role in Supabase
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
      return !!data && (data.role === 'admin' || data.role === 'superadmin');
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check local test session
      const saved = localStorage.getItem(LOCAL_AUTH_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          setIsAdmin(true);
        } catch {
          localStorage.removeItem(LOCAL_AUTH_KEY);
        }
      }
      setIsLoading(false);
      return;
    }

    // Live Supabase Auth
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error || !initialSession?.user) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        } else {
          setSession(initialSession);
          setUser(initialSession.user);
          const authorized = await checkAdminStatus(initialSession.user.id);
          setIsAdmin(authorized);
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
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim();

    // If Supabase is not yet configured, allow immediate administrative sign-in for preview/testing
    if (!isSupabaseConfigured) {
      if (cleanEmail && password.length >= 4) {
        const localUser = { id: 'admin-local-master', email: cleanEmail };
        setUser(localUser);
        setIsAdmin(true);
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser));
        return { success: true };
      }
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    // Live Supabase Authentication
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Authentication failed. Please check credentials.' };
      }

      const isAuthorizedAdmin = await checkAdminStatus(data.user.id);
      if (!isAuthorizedAdmin) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Access denied. This account does not possess administrator privileges.',
        };
      }

      setIsAdmin(true);
      setUser(data.user);
      setSession(data.session);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed unexpectedly.';
      return { success: false, error: message };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error during signOut:', err);
      }
    } else {
      localStorage.removeItem(LOCAL_AUTH_KEY);
    }
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        isLocalMode: !isSupabaseConfigured,
        signIn,
        signOut,
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
