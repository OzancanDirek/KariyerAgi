create table if not exists public.cv_analizleri (
  id uuid primary key default gen_random_uuid(),
  aday_id uuid not null references public.aday_profilleri(id),
  cv_dosyasi_id uuid not null references public.cv_dosyalari(id),
  model_surumu text not null,
  ozet text not null,
  beceriler jsonb not null default '[]'::jsonb,
  egitim_ozeti text not null default '',
  deneyim_ozeti text not null default '',
  guclu_yonler jsonb not null default '[]'::jsonb,
  oneriler jsonb not null default '[]'::jsonb,
  olusturma_tarihi timestamptz not null default now(),
  is_deleted boolean not null default false
);

create index if not exists cv_analizleri_dosya_tarih_idx
  on public.cv_analizleri (cv_dosyasi_id, olusturma_tarihi desc)
  where is_deleted = false;

alter table public.cv_analizleri enable row level security;
grant select, insert on public.cv_analizleri to authenticated;

create policy "cv_analizleri: aday kendi analizlerini okur"
  on public.cv_analizleri for select to authenticated
  using (aday_id = auth.uid() and is_deleted = false);

create policy "cv_analizleri: aday kendi cv analizini kaydeder"
  on public.cv_analizleri for insert to authenticated
  with check (
    aday_id = auth.uid()
    and exists (
      select 1 from public.cv_dosyalari cv
      where cv.id = cv_dosyasi_id
        and cv.aday_id = auth.uid()
        and cv.is_deleted = false
    )
  );
