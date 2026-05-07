
-- 1. Volunteer extra fields
ALTER TABLE public.volunteers
  ADD COLUMN IF NOT EXISTS pan text,
  ADD COLUMN IF NOT EXISTS aadhaar text,
  ADD COLUMN IF NOT EXISTS purpose text;

-- 2. CSR applications table
CREATE TABLE IF NOT EXISTS public.csr_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  designation text,
  company text,
  email text NOT NULL,
  phone text NOT NULL,
  gender text,
  age integer,
  pan text,
  aadhaar text,
  address text,
  purpose text,
  budget_range text,
  message text,
  status volunteer_status NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.csr_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY csr_public_insert ON public.csr_applications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY csr_admin_all ON public.csr_applications FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY csr_staff_read ON public.csr_applications FOR SELECT TO authenticated USING (is_staff(auth.uid()));

CREATE TRIGGER csr_set_updated_at BEFORE UPDATE ON public.csr_applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Activity log table
CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_email text,
  user_role text,
  action text NOT NULL,        -- created | updated | deleted | status_changed | login
  entity_type text NOT NULL,   -- table or feature name
  entity_id text,
  entity_label text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY activity_staff_insert ON public.activity_log FOR INSERT TO authenticated WITH CHECK (is_staff(auth.uid()));
CREATE POLICY activity_admin_read ON public.activity_log FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY activity_admin_delete ON public.activity_log FOR DELETE TO authenticated USING (is_admin(auth.uid()));

CREATE INDEX IF NOT EXISTS activity_log_created_idx ON public.activity_log (created_at DESC);

-- 4. Admin/Staff users view function (since auth.users not directly readable)
CREATE OR REPLACE FUNCTION public.list_staff_users()
RETURNS TABLE(user_id uuid, email text, full_name text, role app_role, joined_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT ur.user_id,
         u.email::text,
         p.full_name,
         ur.role,
         ur.created_at
  FROM public.user_roles ur
  LEFT JOIN auth.users u ON u.id = ur.user_id
  LEFT JOIN public.profiles p ON p.id = ur.user_id
  WHERE ur.role IN ('admin','staff')
    AND public.is_admin(auth.uid())
  ORDER BY ur.created_at DESC;
$$;
