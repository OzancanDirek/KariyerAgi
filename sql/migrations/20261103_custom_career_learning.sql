-- Katalog dışı meslek için kişiye özel öğrenme taslağı. Küresel meslek kataloğunu değiştirmez.
create table if not exists public.aday_ozel_meslek_taslaklari (
  id uuid primary key default gen_random_uuid(),
  aday_id uuid not null references public.sistem_kullanicilari(id) on delete cascade,
  meslek_adi text not null check (char_length(meslek_adi) between 3 and 100),
  durum text not null default 'processing' check (durum in ('processing', 'draft', 'confirmed', 'failed')),
  oneriler jsonb not null default '[]'::jsonb check (jsonb_typeof(oneriler) = 'array'),
  onaylananlar jsonb not null default '[]'::jsonb check (jsonb_typeof(onaylananlar) = 'array'),
  olusturma_tarihi timestamptz not null default now(),
  guncelleme_tarihi timestamptz not null default now()
);
create index if not exists aday_ozel_meslek_taslaklari_aday_idx
  on public.aday_ozel_meslek_taslaklari (aday_id, olusturma_tarihi desc);
alter table public.aday_ozel_meslek_taslaklari enable row level security;
create policy "Ozel meslek: aday kendi taslagini okur" on public.aday_ozel_meslek_taslaklari
  for select to authenticated using (aday_id = (select auth.uid()));
create policy "Ozel meslek: aday kendi taslagini ekler" on public.aday_ozel_meslek_taslaklari
  for insert to authenticated with check (aday_id = (select auth.uid()));
create policy "Ozel meslek: aday kendi taslagini gunceller" on public.aday_ozel_meslek_taslaklari
  for update to authenticated using (aday_id = (select auth.uid())) with check (aday_id = (select auth.uid()));
grant select, insert, update on public.aday_ozel_meslek_taslaklari to authenticated;
