-- Mobile app feedback on recommendations ("was this suggestion useful?"): new table public.oneri_geri_bildirimleri.
-- Only adds a new table, two private trigger functions and its own RLS policies; no existing table is changed.
-- A user can insert/read/update only their own rows (no DELETE: soft delete via is_deleted).
-- oneri_hedef_id points to meslekler.id or is_ilanlari.id, so there is no FK; a BEFORE INSERT trigger checks that
-- the target exists (meslek: aktif_mi; ilan: durum <> taslak and not is_deleted, so closed jobs are accepted).
-- Data integrity only: it does not prove the item was actually recommended to the user.
-- Not applied to the shared database yet; to be reviewed together before applying.
begin;

create table if not exists public.oneri_geri_bildirimleri (
  id                uuid primary key default gen_random_uuid(),
  kullanici_id      uuid not null references public.sistem_kullanicilari (id),
  oneri_turu        text not null check (oneri_turu in ('meslek', 'ilan')),
  -- meslekler.id ya da is_ilanlari.id. Çok biçimli (iki tabloya işaret ettiği) olduğu için
  -- yabancı anahtar YOK; böylece web tarafı bir meslek/ilanı silse/arşivlese bile geri bildirim kalır.
  oneri_hedef_id    uuid not null,
  faydali_mi        boolean not null,
  is_deleted        boolean not null default false,
  olusturma_tarihi  timestamptz not null default now(),
  guncelleme_tarihi timestamptz not null default now(),
  -- Aynı kullanıcı aynı öneriye tek görüş bildirir; fikir değişirse satır güncellenir (upsert).
  constraint oneri_geri_bildirimleri_tekil unique (kullanici_id, oneri_turu, oneri_hedef_id)
);

comment on table public.oneri_geri_bildirimleri is
  'Kullanıcının meslek/ilan önerisine verdiği faydalı mı geri bildirimi.';

create index if not exists oneri_geri_bildirimleri_hedef_idx
  on public.oneri_geri_bildirimleri (oneri_turu, oneri_hedef_id);

-- Güncellemede tarih yazılır; kimlik alanları değiştirilemez.
create or replace function private.oneri_geri_bildirimini_koru()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id <> old.id
     or new.kullanici_id <> old.kullanici_id
     or new.oneri_turu <> old.oneri_turu
     or new.oneri_hedef_id <> old.oneri_hedef_id
     or new.olusturma_tarihi <> old.olusturma_tarihi then
    raise exception 'Geri bildirimin kimliği değiştirilemez';
  end if;
  new.guncelleme_tarihi := now();
  return new;
end;
$$;

drop trigger if exists oneri_geri_bildirimi_koruma on public.oneri_geri_bildirimleri;
create trigger oneri_geri_bildirimi_koruma
  before update on public.oneri_geri_bildirimleri
  for each row execute function private.oneri_geri_bildirimini_koru();

-- Hedefin varlığı (INSERT) -----------------------------------------------------
-- Neden SECURITY DEFINER: bu denetim kullanıcının RLS'iyle yapılsaydı, `is_ilanlari` okuma politikası
-- yalnızca yayındaki, silinmemiş ve silinmemiş şirketin ilanını (ya da şirket üyesi ise hepsini)
-- gösterdiği için, kullanıcının az önce gördüğü ama o anda kapanmış (`kapali`) bir ilanda "yok" sanıp
-- YANLIŞ REDDEDERDİK. Fonksiyon sahibinin yetkisiyle yalnızca "var mı?" sorar; satır içeriği
-- döndürmez (yalnızca doğru/yanlış), `search_path` boş: nesneler şema adıyla yazılır.
-- Var olma ölçütü: meslek → `aktif_mi = true`; ilan → `durum <> 'taslak' and not is_deleted`
-- (`is_ilanlari_durum_check`: taslak | yayinda | kapali). TASLAK ilan reddedilir: hiç yayınlanmamış,
-- kimseye önerilemez. SİLİNMİŞ (`is_deleted = true`) ilan reddedilir. KAPANMIŞ (`kapali`, silinmemiş)
-- ilan KABUL edilir: kullanıcı ilanı kapanmadan önce görmüş olabilir; yanlış red çıkmasın.
-- ÖNEMLİ SINIR: Bu denetim VERİ BÜTÜNLÜĞÜ kontrolüdür; ilanın kullanıcıya gerçekten önerildiğini
-- KANITLAMAZ (öneri kaydı tutulmuyor). Kimlik tahmin edilemez bir uuid olduğu için tek bitlik
-- doğru/yanlış sızıntısı kabul edilebilir; yine de yalnızca INSERT sırasında çalışır.
create or replace function private.oneri_hedefini_dogrula()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_var boolean;
begin
  if new.oneri_turu = 'meslek' then
    select exists (
      select 1 from public.meslekler m where m.id = new.oneri_hedef_id and m.aktif_mi
    ) into v_var;
  elsif new.oneri_turu = 'ilan' then
    select exists (
      select 1 from public.is_ilanlari i where i.id = new.oneri_hedef_id and i.durum <> 'taslak' and not i.is_deleted
    ) into v_var;
  else
    v_var := false; -- CHECK zaten engeller; savunma amaçlı
  end if;

  if not v_var then
    raise exception 'Geri bildirim verilen % bulunamadı ya da artık yok.', new.oneri_turu
      using errcode = '23503';
  end if;
  return new;
end;
$$;

revoke all on function private.oneri_hedefini_dogrula() from public, anon, authenticated;

drop trigger if exists oneri_hedefi_dogrulama on public.oneri_geri_bildirimleri;
create trigger oneri_hedefi_dogrulama
  before insert on public.oneri_geri_bildirimleri
  for each row execute function private.oneri_hedefini_dogrula();

-- RLS ------------------------------------------------------------------------
alter table public.oneri_geri_bildirimleri enable row level security;

drop policy if exists oneri_geri_bildirimleri_select on public.oneri_geri_bildirimleri;
create policy oneri_geri_bildirimleri_select on public.oneri_geri_bildirimleri
  for select to authenticated
  using (kullanici_id = (select auth.uid()));

drop policy if exists oneri_geri_bildirimleri_insert on public.oneri_geri_bildirimleri;
create policy oneri_geri_bildirimleri_insert on public.oneri_geri_bildirimleri
  for insert to authenticated
  with check (kullanici_id = (select auth.uid()) and is_deleted = false);

drop policy if exists oneri_geri_bildirimleri_update on public.oneri_geri_bildirimleri;
create policy oneri_geri_bildirimleri_update on public.oneri_geri_bildirimleri
  for update to authenticated
  using (kullanici_id = (select auth.uid()))
  with check (kullanici_id = (select auth.uid()));

-- Yetkiler: oturum açmış kullanıcı select/insert/update; anon hiçbir şey; DELETE yok.
revoke all on public.oneri_geri_bildirimleri from anon, authenticated;
grant select, insert, update on public.oneri_geri_bildirimleri to authenticated;
grant all on public.oneri_geri_bildirimleri to service_role;

commit;

-- DOĞRULAMA (isteğe bağlı) ---------------------------------------------------
-- select relrowsecurity from pg_class where oid = 'public.oneri_geri_bildirimleri'::regclass;  -- true
-- select policyname, cmd from pg_policies where tablename = 'oneri_geri_bildirimleri';        -- 3 satır
-- select tgname from pg_trigger where tgrelid = 'public.oneri_geri_bildirimleri'::regclass and not tgisinternal;
--   -- oneri_geri_bildirimi_koruma + oneri_hedefi_dogrulama
-- Beklenen davranış (uygulamadan önce test hesabıyla, yalnızca elle):
--   insert … oneri_turu='ilan', oneri_hedef_id = gen_random_uuid() → 23503 "Geri bildirim verilen ilan bulunamadı…"
--   aynı (kullanıcı, tür, hedef) için ikinci insert → tekillik hatası (23505); mobil bunun yerine upsert kullanır.

-- GERİ ALMA (gerekirse; tablo yeni olduğu için veri kaybı yalnızca geri bildirimlerdir) ----
-- drop table if exists public.oneri_geri_bildirimleri;
-- drop function if exists private.oneri_geri_bildirimini_koru();
-- drop function if exists private.oneri_hedefini_dogrula();

