-- ==============================================================================
-- NOIR EVENTS — Admin Deletion Policies & Audit Logs
-- Migration: 07_admin_deletion_and_audit.sql
-- ==============================================================================

-- 1. Ensure public.is_admin() helper exists
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

-- 2. Explicitly ensure DELETE policy on public.registrations for authorized admins
DROP POLICY IF EXISTS "Authorized admins can delete registrations" ON public.registrations;
CREATE POLICY "Authorized admins can delete registrations"
  ON public.registrations
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 3. Create administrative audit logs table to track deletions and high-risk actions
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS) on audit logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 5. Audit logs policies: only authorized admins can read and insert audit logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins can insert audit logs"
  ON public.admin_audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- 6. Index for audit logs querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.admin_audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.admin_audit_logs(action);

-- 7. Grant permissions
GRANT SELECT, INSERT ON public.admin_audit_logs TO authenticated;
GRANT ALL ON public.admin_audit_logs TO service_role;
