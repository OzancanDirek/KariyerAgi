-- Records the candidate's action immediately before each AI analysis.
-- Historical analyses remain nullable because they predate this control.
alter table public.cv_analizleri
  add column if not exists ai_islem_onayi_tarihi timestamptz;
