
ALTER TABLE public.volunteer_applications
  ADD COLUMN IF NOT EXISTS assigned_program text,
  ADD COLUMN IF NOT EXISTS assigned_date date;

ALTER TABLE public.csr_applications
  ADD COLUMN IF NOT EXISTS assigned_manager text,
  ADD COLUMN IF NOT EXISTS proposal_stage text;
