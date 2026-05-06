
-- 1. Extend role enum (commit immediately so later DDL can reference it via text)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'staff';

-- 2. Add phone to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

-- 3. Update new-user trigger to capture full_name and phone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone);
  RETURN NEW;
END;
$$;

-- Make sure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. is_staff helper (admin OR staff). Uses role::text to avoid enum-literal issue.
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text IN ('admin','staff')
  );
$$;

-- 5. claim_role RPC: lets an authenticated user assume admin/staff with a code
CREATE OR REPLACE FUNCTION public.claim_role(_role text, _access_code text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _expected text;
BEGIN
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authenticated');
  END IF;

  IF _role = 'admin' THEN
    _expected := 'Seva@12345';
  ELSIF _role = 'staff' THEN
    _expected := 'Kss@12345';
  ELSE
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_role');
  END IF;

  IF _access_code IS DISTINCT FROM _expected THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_code');
  END IF;

  -- Remove default placeholder role then grant requested role.
  EXECUTE format(
    'DELETE FROM public.user_roles WHERE user_id = %L AND role::text = %L',
    _uid, 'user'
  );
  EXECUTE format(
    'INSERT INTO public.user_roles(user_id, role) VALUES (%L, %L::public.app_role) ON CONFLICT (user_id, role) DO NOTHING',
    _uid, _role
  );

  RETURN jsonb_build_object('ok', true, 'role', _role);
END;
$$;

REVOKE ALL ON FUNCTION public.claim_role(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_role(text, text) TO authenticated;

-- 6. Staff write policies (INSERT + UPDATE only; no DELETE) for content tables
CREATE POLICY "programs_staff_insert" ON public.programs
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "programs_staff_update" ON public.programs
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "projects_staff_insert" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "projects_staff_update" ON public.projects
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "gallery_staff_insert" ON public.gallery_items
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "gallery_staff_update" ON public.gallery_items
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "blog_staff_insert" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "blog_staff_update" ON public.blog_posts
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Donations & volunteers stay admin-only writes; staff already has read via... wait, no public read.
-- Add staff-read for donations and volunteers (view only)
CREATE POLICY "donations_staff_read" ON public.donations
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "volunteers_staff_read" ON public.volunteers
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
