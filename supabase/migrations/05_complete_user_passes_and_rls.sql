-- ==============================================================================
-- NOIR EVENTS — Complete Schema Migration: User Passes, RLS & Profiles
-- Migration: 05_complete_user_passes_and_rls.sql
-- Run this script in your Supabase Project: Dashboard > SQL Editor > New Query
-- ==============================================================================

-- 1. Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Add user_id and event columns to public.registrations
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('Male', 'Female', 'Non-Binary', 'Prefer not to say')),
  ADD COLUMN IF NOT EXISTS event_name TEXT DEFAULT 'NOIR — Chandigarh After Dark',
  ADD COLUMN IF NOT EXISTS event_date TEXT DEFAULT 'December 2026',
  ADD COLUMN IF NOT EXISTS venue TEXT DEFAULT 'Chandigarh, India';

-- 3. Create high-performance lookup indexes
CREATE INDEX IF NOT EXISTS idx_registrations_user_id 
  ON public.registrations(user_id);

CREATE INDEX IF NOT EXISTS idx_registrations_user_email 
  ON public.registrations(user_id, lower(email));

CREATE INDEX IF NOT EXISTS idx_registrations_email_lower 
  ON public.registrations(lower(email));

-- 4. Enable Row Level Security (RLS) on registrations
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 5. Drop any existing conflicting policies
DROP POLICY IF EXISTS "Public can submit registration" ON public.registrations;
DROP POLICY IF EXISTS "Authorized admins can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Users can view own registrations" ON public.registrations;
DROP POLICY IF EXISTS "Users can view own registrations by email" ON public.registrations;
DROP POLICY IF EXISTS "Authorized admins can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Authorized admins can delete registrations" ON public.registrations;

-- Policy A: INSERT access for visitors and signed-in guests
CREATE POLICY "Public can submit registration"
  ON public.registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    registration_status = 'registered'
    AND length(trim(full_name)) >= 2
    AND length(trim(email)) >= 5
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

-- Policy B: SELECT access — Authenticated users can view ONLY their own passes
-- Matching either their authenticated UUID (user_id = auth.uid()) OR their verified token email.
-- Authorized administrators retain full view access through is_admin().
CREATE POLICY "Users can view own registrations"
  ON public.registrations
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR lower(email) = lower(auth.jwt() ->> 'email') 
    OR public.is_admin()
  );

-- Policy C: UPDATE access strictly for administrators
CREATE POLICY "Authorized admins can update registrations"
  ON public.registrations
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy D: DELETE access strictly for administrators
CREATE POLICY "Authorized admins can delete registrations"
  ON public.registrations
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 6. Event-aware active duplicate registration prevention
-- Allows guests to register for different events while preventing duplicate passes for the same event
DROP INDEX IF EXISTS idx_registrations_user_active;
DROP INDEX IF EXISTS idx_registrations_email_active;
DROP INDEX IF EXISTS idx_registrations_user_event_active;
DROP INDEX IF EXISTS idx_registrations_email_event_active;

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_user_event_active 
  ON public.registrations(user_id, coalesce(event_name, 'main_event')) 
  WHERE registration_status != 'cancelled' AND user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email_event_active 
  ON public.registrations(lower(email), coalesce(event_name, 'main_event')) 
  WHERE registration_status != 'cancelled';

-- 7. Secure RPC function to retroactively claim guest passes
-- Safely associates previous registrations that were made before creating an account
CREATE OR REPLACE FUNCTION public.claim_guest_registrations()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated INT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN 0;
  END IF;

  UPDATE public.registrations
  SET user_id = auth.uid()
  WHERE user_id IS NULL
    AND lower(email) = lower(auth.jwt() ->> 'email');

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_guest_registrations() TO authenticated;

-- 8. Ensure profiles table exists for guest accounts
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  instagram_handle TEXT,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Non-Binary', 'Prefer not to say')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Automatically create profile row when new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, instagram_handle, gender)
  VALUES (
    NEW.id,
    coalesce(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'instagram_handle',
    NEW.raw_user_meta_data->>'gender'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
