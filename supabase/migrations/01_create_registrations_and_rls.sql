-- ==============================================================================
-- NOIR CHD — Registrations Schema, Security & Row Level Security (RLS) Policies
-- Migration: 01_create_registrations_and_rls.sql
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create admin_users table to explicitly authorize administrator accounts
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create the registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  instagram_handle TEXT,
  registration_category TEXT NOT NULL DEFAULT 'Guest',
  registration_status TEXT NOT NULL DEFAULT 'registered' 
    CHECK (registration_status IN ('registered', 'confirmed', 'cancelled', 'attended')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Create trigger to automatically maintain updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_registrations_updated_at ON public.registrations;
CREATE TRIGGER set_registrations_updated_at
  BEFORE UPDATE ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. High-performance indexes for search, status filtering and sorting
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(lower(email));
CREATE INDEX IF NOT EXISTS idx_registrations_reference_id ON public.registrations(reference_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(registration_status);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_category ON public.registrations(registration_category);

-- 6. Helper Security Definer function to check if current authenticated user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- 7. Enable Row Level Security (RLS) on both tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Policies for admin_users
-- -----------------------------------------------------------------------------

-- Authenticated users can verify whether their own UUID is registered as an admin
DROP POLICY IF EXISTS "Users can check their own admin status" ON public.admin_users;
CREATE POLICY "Users can check their own admin status"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Policies for registrations
-- -----------------------------------------------------------------------------

-- Policy A: Public anonymous visitors CAN insert new registrations ONLY
-- Security controls enforced at database level:
-- 1. Status MUST strictly be 'registered' (visitors cannot set 'confirmed', 'attended', etc.)
-- 2. Basic sanity checks on length and email format
-- 3. No SELECT/UPDATE/DELETE access for anon
DROP POLICY IF EXISTS "Public can submit registration" ON public.registrations;
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

-- Policy B: Only authorized admins can VIEW / SELECT registration records
DROP POLICY IF EXISTS "Authorized admins can view registrations" ON public.registrations;
CREATE POLICY "Authorized admins can view registrations"
  ON public.registrations
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Policy C: Only authorized admins can UPDATE registration status or notes
DROP POLICY IF EXISTS "Authorized admins can update registrations" ON public.registrations;
CREATE POLICY "Authorized admins can update registrations"
  ON public.registrations
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy D: Only authorized admins can DELETE registrations
DROP POLICY IF EXISTS "Authorized admins can delete registrations" ON public.registrations;
CREATE POLICY "Authorized admins can delete registrations"
  ON public.registrations
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ==============================================================================
-- INSTRUCTIONS TO PROMOTE YOUR FIRST ADMIN:
-- 1. In Supabase Dashboard > Authentication > Users, create your admin user.
-- 2. Copy the user's UUID.
-- 3. Run the following query in Supabase SQL Editor:
--    INSERT INTO public.admin_users (user_id, role, notes)
--    VALUES ('<PASTE-USER-UUID-HERE>', 'admin', 'Initial system administrator');
-- ==============================================================================
