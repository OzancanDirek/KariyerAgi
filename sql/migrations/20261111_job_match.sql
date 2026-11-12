-- Job criteria and employer review evidence. Apply after company membership and applicant detail migrations.
create table if not exists public.is_ilani_eslestirme_olcutleri (
  ilan_id uuid primary key references public.is_ilanlari(id),
  surum integer not null default 1 check (surum > 0),
  olcutler jsonb not null check (jsonb_typeof(olcutler) = 'array'),
  is_deleted boolean not null default false,
  guncelleme_tarihi timestamptz not null default now()
);

create table if not exists public.is_basvuru_eslestirmeleri (
  basvuru_id uuid primary key references public.is_basvurulari(id),
  ilan_id uuid not null references public.is_ilanlari(id),
  olcut_surumu integer not null check (olcut_surumu > 0),
  puan integer not null check (puan between 0 and 100),
  dayanaklar jsonb not null check (jsonb_typeof(dayanaklar) = 'array'),
  is_deleted boolean not null default false,
  olusturma_tarihi timestamptz not null default now()
);
create index if not exists is_basvuru_eslestirmeleri_ilan_idx on public.is_basvuru_eslestirmeleri(ilan_id) where is_deleted = false;

alter table public.is_ilani_eslestirme_olcutleri enable row level security;
alter table public.is_basvuru_eslestirmeleri enable row level security;
revoke all on public.is_ilani_eslestirme_olcutleri from anon, authenticated;
revoke all on public.is_basvuru_eslestirmeleri from anon, authenticated;
grant select on public.is_ilani_eslestirme_olcutleri to authenticated;
grant select on public.is_basvuru_eslestirmeleri to authenticated;

create policy "is_ilani_olcutleri_sirket_okuma" on public.is_ilani_eslestirme_olcutleri for select to authenticated
using (not is_deleted and exists (
  select 1 from public.is_ilanlari i where i.id = ilan_id and not i.is_deleted
  and (select private.sirket_uyesi_mi(i.sirket_id))
));
create policy "is_basvuru_eslestirme_sirket_okuma" on public.is_basvuru_eslestirmeleri for select to authenticated
using (not is_deleted and exists (
  select 1 from public.is_ilanlari i where i.id = ilan_id and not i.is_deleted
  and (select private.sirket_uyesi_mi(i.sirket_id))
));

create or replace function public.is_ilani_olcutlerini_kaydet(p_ilan_id uuid, p_olcutler jsonb)
returns setof public.is_ilani_eslestirme_olcutleri
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from public.is_ilanlari i where i.id = p_ilan_id and not i.is_deleted
      and private.sirket_uyesi_mi(i.sirket_id)
  ) then
    raise exception 'JOB_MATCH_FORBIDDEN';
  end if;
  if jsonb_typeof(p_olcutler) <> 'array' or jsonb_array_length(p_olcutler) not between 4 and 8 then
    raise exception 'JOB_MATCH_CRITERIA_INVALID';
  end if;
  insert into public.is_ilani_eslestirme_olcutleri(ilan_id, olcutler)
  values (p_ilan_id, p_olcutler)
  on conflict (ilan_id) do update set olcutler = excluded.olcutler, surum = public.is_ilani_eslestirme_olcutleri.surum + 1,
    guncelleme_tarihi = now(), is_deleted = false;
  return query select * from public.is_ilani_eslestirme_olcutleri where ilan_id = p_ilan_id;
end $$;

create or replace function public.is_basvurusu_eslestirmesini_kaydet(p_basvuru_id uuid, p_olcut_surumu integer, p_puan integer, p_dayanaklar jsonb)
returns setof public.is_basvuru_eslestirmeleri
language plpgsql security definer set search_path = '' as $$
declare v_ilan_id uuid;
begin
  select b.ilan_id into v_ilan_id from public.is_basvurulari b join public.is_ilanlari i on i.id = b.ilan_id
  where b.id = p_basvuru_id and not b.is_deleted and b.durum <> 'geri_cekildi' and not i.is_deleted
    and private.sirket_uyesi_mi(i.sirket_id);
  if v_ilan_id is null then
    raise exception 'JOB_MATCH_FORBIDDEN';
  end if;
  if p_puan not between 0 and 100 or jsonb_typeof(p_dayanaklar) <> 'array'
    or not exists (select 1 from public.is_ilani_eslestirme_olcutleri c
      where c.ilan_id = v_ilan_id and c.surum = p_olcut_surumu and not c.is_deleted) then
    raise exception 'JOB_MATCH_CRITERIA_INVALID';
  end if;
  insert into public.is_basvuru_eslestirmeleri(basvuru_id, ilan_id, olcut_surumu, puan, dayanaklar)
  values (p_basvuru_id, v_ilan_id, p_olcut_surumu, p_puan, p_dayanaklar)
  on conflict (basvuru_id) do update set olcut_surumu = excluded.olcut_surumu, puan = excluded.puan,
    dayanaklar = excluded.dayanaklar, olusturma_tarihi = now(), is_deleted = false;
  return query select * from public.is_basvuru_eslestirmeleri where basvuru_id = p_basvuru_id;
end $$;

revoke all on function public.is_ilani_olcutlerini_kaydet(uuid,jsonb) from public, anon;
revoke all on function public.is_basvurusu_eslestirmesini_kaydet(uuid,integer,integer,jsonb) from public, anon;
grant execute on function public.is_ilani_olcutlerini_kaydet(uuid,jsonb) to authenticated;
grant execute on function public.is_basvurusu_eslestirmesini_kaydet(uuid,integer,integer,jsonb) to authenticated;

-- An edited title or description invalidates the employer's previous calibration.
create or replace function private.is_ilani_olcutlerini_gecersiz_kil()
returns trigger language plpgsql set search_path = '' as $$
begin
  if old.baslik is distinct from new.baslik or old.aciklama is distinct from new.aciklama then
    update public.is_ilani_eslestirme_olcutleri
      set is_deleted = true, guncelleme_tarihi = now()
      where ilan_id = new.id and not is_deleted;
  end if;
  return new;
end $$;
drop trigger if exists is_ilani_olcutlerini_gecersiz_kil on public.is_ilanlari;
create trigger is_ilani_olcutlerini_gecersiz_kil
  after update of baslik, aciklama on public.is_ilanlari
  for each row execute function private.is_ilani_olcutlerini_gecersiz_kil();
