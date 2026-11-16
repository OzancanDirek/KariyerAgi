begin;

-- Only the definer RPC may change the otherwise immutable owner and owner roles.
create or replace function private.sirket_sahiplik_devrinde_mi()
returns boolean language sql stable set search_path = '' as $$
  select current_setting('careerpath.ownership_transfer', true) = 'active'
    and current_user = 'postgres';
$$;
revoke all on function private.sirket_sahiplik_devrinde_mi() from public, anon, authenticated;

create or replace function private.pazar_yeri_alanlarini_koru()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  if tg_table_name = 'sirketler' then
    if tg_op = 'UPDATE' and (new.id <> old.id or new.olusturma_tarihi <> old.olusturma_tarihi
      or (new.sahip_kullanici_id <> old.sahip_kullanici_id and not private.sirket_sahiplik_devrinde_mi())) then
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

create or replace function private.sirket_uyeligini_koru()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if tg_op = 'INSERT' then
    if not private.sirket_sahibi_mi(new.sirket_id)
       or not ((new.gorev = 'sahip' and new.durum = 'aktif' and new.kullanici_id = auth.uid())
            or (new.gorev = 'ise_alim' and new.durum = 'beklemede'))
       or not exists (
         select 1 from public.kullanici_roller kr join public.roller r on r.id = kr.rol_id
         where kr.kullanici_id = new.kullanici_id and r.kod = 'isveren'
       ) then
      raise exception 'Geçersiz şirket daveti';
    end if;
  elsif tg_op = 'UPDATE' then
    if new.id <> old.id or new.sirket_id <> old.sirket_id or new.kullanici_id <> old.kullanici_id
       or new.olusturma_tarihi <> old.olusturma_tarihi then
      raise exception 'Şirket üyeliği değiştirilemez';
    end if;
    if new.gorev <> old.gorev or old.gorev = 'sahip' then
      if not private.sirket_sahiplik_devrinde_mi()
         or new.durum <> 'aktif' or new.is_deleted or old.durum <> 'aktif' or old.is_deleted
         or not ((old.gorev = 'sahip' and new.gorev = 'ise_alim')
              or (old.gorev = 'ise_alim' and new.gorev = 'sahip')) then
        raise exception 'Şirket üyeliği değiştirilemez';
      end if;
    elsif new.is_deleted and not old.is_deleted then
      if not private.sirket_sahibi_mi(old.sirket_id) then
        raise exception 'Üyeyi yalnızca şirket sahibi kaldırabilir';
      end if;
    elsif old.durum = 'beklemede' and new.durum in ('aktif', 'reddedildi')
      and old.kullanici_id = auth.uid() and not new.is_deleted then
      null;
    else
      raise exception 'Geçersiz üyelik güncellemesi';
    end if;
  end if;
  new.guncelleme_tarihi := now();
  return new;
end;
$$;

create or replace function public.sirket_sahipligini_devret(p_sirket_id uuid, p_yeni_sahip_uyelik_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_eski_sahip uuid := auth.uid();
  v_yeni_sahip uuid;
begin
  if v_eski_sahip is null or not exists (
    select 1 from public.sirketler
    where id = p_sirket_id and sahip_kullanici_id = v_eski_sahip and not is_deleted
    for update
  ) then
    raise exception 'Şirket sahibi değilsiniz';
  end if;
  select kullanici_id into v_yeni_sahip
  from public.sirket_uyelikleri
  where id = p_yeni_sahip_uyelik_id and sirket_id = p_sirket_id
    and gorev = 'ise_alim' and durum = 'aktif' and not is_deleted
  for update;
  if v_yeni_sahip is null or v_yeni_sahip = v_eski_sahip
    or not exists (select 1 from public.sistem_kullanicilari where id = v_yeni_sahip)
    or exists (select 1 from private.hesap_kapatma_talepleri where kullanici_id = v_yeni_sahip) then
    raise exception 'Aktif işe alım çalışanı seçin';
  end if;
  if not exists (
    select 1 from public.sirket_uyelikleri
    where sirket_id = p_sirket_id and kullanici_id = v_eski_sahip
      and gorev = 'sahip' and durum = 'aktif' and not is_deleted
    for update
  ) then
    raise exception 'Şirket sahibi üyeliği bulunamadı';
  end if;

  perform set_config('careerpath.ownership_transfer', 'active', true);
  update public.sirketler set sahip_kullanici_id = v_yeni_sahip where id = p_sirket_id;
  update public.sirket_uyelikleri set gorev = 'ise_alim'
    where sirket_id = p_sirket_id and kullanici_id = v_eski_sahip and not is_deleted;
  update public.sirket_uyelikleri set gorev = 'sahip'
    where id = p_yeni_sahip_uyelik_id;
  perform set_config('careerpath.ownership_transfer', '', true);
end;
$$;
revoke all on function public.sirket_sahipligini_devret(uuid, uuid) from public, anon;
grant execute on function public.sirket_sahipligini_devret(uuid, uuid) to authenticated;

create or replace function public.sirket_uyelerini_listele(p_sirket_id uuid)
returns table (id uuid, sirket_id uuid, kullanici_id uuid, gorev text, durum text,
  uye_adi text, uye_eposta text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.sirketler s
    where s.id = p_sirket_id and s.sahip_kullanici_id = auth.uid() and not s.is_deleted
  ) then
    raise exception 'Şirket sahibi değilsiniz';
  end if;
  return query
    select u.id, u.sirket_id, u.kullanici_id, u.gorev, u.durum,
      concat_ws(' ', k.ad, k.soyad), k.eposta
    from public.sirket_uyelikleri u
    join public.sistem_kullanicilari k on k.id = u.kullanici_id
    where u.sirket_id = p_sirket_id and not u.is_deleted
    order by u.olusturma_tarihi, u.id;
end;
$$;
revoke all on function public.sirket_uyelerini_listele(uuid) from public, anon;
grant execute on function public.sirket_uyelerini_listele(uuid) to authenticated;

commit;
