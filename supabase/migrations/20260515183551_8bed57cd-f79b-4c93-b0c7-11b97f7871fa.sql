
-- New volunteer_applications table for combined registration form
CREATE TABLE IF NOT EXISTS public.volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text DEFAULT 'volunteer',
  full_name text NOT NULL,
  age integer,
  gender text,
  email text NOT NULL,
  phone text,
  state text,
  city text,
  address text,
  education text,
  occupation text,
  organization text,
  aadhaar text,
  pan text,
  primary_interest text,
  secondary_interest text,
  availability text,
  hours_per_week text,
  mode text,
  languages text,
  special_skills text,
  reason text,
  heard_from text,
  declaration boolean DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vapp_public_insert" ON public.volunteer_applications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "vapp_admin_all" ON public.volunteer_applications FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "vapp_staff_read" ON public.volunteer_applications FOR SELECT TO authenticated USING (is_staff(auth.uid()));

CREATE TRIGGER trg_vapp_updated_at BEFORE UPDATE ON public.volunteer_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Extend csr_applications with new columns from combined form, relax legacy NOT NULLs
ALTER TABLE public.csr_applications
  ADD COLUMN IF NOT EXISTS type text DEFAULT 'csr',
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS company_type text,
  ADD COLUMN IF NOT EXISTS company_website text,
  ADD COLUMN IF NOT EXISTS company_address text,
  ADD COLUMN IF NOT EXISTS pin_code text,
  ADD COLUMN IF NOT EXISTS num_employees text,
  ADD COLUMN IF NOT EXISTS contact_name text,
  ADD COLUMN IF NOT EXISTS official_email text,
  ADD COLUMN IF NOT EXISTS alternate_phone text,
  ADD COLUMN IF NOT EXISTS linkedin text,
  ADD COLUMN IF NOT EXISTS csr_budget text,
  ADD COLUMN IF NOT EXISTS primary_focus text,
  ADD COLUMN IF NOT EXISTS secondary_focus text,
  ADD COLUMN IF NOT EXISTS preferred_program text,
  ADD COLUMN IF NOT EXISTS previous_experience text,
  ADD COLUMN IF NOT EXISTS heard_from text,
  ADD COLUMN IF NOT EXISTS declaration boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz DEFAULT now();

ALTER TABLE public.csr_applications ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE public.csr_applications ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.csr_applications ALTER COLUMN phone DROP NOT NULL;
