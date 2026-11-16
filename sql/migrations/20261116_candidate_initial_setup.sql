-- Existing accounts have already seen the standard candidate interface.
-- New candidate profiles start with the one-time setup flow.
alter table public.aday_profilleri
  add column if not exists ilk_kurulum_tamamlandi_mi boolean not null default true;

alter table public.aday_profilleri
  alter column ilk_kurulum_tamamlandi_mi set default false;
