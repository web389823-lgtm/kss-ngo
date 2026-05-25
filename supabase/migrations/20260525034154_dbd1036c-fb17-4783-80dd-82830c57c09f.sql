
-- voices_of_appreciation
CREATE TABLE IF NOT EXISTS public.voices_of_appreciation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text,
  quote text NOT NULL,
  highlight_words text,
  photo_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.voices_of_appreciation ENABLE ROW LEVEL SECURITY;
CREATE POLICY voa_public_read ON public.voices_of_appreciation FOR SELECT TO public USING (true);
CREATE POLICY voa_admin_all ON public.voices_of_appreciation FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY voa_staff_write ON public.voices_of_appreciation FOR INSERT TO authenticated WITH CHECK (is_staff(auth.uid()));
CREATE POLICY voa_staff_update ON public.voices_of_appreciation FOR UPDATE TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER voa_updated_at BEFORE UPDATE ON public.voices_of_appreciation FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed 3 initial voices
INSERT INTO public.voices_of_appreciation (name, title, quote, highlight_words, photo_url, display_order) VALUES
('Dr. Sri Sri Sri Shivakumara Swamiji', 'Siddaganga Math', 'It is admirable that Swami Vivekananda''s slogan of Daridra Devobhava has been reflected in the projects organized by Keshava Seva Samiti.', 'Daridra Devobhava', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Sri_Sri_Sri_Shivakumara_Swamiji.jpg/440px-Sri_Sri_Sri_Shivakumara_Swamiji.jpg', 1),
('Dr. Sri Sri Sri Balagangadharanatha Swamiji', 'Adichunchanagiri Math', 'Keshava Seva Samiti''s implementation of initiatives such as Vidya Vahini, Arogya Bhagya, Mathrushakti, and Vocational Education is truly commendable.', 'Vidya Vahini, Arogya Bhagya, Mathrushakti, Vocational Education', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Balagangadharanatha_Swamiji.jpg/440px-Balagangadharanatha_Swamiji.jpg', 2),
('Sri B. S. Yediyurappa', 'Former Chief Minister of Karnataka', 'KSS has been working hard with large number of backward and poor people & has organised many programs for the empowerment of women & development of children.', 'working hard, empowerment of women & development of children', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/B.S.Yediyurappa.jpg/440px-B.S.Yediyurappa.jpg', 3);

-- news_banner
CREATE TABLE IF NOT EXISTS public.news_banner (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text,
  tag_label text DEFAULT 'LATEST NEWS',
  headline text,
  link_url text,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.news_banner ENABLE ROW LEVEL SECURITY;
CREATE POLICY news_banner_public_read ON public.news_banner FOR SELECT TO public USING (true);
CREATE POLICY news_banner_admin_all ON public.news_banner FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY news_banner_staff_write ON public.news_banner FOR INSERT TO authenticated WITH CHECK (is_staff(auth.uid()));
CREATE POLICY news_banner_staff_update ON public.news_banner FOR UPDATE TO authenticated USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER news_banner_updated_at BEFORE UPDATE ON public.news_banner FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- testimonials.status
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS role_location text;
-- Allow public insert (reviews submitted as pending)
DROP POLICY IF EXISTS testimonials_public_insert ON public.testimonials;
CREATE POLICY testimonials_public_insert ON public.testimonials FOR INSERT TO public WITH CHECK (status = 'pending');

-- Seed 6 initial approved testimonials (only if table empty)
INSERT INTO public.testimonials (name, role, content, rating, is_featured, status)
SELECT * FROM (VALUES
  ('Priya Sharma', 'Parent, Bengaluru', 'KSS has transformed my daughter''s life through the Vidya Vahini program. She now studies with confidence and purpose.', 5, true, 'approved'),
  ('Ravi Kumar', 'Volunteer', 'Volunteering with KSS was one of the most fulfilling experiences. The team''s dedication to seva is truly inspiring.', 5, true, 'approved'),
  ('Anitha Reddy', 'Community Member', 'The health camps organized by KSS reached our area when we needed it most. Grateful for their tireless service.', 5, true, 'approved'),
  ('Suresh Gowda', 'CSR Partner', 'Partnering with KSS for our CSR initiatives has been seamless. Their impact measurement and transparency is commendable.', 5, true, 'approved'),
  ('Meena Iyer', 'Donor', 'Every rupee donated to KSS is used wisely. I can see real change happening in the communities they serve.', 5, true, 'approved'),
  ('Deepak Nair', 'Student Volunteer', 'My internship with KSS gave me real-world experience and a deeper sense of social responsibility.', 5, true, 'approved')
) AS t(name, role, content, rating, is_featured, status)
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials WHERE name = t.name);
