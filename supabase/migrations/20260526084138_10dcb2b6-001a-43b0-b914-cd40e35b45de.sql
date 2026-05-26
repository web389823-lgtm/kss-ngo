
-- News banner: ratio column + default hidden
ALTER TABLE public.news_banner
  ADD COLUMN IF NOT EXISTS ratio text NOT NULL DEFAULT '16:9'
    CHECK (ratio IN ('16:9','9:16'));
ALTER TABLE public.news_banner
  ALTER COLUMN is_active SET DEFAULT false;

-- Hero carousel slides
CREATE TABLE IF NOT EXISTS public.hero_carousel_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  image_source text NOT NULL DEFAULT 'upload' CHECK (image_source IN ('upload','url')),
  headline text,
  subtext text,
  cta_text text DEFAULT 'Join Now',
  cta_link text DEFAULT '/get-involved',
  text_position text NOT NULL DEFAULT 'center' CHECK (text_position IN ('center','left','right')),
  overlay_opacity integer NOT NULL DEFAULT 40 CHECK (overlay_opacity BETWEEN 0 AND 80),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','hidden')),
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.hero_carousel_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS hc_public_read ON public.hero_carousel_slides;
CREATE POLICY hc_public_read ON public.hero_carousel_slides FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS hc_admin_all ON public.hero_carousel_slides;
CREATE POLICY hc_admin_all ON public.hero_carousel_slides FOR ALL TO authenticated
  USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
DROP POLICY IF EXISTS hc_staff_write ON public.hero_carousel_slides;
CREATE POLICY hc_staff_write ON public.hero_carousel_slides FOR INSERT TO authenticated
  WITH CHECK (is_staff(auth.uid()));
DROP POLICY IF EXISTS hc_staff_update ON public.hero_carousel_slides;
CREATE POLICY hc_staff_update ON public.hero_carousel_slides FOR UPDATE TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

DROP TRIGGER IF EXISTS hc_set_updated_at ON public.hero_carousel_slides;
CREATE TRIGGER hc_set_updated_at BEFORE UPDATE ON public.hero_carousel_slides
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Carousel settings (singleton via key)
CREATE TABLE IF NOT EXISTS public.carousel_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advance_seconds integer NOT NULL DEFAULT 5 CHECK (advance_seconds BETWEEN 3 AND 10),
  transition_type text NOT NULL DEFAULT 'fade' CHECK (transition_type IN ('fade','slide')),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.carousel_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cs_public_read ON public.carousel_settings;
CREATE POLICY cs_public_read ON public.carousel_settings FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS cs_admin_all ON public.carousel_settings;
CREATE POLICY cs_admin_all ON public.carousel_settings FOR ALL TO authenticated
  USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
  VALUES ('carousel-images','carousel-images', true)
  ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "carousel public read" ON storage.objects;
CREATE POLICY "carousel public read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'carousel-images');
DROP POLICY IF EXISTS "carousel staff write" ON storage.objects;
CREATE POLICY "carousel staff write" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'carousel-images' AND is_staff(auth.uid()));
DROP POLICY IF EXISTS "carousel staff update" ON storage.objects;
CREATE POLICY "carousel staff update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'carousel-images' AND is_staff(auth.uid()));
DROP POLICY IF EXISTS "carousel admin delete" ON storage.objects;
CREATE POLICY "carousel admin delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'carousel-images' AND is_admin(auth.uid()));
