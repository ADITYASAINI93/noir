-- ==============================================================================
-- NOIR EVENTS — Global Site Settings Schema & Row Level Security (RLS)
-- Migration: 09_create_site_settings.sql
-- ==============================================================================

-- 1. Helper function for automated updated_at timestamping (idempotent)
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

-- 3. Create public.site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'general',
  brand_name TEXT NOT NULL DEFAULT 'NOIR EVENTS',
  brand_tagline TEXT NOT NULL DEFAULT 'THE ART OF EXCLUSIVE NIGHTLIFE',
  contact_email TEXT NOT NULL DEFAULT 'noirchd@gmail.com',
  contact_phone TEXT NOT NULL DEFAULT '+91 81685 11261',
  operating_region TEXT NOT NULL DEFAULT 'Sector 26 Nightlife Hub & Madhya Marg, Chandigarh, India',
  city_state TEXT NOT NULL DEFAULT 'Chandigarh, India',
  instagram_handle TEXT NOT NULL DEFAULT '@noir.chd',
  instagram_url TEXT NOT NULL DEFAULT 'https://www.instagram.com/noir.chd/',
  operating_hours TEXT NOT NULL DEFAULT 'Daily: 12:00 PM — 02:00 AM IST',
  admission_policy TEXT NOT NULL DEFAULT 'All guests attending NOIR showcases must be 21+ with verified government photo identification. A strict zero-tolerance drug policy is enforced at all venues.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 5. Attach automated updated_at trigger
DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. Pre-seed the initial canonical 'general' settings record if not already present
INSERT INTO public.site_settings (
  id,
  brand_name,
  brand_tagline,
  contact_email,
  contact_phone,
  operating_region,
  city_state,
  instagram_handle,
  instagram_url,
  operating_hours,
  admission_policy
) VALUES (
  'general',
  'NOIR EVENTS',
  'THE ART OF EXCLUSIVE NIGHTLIFE',
  'noirchd@gmail.com',
  '+91 81685 11261',
  'Sector 26 Nightlife Hub & Madhya Marg, Chandigarh, India',
  'Chandigarh, India',
  '@noir.chd',
  'https://www.instagram.com/noir.chd/',
  'Daily: 12:00 PM — 02:00 AM IST',
  'All guests attending NOIR showcases must be 21+ with verified government photo identification. A strict zero-tolerance drug policy is enforced at all venues.'
)
ON CONFLICT (id) DO NOTHING;

-- 7. Policies on public.site_settings:
-- Public (anonymous + authenticated) can READ settings to render public pages
DROP POLICY IF EXISTS "Allow public read access to site_settings" ON public.site_settings;
CREATE POLICY "Allow public read access to site_settings"
  ON public.site_settings
  FOR SELECT
  TO public
  USING (true);

-- Only verified administrators can UPDATE settings
DROP POLICY IF EXISTS "Allow admin update access to site_settings" ON public.site_settings;
CREATE POLICY "Allow admin update access to site_settings"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only verified administrators can INSERT settings
DROP POLICY IF EXISTS "Allow admin insert access to site_settings" ON public.site_settings;
CREATE POLICY "Allow admin insert access to site_settings"
  ON public.site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());
