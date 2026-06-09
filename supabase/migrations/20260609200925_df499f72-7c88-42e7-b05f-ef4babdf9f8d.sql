
-- Tighten public read: only published rows, and explicitly to anon+authenticated
DROP POLICY IF EXISTS weekly_highlights_public_read ON public.weekly_highlights;
CREATE POLICY weekly_highlights_public_read ON public.weekly_highlights
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Length & enum constraints
ALTER TABLE public.weekly_highlights
  DROP CONSTRAINT IF EXISTS weekly_highlights_title_len,
  DROP CONSTRAINT IF EXISTS weekly_highlights_desc_len,
  DROP CONSTRAINT IF EXISTS weekly_highlights_week_len,
  DROP CONSTRAINT IF EXISTS weekly_highlights_sort_range,
  DROP CONSTRAINT IF EXISTS weekly_highlights_link_type_chk,
  DROP CONSTRAINT IF EXISTS weekly_highlights_status_chk;

ALTER TABLE public.weekly_highlights
  ADD CONSTRAINT weekly_highlights_title_len
    CHECK (char_length(btrim(title)) BETWEEN 1 AND 200),
  ADD CONSTRAINT weekly_highlights_desc_len
    CHECK (description IS NULL OR char_length(description) <= 2000),
  ADD CONSTRAINT weekly_highlights_week_len
    CHECK (week_label IS NULL OR char_length(week_label) <= 100),
  ADD CONSTRAINT weekly_highlights_sort_range
    CHECK (sort_order BETWEEN 0 AND 10000),
  ADD CONSTRAINT weekly_highlights_link_type_chk
    CHECK (link_type IN ('program','project','blog','custom')),
  ADD CONSTRAINT weekly_highlights_status_chk
    CHECK (status IN ('published','draft'));

-- Validate link_target and image_url via trigger (allows context-sensitive rules)
CREATE OR REPLACE FUNCTION public.weekly_highlights_validate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  slug_re text := '^[a-z0-9]+(?:[-_][a-z0-9]+)*$';
BEGIN
  -- Normalize whitespace
  NEW.title := btrim(NEW.title);
  IF NEW.link_target IS NOT NULL THEN
    NEW.link_target := btrim(NEW.link_target);
    IF NEW.link_target = '' THEN NEW.link_target := NULL; END IF;
  END IF;
  IF NEW.image_url IS NOT NULL THEN
    NEW.image_url := btrim(NEW.image_url);
    IF NEW.image_url = '' THEN NEW.image_url := NULL; END IF;
  END IF;

  -- image_url must be https or a known public storage URL
  IF NEW.image_url IS NOT NULL THEN
    IF char_length(NEW.image_url) > 2048 THEN
      RAISE EXCEPTION 'image_url too long';
    END IF;
    IF NEW.image_url !~* '^https://[a-z0-9.\-]+(:\d+)?(/.*)?$' THEN
      RAISE EXCEPTION 'image_url must be an https URL';
    END IF;
  END IF;

  -- link_target rules per link_type
  IF NEW.link_type IN ('program','project','blog') THEN
    IF NEW.link_target IS NULL THEN
      RAISE EXCEPTION 'link_target (slug) is required for link_type %', NEW.link_type;
    END IF;
    IF char_length(NEW.link_target) > 120 OR lower(NEW.link_target) !~ slug_re THEN
      RAISE EXCEPTION 'link_target must be a valid slug (a-z, 0-9, - or _)';
    END IF;
    NEW.link_target := lower(NEW.link_target);
  ELSIF NEW.link_type = 'custom' THEN
    IF NEW.link_target IS NOT NULL THEN
      IF char_length(NEW.link_target) > 2048 THEN
        RAISE EXCEPTION 'link_target too long';
      END IF;
      -- Allow https URLs or root-relative paths; block javascript:, data:, etc.
      IF NEW.link_target !~* '^https://[a-z0-9.\-]+(:\d+)?(/.*)?$'
         AND NEW.link_target !~ '^/[A-Za-z0-9._~%!$&''()*+,;=:@/\-?#]*$' THEN
        RAISE EXCEPTION 'link_target must be an https URL or root-relative path';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_weekly_highlights_validate ON public.weekly_highlights;
CREATE TRIGGER trg_weekly_highlights_validate
  BEFORE INSERT OR UPDATE ON public.weekly_highlights
  FOR EACH ROW EXECUTE FUNCTION public.weekly_highlights_validate();
