-- ==============================================================================
-- NOIR CHD — Guest Registration Protection, Profile Management & Gender
-- Migration: 03_guest_protection_and_gender.sql
-- ==============================================================================

-- 1. Add user_id and gender columns to registrations
ALTER TABLE public.registrations 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('Male', 'Female', 'Non-Binary', 'Prefer not to say'));

-- 2. Add gender column to user profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('Male', 'Female', 'Non-Binary', 'Prefer not to say'));

-- 3. Prevent duplicate active registrations at database level (race-condition protection)
-- A user or email can only have one active (non-cancelled) guest registration
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_user_active 
  ON public.registrations(user_id) 
  WHERE registration_status != 'cancelled' AND user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_email_active 
  ON public.registrations(lower(email)) 
  WHERE registration_status != 'cancelled';

-- 4. Fast lookup index for user registrations
CREATE INDEX IF NOT EXISTS idx_registrations_user_id 
  ON public.registrations(user_id);

-- 5. Updated RLS policy: users can view registrations linked to their user_id OR email
DROP POLICY IF EXISTS "Users can view own registrations by email" ON public.registrations;
DROP POLICY IF EXISTS "Users can view own registrations" ON public.registrations;

CREATE POLICY "Users can view own registrations"
  ON public.registrations
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR lower(email) = lower(auth.jwt() ->> 'email') 
    OR public.is_admin()
  );
