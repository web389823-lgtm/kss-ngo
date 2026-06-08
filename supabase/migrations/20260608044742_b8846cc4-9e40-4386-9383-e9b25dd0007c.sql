DROP POLICY IF EXISTS testimonials_public_read ON public.testimonials;
CREATE POLICY testimonials_public_read ON public.testimonials FOR SELECT USING (status = 'approved');