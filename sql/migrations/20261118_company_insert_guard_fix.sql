begin;

-- Check ownership-transfer privileges only for UPDATE. The helper is deliberately
-- not executable by authenticated users, so evaluating it during INSERT blocks
-- ordinary employer company creation with SQLSTATE 42501.
create or replace function private.pazar_yeri_alanlarini_koru()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  if tg_table_name = 'sirketler' then
    if tg_op = 'UPDATE' then
      if new.id <> old.id or new.olusturma_tarihi <> old.olusturma_tarihi
        or (new.sahip_kullanici_id <> old.sahip_kullanici_id
            and not private.sirket_sahiplik_devrinde_mi()) then
        raise exception 'Şirket sahibi ve kimliği değiştirilemez';
      end if;
    end if;
  elsif tg_table_name = 'is_ilanlari' then
    if tg_op = 'UPDATE' then
      if new.id <> old.id or new.sirket_id <> old.sirket_id
        or new.olusturma_tarihi <> old.olusturma_tarihi then
        raise exception 'İlanın şirketi ve kimliği değiştirilemez';
      end if;
    end if;
    if tg_op = 'INSERT' then
      new.yayin_tarihi := case when new.durum = 'yayinda' then now() else null end;
    elsif old.yayin_tarihi is not null then
      new.yayin_tarihi := old.yayin_tarihi;
    else
      new.yayin_tarihi := case when new.durum = 'yayinda' then now() else null end;
    end if;
  elsif tg_table_name = 'is_basvurulari' then
    if tg_op = 'UPDATE' then
      if new.id <> old.id or new.ilan_id <> old.ilan_id or new.aday_id <> old.aday_id
        or new.cv_dosyasi_id is distinct from old.cv_dosyasi_id
        or new.on_yazi is distinct from old.on_yazi
        or new.olusturma_tarihi <> old.olusturma_tarihi then
        raise exception 'Başvurunun kimliği ve içeriği değiştirilemez';
      end if;
      if old.durum <> new.durum
        and (old.durum <> 'gonderildi' or new.durum <> 'geri_cekildi') then
        raise exception 'Geçersiz başvuru durumu';
      end if;
    end if;
  end if;
  if tg_op = 'UPDATE' then
    if old.is_deleted and not new.is_deleted then
      raise exception 'Arşivlenen kayıt yeniden açılamaz';
    end if;
  end if;
  new.guncelleme_tarihi := now();
  return new;
end;
$$;

commit;
