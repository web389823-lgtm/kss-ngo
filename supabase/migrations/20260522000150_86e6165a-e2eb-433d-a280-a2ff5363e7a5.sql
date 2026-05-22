CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY contact_public_insert ON public.contact_submissions
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY contact_staff_read ON public.contact_submissions
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY contact_admin_all ON public.contact_submissions
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE INDEX IF NOT EXISTS contact_submissions_created_idx
  ON public.contact_submissions (created_at DESC);