-- ==============================================================================
-- NOIR EVENTS — Link Guest Passes to User Accounts & Event Pass Schema
-- Migration: 04_link_passes_and_events.sql
-- ==============================================================================

-- 1. Ensure user_id, gender, event_name, event_date, and venue exist on registrations
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('Male', 'Female', 'Non-Binary', 'Prefer not to say')),
  ADD COLUMN IF NOT EXISTS event_name TEXT DEFAULT 'NOIR — Chandigarh After Dark',
  ADD COLUMN IF NOT EXISTS event_date TEXT DEFAULT 'December 2026',
  ADD COLUMN IF NOT EXISTS venue TEXT DEFAULT 'Chandigarh, India';

-- 2. Performance indexes for user lookups
CREATE INDEX IF NOT EXISTS idx_registrations_user_id 
  ON public.registrations(user_id);

CREATE INDEX IF NOT EXISTS idx_registrations_user_email 
  ON public.registrations(user_id, lower(email));

-- 3. Security Definer RPC function to allow authenticated users to securely claim/link
-- any prior guest registrations submitted with their verified email before creating an account
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

-- 4. Re-enforce Row Level Security (RLS) on registrations
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Drop and recreate the user-facing SELECT policy to ensure authenticated users
-- can view passes linked to their UUID OR matching their confirmed token email,
-- while authorized admins retain access through is_admin().
DROP POLICY IF EXISTS "Users can view own registrations" ON public.registrations;
DROP POLICY IF EXISTS "Users can view own registrations by email" ON public.registrations;

CREATE POLICY "Users can view own registrations"
  ON public.registrations
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR lower(email) = lower(auth.jwt() ->> 'email') 
    OR public.is_admin()
  );

-- 5. Prevent duplicate active registrations per event at database level
-- Allows users to register for different events in the future while blocking duplicates for the same event
DROP INDEX IF EXISTS idx_registrations_user_active;
DROP INDEX IF EXISTS idx_registrations_email_active;

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_user_event_active 
  ON public.registrations(user_id, coalesce(event_name, 'main_event')) 
  WHERE registration_status != 'cancelled' AND user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email_event_active 
  ON public.registrations(lower(email), coalesce(event_name, 'main_event')) 
  WHERE registration_status != 'cancelled';
