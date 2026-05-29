-- Milestones table for About Us
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  link_url TEXT,
  link_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.milestones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.milestones TO authenticated;
GRANT ALL ON public.milestones TO service_role;

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY milestones_public_read ON public.milestones FOR SELECT TO public USING (true);
CREATE POLICY milestones_admin_write ON public.milestones FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY milestones_staff_insert ON public.milestones FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY milestones_staff_update ON public.milestones FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER milestones_set_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage bucket for milestone photos
INSERT INTO storage.buckets (id, name, public) VALUES ('milestone-photos', 'milestone-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "milestone_photos_public_read" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'milestone-photos');
CREATE POLICY "milestone_photos_staff_write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'milestone-photos' AND public.is_staff(auth.uid()));
CREATE POLICY "milestone_photos_staff_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'milestone-photos' AND public.is_staff(auth.uid()));
CREATE POLICY "milestone_photos_staff_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'milestone-photos' AND public.is_staff(auth.uid()));

-- Seed initial milestones (idempotent by year+title)
INSERT INTO public.milestones (year, title, description, display_order) VALUES
  (1999, 'KSS Founded', 'Keshava Seva Samiti was established in Bengaluru with a vision to Reach the Unreached and serve marginalized communities with compassion and dedication.', 0),
  (2001, 'First Seva Basti Opened', 'KSS opened its first community centre in North Bengaluru, becoming the foundation of what would grow into a network of 100+ Seva Bastis.', 0),
  (2005, 'Vidya Vahini Launched', 'The flagship free tuition programme was launched, providing academic support and guidance to underprivileged children across Bengaluru.', 0),
  (2005, 'Education Reaches 1000 Children', 'KSS crossed a major milestone of supporting over 1,000 children through its education initiatives across multiple community centres.', 1),
  (2008, 'Arogya Bhagya Health Camps Begin', 'Free health check-up camps and medicine distribution programmes were launched, bringing healthcare to underserved communities.', 0),
  (2010, 'Nari Uttejan — Women Empowerment', 'The Nari Uttejan vocational training programme was launched, equipping women with industry-standard skills for financial independence.', 0),
  (2010, 'Padavi Uttejan Scholarships', 'KSS began supporting girls aged 13+ with scholarships and financial assistance to pursue higher education.', 1),
  (2015, '50 Seva Bastis Milestone', 'KSS expanded its network to 50 community centres across Bengaluru, covering 8 constituencies and reaching tens of thousands of families.', 0),
  (2019, '20 Years of Seva Celebrated', 'KSS celebrated two decades of tireless service with a grand BalaSangam event bringing together thousands of children, volunteers, and community members.', 0),
  (2019, 'BalaSangam — Mega Children''s Event', 'The annual BalaSangam festival grew into one of Bengaluru''s largest children''s events, celebrating sports, creativity, and cultural values.', 1),
  (2024, '100 Community Centres', 'KSS reached a historic milestone of operating nearly 100 Seva Bastis across 65+ locations covering 12 constituencies in Bengaluru.', 0),
  (2024, '25 Years of Transforming Lives', 'Marking 25 years of uninterrupted seva, KSS continues to bridge social gaps and build a self-reliant, compassionate society.', 1),
  (2024, 'Reaching Lakhs of Beneficiaries', 'Over 25 years, KSS programmes have touched the lives of lakhs of individuals across education, health, women empowerment, and emergency relief.', 2)
ON CONFLICT DO NOTHING;