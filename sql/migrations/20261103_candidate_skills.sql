create table if not exists public.aday_becerileri (
    id uuid primary key default gen_random_uuid(),
    aday_id uuid not null references public.aday_profilleri(id) on delete cascade,
    beceri_id uuid not null references public.beceriler(id) on delete restrict,
    olusturma_tarihi timestamptz not null default now(),
    is_deleted boolean not null default false
);

create unique index if not exists aday_becerileri_aktif_tekil_idx
    on public.aday_becerileri(aday_id, beceri_id) where is_deleted = false;
create index if not exists aday_becerileri_aday_idx
    on public.aday_becerileri(aday_id, olusturma_tarihi desc) where is_deleted = false;

alter table public.aday_becerileri enable row level security;
grant select, insert, update on public.aday_becerileri to authenticated;

create policy aday_becerileri_select on public.aday_becerileri
    for select to authenticated using (aday_id = auth.uid());
create policy aday_becerileri_insert on public.aday_becerileri
    for insert to authenticated with check (aday_id = auth.uid() and is_deleted = false);
create policy aday_becerileri_update on public.aday_becerileri
    for update to authenticated using (aday_id = auth.uid() and is_deleted = false)
    with check (aday_id = auth.uid());

grant select on public.beceri_kategorileri, public.beceriler, public.beceri_iliskileri to authenticated;
create policy beceri_kategorileri_read on public.beceri_kategorileri
    for select to authenticated using (true);
create policy beceriler_read on public.beceriler
    for select to authenticated using (aktif_mi = true);
create policy beceri_iliskileri_read on public.beceri_iliskileri
    for select to authenticated using (true);
