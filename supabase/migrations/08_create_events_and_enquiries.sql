-- ==============================================================================
-- NOIR EVENTS — Events & Contact Enquiries Schema & Security
-- Migration: 08_create_events_and_enquiries.sql
-- ==============================================================================

-- 1. Helper function for automated updated_at timestamping (if not already defined)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Helper function to check if current authenticated user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
  );
$$;

-- 3. Create public.events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  venue TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Chandigarh, India',
  event_date TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  genre TEXT,
  artist TEXT,
  cover_charge TEXT,
  poster_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS) on events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Automated updated_at trigger for events
DROP TRIGGER IF EXISTS set_events_updated_at ON public.events;
CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Policies on events:
-- Public can view published events; Admins can view all events
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
CREATE POLICY "Public can view published events"
  ON public.events
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

-- Only authorized admins can insert, update, or delete events
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
CREATE POLICY "Admins can insert events"
  ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events"
  ON public.events
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events"
  ON public.events
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 5. Create public.contact_enquiries table
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Enable Row Level Security (RLS) on contact_enquiries
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

-- Automated updated_at trigger for contact_enquiries
DROP TRIGGER IF EXISTS set_contact_enquiries_updated_at ON public.contact_enquiries;
CREATE TRIGGER set_contact_enquiries_updated_at
  BEFORE UPDATE ON public.contact_enquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Policies on contact_enquiries:
-- Anyone can insert a contact enquiry
DROP POLICY IF EXISTS "Anyone can submit contact enquiry" ON public.contact_enquiries;
CREATE POLICY "Anyone can submit contact enquiry"
  ON public.contact_enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authorized admins can view, update, or delete enquiries
DROP POLICY IF EXISTS "Admins can view contact enquiries" ON public.contact_enquiries;
CREATE POLICY "Admins can view contact enquiries"
  ON public.contact_enquiries
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update contact enquiries" ON public.contact_enquiries;
CREATE POLICY "Admins can update contact enquiries"
  ON public.contact_enquiries
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete contact enquiries" ON public.contact_enquiries;
CREATE POLICY "Admins can delete contact enquiries"
  ON public.contact_enquiries
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON public.contact_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.contact_enquiries(status);

-- Grants
GRANT SELECT ON public.events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT INSERT ON public.contact_enquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_enquiries TO authenticated;
GRANT ALL ON public.events TO service_role;
GRANT ALL ON public.contact_enquiries TO service_role;
