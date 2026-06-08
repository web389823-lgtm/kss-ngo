CREATE TABLE public.weekly_highlights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_type TEXT NOT NULL DEFAULT 'custom',
  link_target TEXT,
  week_label TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.weekly_highlights TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weekly_highlights TO authenticated;
GRANT ALL ON public.weekly_highlights TO service_role;

ALTER TABLE public.weekly_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "weekly_highlights_public_read" ON public.weekly_highlights
  FOR SELECT USING (status = 'published');

CREATE POLICY "weekly_highlights_staff_all" ON public.weekly_highlights
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER trg_weekly_highlights_updated_at
  BEFORE UPDATE ON public.weekly_highlights
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();