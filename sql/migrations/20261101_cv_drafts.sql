create table if not exists public.cv_taslaklari (
  id uuid primary key default gen_random_uuid(),
  aday_id uuid not null references public.aday_profilleri(id),
  ad text not null check (length(trim(ad)) between 1 and 100),
  sablon text not null check (sablon in ('sade', 'modern')),
  icerik jsonb not null check (jsonb_typeof(icerik) = 'object'),
  olusturma_tarihi timestamptz not null default now(),
  guncelleme_tarihi timestamptz not null default now(),
  is_deleted boolean not null default false
);

create index if not exists cv_taslaklari_aday_tarih_idx
  on public.cv_taslaklari (aday_id, guncelleme_tarihi desc)
  where is_deleted = false;

alter table public.cv_taslaklari enable row level security;
grant select, insert, update on public.cv_taslaklari to authenticated;

create policy "cv_taslaklari: aday kendi taslaklarini okur"
  on public.cv_taslaklari for select to authenticated
  using (aday_id = auth.uid());

create policy "cv_taslaklari: aday kendi taslagini ekler"
  on public.cv_taslaklari for insert to authenticated
  with check (aday_id = auth.uid() and is_deleted = false);

create policy "cv_taslaklari: aday kendi taslagini gunceller"
  on public.cv_taslaklari for update to authenticated
  using (aday_id = auth.uid() and is_deleted = false)
  with check (aday_id = auth.uid());
