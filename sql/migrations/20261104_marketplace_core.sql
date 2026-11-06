begin;

create table public.sirketler (
  id uuid primary key default gen_random_uuid(),
  sahip_kullanici_id uuid not null references public.sistem_kullanicilari(id),
  ad text not null check (char_length(btrim(ad)) between 2 and 160),
  aciklama text check (char_length(aciklama) <= 2000),
  sektor text check (char_length(sektor) <= 120),
  konum text check (char_length(konum) <= 150),
  web_sitesi text check (web_sitesi is null or web_sitesi ~ '^https://[^[:space:]]+$'),
  is_deleted boolean not null default false,
  olusturma_tarihi timestamptz not null default now(),
  guncelleme_tarihi timestamptz not null default now()
);

create table public.is_ilanlari (
  id uuid primary key default gen_random_uuid(),
  sirket_id uuid not null references public.sirketler(id),
  baslik text not null check (char_length(btrim(baslik)) between 5 and 160),
  aciklama text not null check (char_length(btrim(aciklama)) between 50 and 10000),
  konum text check (char_length(konum) <= 150),
  calisma_modeli text not null check (calisma_modeli in ('uzaktan', 'hibrit', 'ofis')),
  istihdam_turu text not null check (istihdam_turu in ('tam_zamanli', 'yari_zamanli', 'staj', 'sozlesmeli')),
  durum text not null default 'taslak' check (durum in ('taslak', 'yayinda', 'kapali')),
  yayin_tarihi timestamptz,
  son_basvuru_tarihi timestamptz,
  is_deleted boolean not null default false,
  olusturma_tarihi timestamptz not null default now(),
  guncelleme_tarihi timestamptz not null default now(),
  check (son_basvuru_tarihi is null or yayin_tarihi is null or son_basvuru_tarihi > yayin_tarihi)
);

create table public.is_basvurulari (
  id uuid primary key default gen_random_uuid(),
  ilan_id uuid not null references public.is_ilanlari(id),
  aday_id uuid not null references public.aday_profilleri(id),
  cv_dosyasi_id uuid references public.cv_dosyalari(id),
  on_yazi text check (char_length(on_yazi) <= 3000),
  durum text not null default 'gonderildi' check (durum in ('gonderildi', 'geri_cekildi')),
  is_deleted boolean not null default false,
  olusturma_tarihi timestamptz not null default now(),
  guncelleme_tarihi timestamptz not null default now()
);

create index sirketler_sahip_aktif_idx on public.sirketler(sahip_kullanici_id, olusturma_tarihi desc) where is_deleted = false;
create index is_ilanlari_yayinda_idx on public.is_ilanlari(yayin_tarihi desc, id) where is_deleted = false and durum = 'yayinda';
create index is_ilanlari_sirket_aktif_idx on public.is_ilanlari(sirket_id, olusturma_tarihi desc) where is_deleted = false;
create index is_basvurulari_aday_aktif_idx on public.is_basvurulari(aday_id, olusturma_tarihi desc) where is_deleted = false;
create index is_basvurulari_ilan_aktif_idx on public.is_basvurulari(ilan_id, olusturma_tarihi desc) where is_deleted = false;
create unique index is_basvurulari_tek_etkin_idx on public.is_basvurulari(ilan_id, aday_id) where is_deleted = false and durum = 'gonderildi';

create or replace function private.pazar_yeri_alanlarini_koru()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  if tg_table_name = 'sirketler' then
    if tg_op = 'UPDATE' and (new.id <> old.id or new.sahip_kullanici_id <> old.sahip_kullanici_id or new.olusturma_tarihi <> old.olusturma_tarihi) then
      raise exception 'Şirket sahibi ve kimliği değiştirilemez';
    end if;
  elsif tg_table_name = 'is_ilanlari' then
    if tg_op = 'UPDATE' and (new.id <> old.id or new.sirket_id <> old.sirket_id or new.olusturma_tarihi <> old.olusturma_tarihi) then
      raise exception 'İlanın şirketi ve kimliği değiştirilemez';
    end if;
    if tg_op = 'INSERT' then
      new.yayin_tarihi := case when new.durum = 'yayinda' then now() else null end;
    elsif old.yayin_tarihi is not null then
      new.yayin_tarihi := old.yayin_tarihi;
    else
      new.yayin_tarihi := case when new.durum = 'yayinda' then now() else null end;
    end if;
  elsif tg_table_name = 'is_basvurulari' then
    if tg_op = 'UPDATE' and (new.id <> old.id or new.ilan_id <> old.ilan_id or new.aday_id <> old.aday_id or new.cv_dosyasi_id is distinct from old.cv_dosyasi_id or new.on_yazi is distinct from old.on_yazi or new.olusturma_tarihi <> old.olusturma_tarihi) then
      raise exception 'Başvurunun kimliği ve içeriği değiştirilemez';
    end if;
    if tg_op = 'UPDATE' and old.durum <> new.durum and (old.durum <> 'gonderildi' or new.durum <> 'geri_cekildi') then
      raise exception 'Geçersiz başvuru durumu';
    end if;
  end if;
  if tg_op = 'UPDATE' and old.is_deleted and not new.is_deleted then
    raise exception 'Arşivlenen kayıt yeniden açılamaz';
  end if;
  new.guncelleme_tarihi := now();
  return new;
end;
$$;

create trigger sirketler_alan_koruma before insert or update on public.sirketler for each row execute function private.pazar_yeri_alanlarini_koru();
create trigger is_ilanlari_alan_koruma before insert or update on public.is_ilanlari for each row execute function private.pazar_yeri_alanlarini_koru();
create trigger is_basvurulari_alan_koruma before insert or update on public.is_basvurulari for each row execute function private.pazar_yeri_alanlarini_koru();

alter table public.sirketler enable row level security;
alter table public.is_ilanlari enable row level security;
alter table public.is_basvurulari enable row level security;

create policy sirketler_okuma on public.sirketler for select to authenticated
using (is_deleted = false);
create policy sirketler_ekleme on public.sirketler for insert to authenticated
with check (sahip_kullanici_id = (select auth.uid()) and is_deleted = false and (select private.rolu_var_mi('isveren')));
create policy sirketler_guncelleme on public.sirketler for update to authenticated
using (sahip_kullanici_id = (select auth.uid()) and is_deleted = false)
with check (sahip_kullanici_id = (select auth.uid()));

create policy is_ilanlari_okuma on public.is_ilanlari for select to authenticated
using (
  is_deleted = false and exists (
    select 1 from public.sirketler s where s.id = sirket_id and s.is_deleted = false
      and (durum = 'yayinda' or s.sahip_kullanici_id = (select auth.uid()))
  )
);
create policy is_ilanlari_ekleme on public.is_ilanlari for insert to authenticated
with check (is_deleted = false and exists (
  select 1 from public.sirketler s where s.id = sirket_id and s.is_deleted = false and s.sahip_kullanici_id = (select auth.uid())
));
create policy is_ilanlari_guncelleme on public.is_ilanlari for update to authenticated
using (is_deleted = false and exists (
  select 1 from public.sirketler s where s.id = sirket_id and s.is_deleted = false and s.sahip_kullanici_id = (select auth.uid())
))
with check (exists (
  select 1 from public.sirketler s where s.id = sirket_id and s.is_deleted = false and s.sahip_kullanici_id = (select auth.uid())
));

create policy is_basvurulari_okuma on public.is_basvurulari for select to authenticated
using (is_deleted = false and (
  aday_id = (select auth.uid()) or exists (
    select 1 from public.is_ilanlari i join public.sirketler s on s.id = i.sirket_id
    where i.id = ilan_id and i.is_deleted = false and s.is_deleted = false and s.sahip_kullanici_id = (select auth.uid())
  )
));
create policy is_basvurulari_ekleme on public.is_basvurulari for insert to authenticated
with check (
  aday_id = (select auth.uid()) and durum = 'gonderildi' and is_deleted = false and (select private.rolu_var_mi('aday'))
  and exists (
    select 1 from public.is_ilanlari i join public.sirketler s on s.id = i.sirket_id
    where i.id = ilan_id and i.durum = 'yayinda' and i.is_deleted = false and s.is_deleted = false
      and (i.son_basvuru_tarihi is null or i.son_basvuru_tarihi > now())
  )
  and (cv_dosyasi_id is null or exists (
    select 1 from public.cv_dosyalari cv where cv.id = cv_dosyasi_id and cv.aday_id = (select auth.uid()) and cv.is_deleted = false
  ))
);
create policy is_basvurulari_guncelleme on public.is_basvurulari for update to authenticated
using (aday_id = (select auth.uid()) and durum = 'gonderildi' and is_deleted = false)
with check (aday_id = (select auth.uid()) and durum = 'geri_cekildi');

grant select, insert, update on public.sirketler, public.is_ilanlari, public.is_basvurulari to authenticated;
grant all on public.sirketler, public.is_ilanlari, public.is_basvurulari to service_role;

commit;
