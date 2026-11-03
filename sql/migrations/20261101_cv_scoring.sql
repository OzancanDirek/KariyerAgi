begin;

alter table public.cv_analizleri
  add column if not exists ats_skoru integer check (ats_skoru between 0 and 100),
  add column if not exists bicim_skoru integer check (bicim_skoru between 0 and 100),
  add column if not exists icerik_skoru integer check (icerik_skoru between 0 and 100),
  add column if not exists genel_skor integer check (genel_skor between 0 and 100),
  add column if not exists puan_detaylari jsonb;

commit;
