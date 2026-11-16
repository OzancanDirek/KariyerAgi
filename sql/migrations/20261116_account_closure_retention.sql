begin;

-- The request row is also the non-identifying audit record after auth deletion.
create table if not exists private.hesap_kapatma_talepleri (
  id uuid primary key default gen_random_uuid(),
  kullanici_id uuid unique references auth.users(id) on delete set null,
  talep_tarihi timestamptz not null default now(),
  imha_tarihi timestamptz not null,
  durum text not null default 'bekliyor'
    check (durum in ('bekliyor', 'veri_silindi', 'tamamlandi')),
  silinen_dosya_sayisi integer not null default 0,
  tamamlanma_tarihi timestamptz,
  constraint hesap_kapatma_tarih_sirasi check (imha_tarihi >= talep_tarihi)
);
alter table private.hesap_kapatma_talepleri enable row level security;
create index if not exists hesap_kapatma_bekleyen_idx
  on private.hesap_kapatma_talepleri (imha_tarihi)
  where durum <> 'tamamlandi';
revoke all on private.hesap_kapatma_talepleri from public, anon, authenticated;

create or replace function public.hesap_acik_mi()
returns boolean language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null and not exists (
    select 1 from private.hesap_kapatma_talepleri k
    where k.kullanici_id = (select auth.uid())
  );
$$;
revoke all on function public.hesap_acik_mi() from public, anon;
grant execute on function public.hesap_acik_mi() to authenticated;

-- A restrictive policy is AND-ed with each table's existing policies. Existing
-- JWTs can no longer read/write application rows or Storage after closure.
do $$
declare t record;
begin
  for t in
    select n.nspname, c.relname
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where c.relkind in ('r', 'p') and c.relrowsecurity
      and n.nspname in ('public', 'storage')
      and (n.nspname = 'public' or c.relname = 'objects')
  loop
    execute format('drop policy if exists hesap_acikligi on %I.%I', t.nspname, t.relname);
    execute format(
      'create policy hesap_acikligi on %I.%I as restrictive for all to authenticated using ((select public.hesap_acik_mi())) with check ((select public.hesap_acik_mi()))',
      t.nspname, t.relname);
  end loop;
end $$;

create or replace function public.hesap_kapatma_talep_et()
returns table (talep_id uuid, kalici_silme_tarihi timestamptz)
language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := (select auth.uid());
begin
  if v_uid is null or not exists (
    select 1 from public.sistem_kullanicilari where id = v_uid
  ) then
    raise exception 'Hesap bulunamadı';
  end if;
  if exists (
    select 1 from public.sirketler where sahip_kullanici_id = v_uid
  ) then
    raise exception 'Şirket sahibi hesabı kapatmadan önce sahipliği devretmelidir';
  end if;
  -- Removing memberships and hiding applications happens in the same transaction
  -- as the closure request, before the restrictive policy takes effect.
  delete from public.sirket_uyelikleri where kullanici_id = v_uid;
  update public.is_basvurulari set is_deleted = true
    where aday_id = v_uid and not is_deleted;
  return query
    insert into private.hesap_kapatma_talepleri
      (kullanici_id, imha_tarihi)
    values (v_uid, now() + interval '2 months')
    on conflict (kullanici_id) do update
      set kullanici_id = excluded.kullanici_id
    returning id, imha_tarihi;
end;
$$;
revoke all on function public.hesap_kapatma_talep_et() from public, anon;
grant execute on function public.hesap_kapatma_talep_et() to authenticated;

create or replace function public.hesap_imha_kuyrugu()
returns table (talep_id uuid, kullanici_id uuid, durum text)
language sql security definer set search_path = '' as $$
  select id, kullanici_id, durum
  from private.hesap_kapatma_talepleri
  where imha_tarihi <= now() and durum <> 'tamamlandi'
    and (kullanici_id is not null or durum = 'veri_silindi')
  order by imha_tarihi, id limit 20;
$$;
revoke all on function public.hesap_imha_kuyrugu() from public, anon, authenticated;
grant execute on function public.hesap_imha_kuyrugu() to service_role;

create or replace function public.hesap_imha_dosyalari(p_talep_id uuid)
returns table (depolama_alani text, depolama_yolu text)
language plpgsql security definer set search_path = '' as $$
declare v_uid uuid;
begin
  select kullanici_id into v_uid from private.hesap_kapatma_talepleri
    where id = p_talep_id and imha_tarihi <= now() and durum = 'bekliyor';
  if v_uid is null then raise exception 'İmha talebi hazır değil'; end if;
  return query
    select distinct o.bucket_id::text, o.name::text
    from storage.objects o
    where o.owner_id = v_uid::text or o.name like v_uid::text || '/%';
end;
$$;
revoke all on function public.hesap_imha_dosyalari(uuid) from public, anon, authenticated;
grant execute on function public.hesap_imha_dosyalari(uuid) to service_role;

create or replace function public.hesap_imha_veritabani(p_talep_id uuid, p_silinen_dosya_sayisi integer)
returns void language plpgsql security definer set search_path = '' as $$
declare v_uid uuid;
begin
  select kullanici_id into v_uid from private.hesap_kapatma_talepleri
    where id = p_talep_id and imha_tarihi <= now() and durum = 'bekliyor'
    for update;
  if v_uid is null then raise exception 'İmha talebi hazır değil'; end if;
  if exists (
    select 1 from storage.objects o
    where o.owner_id = v_uid::text or o.name like v_uid::text || '/%'
  ) then
    raise exception 'Depoda hâlâ kullanıcı dosyası var';
  end if;

  delete from public.is_basvuru_eslestirmeleri
    where basvuru_id in (select id from public.is_basvurulari where aday_id = v_uid);
  delete from public.is_basvurulari where aday_id = v_uid;
  delete from public.cv_analizleri where aday_id = v_uid;
  delete from public.cv_analiz_istekleri where aday_id = v_uid;
  delete from public.cv_taslaklari where aday_id = v_uid;
  delete from public.aday_ozel_meslek_gorevleri where aday_id = v_uid;
  delete from public.aday_yol_haritasi_gorevleri where aday_id = v_uid;
  delete from public.oneri_geri_bildirimleri where kullanici_id = v_uid;
  delete from public.sirket_uyelikleri where kullanici_id = v_uid;
  update public.sirketler set dogrulayan_id = null where dogrulayan_id = v_uid;
  update public.egitim_kaynaklari set olusturan_id = null where olusturan_id = v_uid;
  update public.egitim_kaynaklari set guncelleyen_id = null where guncelleyen_id = v_uid;
  delete from private.saklanan_dosya_gecmisi
    where depolama_yolu like v_uid::text || '/%';
  delete from public.sistem_kullanicilari where id = v_uid;
  delete from public.aktorler where id = v_uid;

  update private.hesap_kapatma_talepleri
    set durum = 'veri_silindi', silinen_dosya_sayisi = p_silinen_dosya_sayisi
    where id = p_talep_id;
end;
$$;
revoke all on function public.hesap_imha_veritabani(uuid, integer) from public, anon, authenticated;
grant execute on function public.hesap_imha_veritabani(uuid, integer) to service_role;

create or replace function public.hesap_imha_tamamla(p_talep_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from private.hesap_kapatma_talepleri
    where id = p_talep_id and durum = 'veri_silindi' and kullanici_id is null
  ) then raise exception 'Auth hesabı henüz silinmedi'; end if;
  update private.hesap_kapatma_talepleri
    set durum = 'tamamlandi', tamamlanma_tarihi = now()
    where id = p_talep_id;
end;
$$;
revoke all on function public.hesap_imha_tamamla(uuid) from public, anon, authenticated;
grant execute on function public.hesap_imha_tamamla(uuid) to service_role;

commit;
