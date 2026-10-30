begin;

-- Aday kayıtları görünümden çıkarılır; satırlar ve bağlı dosyalar korunur.
alter table public.deneyimler add column if not exists is_deleted boolean not null default false;
alter table public.egitimler add column if not exists is_deleted boolean not null default false;
alter table public.projeler add column if not exists is_deleted boolean not null default false;
alter table public.sertifikalar add column if not exists is_deleted boolean not null default false;
alter table public.cv_dosyalari add column if not exists is_deleted boolean not null default false;

create index if not exists deneyimler_aktif_aday_idx on public.deneyimler (aday_id, olusturma_tarihi desc) where not is_deleted;
create index if not exists egitimler_aktif_aday_idx on public.egitimler (aday_id, olusturma_tarihi desc) where not is_deleted;
create index if not exists projeler_aktif_aday_idx on public.projeler (aday_id, olusturma_tarihi desc) where not is_deleted;
create index if not exists sertifikalar_aktif_aday_idx on public.sertifikalar (aday_id, olusturma_tarihi desc) where not is_deleted;
create index if not exists cv_dosyalari_aktif_aday_idx on public.cv_dosyalari (aday_id, olusturma_tarihi desc) where not is_deleted;

-- Birincil CV yalnızca aktif kayıtlar arasında tekil olmalı.
drop index if exists public.cv_dosyalari_birincil_tekil_idx;
create unique index cv_dosyalari_birincil_tekil_idx on public.cv_dosyalari (aday_id) where birincil_mi and not is_deleted;

create or replace function private.cv_dosya_bilgisini_doldur()
returns trigger language plpgsql set search_path = public, pg_temp as $$
declare v_meta jsonb;
begin
  select o.metadata into v_meta from storage.objects o
  where o.bucket_id = 'cv-dosyalari' and o.name = new.depolama_yolu;
  if v_meta is null then
    raise exception 'CV dosyası depoda bulunamadı: %', new.depolama_yolu;
  end if;
  new.mime_tipi := v_meta ->> 'mimetype';
  new.boyut_bayt := (v_meta ->> 'size')::bigint;
  new.birincil_mi := not exists (
    select 1 from public.cv_dosyalari where aday_id = new.aday_id and not is_deleted
  );
  return new;
end;
$$;

create or replace function private.cv_alanlarini_koru()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  if (new.aday_id, new.depolama_yolu, new.orijinal_dosya_adi, new.mime_tipi, new.boyut_bayt)
     is distinct from (old.aday_id, old.depolama_yolu, old.orijinal_dosya_adi, old.mime_tipi, old.boyut_bayt) then
    raise exception 'CV dosya bilgileri değiştirilemez; yeni dosya yükleyin.';
  end if;
  if old.is_deleted and not new.is_deleted then
    raise exception 'Silinmiş CV doğrudan yeniden etkinleştirilemez.';
  end if;
  if new.is_deleted then
    new.birincil_mi := false;
  elsif old.birincil_mi and not new.birincil_mi and pg_trigger_depth() = 1 then
    raise exception 'Birincil CV''yi değiştirmek için başka bir CV''yi birincil yapın.';
  end if;
  if new.birincil_mi and not old.birincil_mi then
    update public.cv_dosyalari set birincil_mi = false
    where aday_id = new.aday_id and id <> new.id and birincil_mi and not is_deleted;
  end if;
  return new;
end;
$$;

create or replace function private.birincil_cv_silinince_yenisini_sec()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if old.birincil_mi and (tg_op = 'DELETE' or (tg_op = 'UPDATE' and new.is_deleted and not old.is_deleted)) then
    update public.cv_dosyalari set birincil_mi = true
    where id = (
      select id from public.cv_dosyalari
      where aday_id = old.aday_id and not is_deleted
      order by olusturma_tarihi desc, id desc limit 1
    );
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger cv_dosyalari_birincil_yumusak_silme
after update of is_deleted on public.cv_dosyalari
for each row when (old.is_deleted is distinct from new.is_deleted)
execute function private.birincil_cv_silinince_yenisini_sec();

-- Kullanıcı belgeyi veya fotoğrafı kaldırdığında eski yol kaybolmasın.
create table if not exists private.saklanan_dosya_gecmisi (
  id uuid primary key default gen_random_uuid(),
  tablo_adi text not null,
  kayit_id uuid not null,
  depolama_alani text not null,
  depolama_yolu text not null,
  kaldirilma_tarihi timestamptz not null default now(),
  unique (depolama_alani, depolama_yolu)
);
alter table private.saklanan_dosya_gecmisi enable row level security;

create or replace function private.eski_dosya_yolunu_koru()
returns trigger language plpgsql security definer set search_path = public, private, pg_temp as $$
declare v_eski_yol text; v_yeni_yol text; v_alan text;
begin
  if tg_table_name = 'sertifikalar' then
    v_eski_yol := old.belge_yolu;
    v_yeni_yol := new.belge_yolu;
    v_alan := 'sertifika-belgeleri';
  else
    v_eski_yol := old.profil_fotografi_yolu;
    v_yeni_yol := new.profil_fotografi_yolu;
    v_alan := 'profil-fotograflari';
  end if;
  if v_eski_yol is not null and v_eski_yol is distinct from v_yeni_yol then
    insert into private.saklanan_dosya_gecmisi (tablo_adi, kayit_id, depolama_alani, depolama_yolu)
    values (tg_table_name, old.id, v_alan, v_eski_yol)
    on conflict (depolama_alani, depolama_yolu) do nothing;
  end if;
  return new;
end;
$$;

create trigger sertifika_dosya_gecmisi after update of belge_yolu on public.sertifikalar
for each row execute function private.eski_dosya_yolunu_koru();
create trigger profil_fotografi_gecmisi after update of profil_fotografi_yolu on public.sistem_kullanicilari
for each row execute function private.eski_dosya_yolunu_koru();

commit;
