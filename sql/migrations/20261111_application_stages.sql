begin;

alter table public.is_basvurulari drop constraint if exists is_basvurulari_durum_check;
alter table public.is_basvurulari add constraint is_basvurulari_durum_check
  check (durum in ('gonderildi', 'inceleniyor', 'mulakat', 'teklif', 'reddedildi', 'geri_cekildi'));

drop index if exists public.is_basvurulari_tek_etkin_idx;
create unique index is_basvurulari_tek_etkin_idx on public.is_basvurulari(ilan_id, aday_id)
  where is_deleted = false and durum <> 'geri_cekildi';

create or replace function private.is_basvurusu_alan_koruma()
returns trigger language plpgsql set search_path = '' as $$
declare
  v_sirket_id uuid;
begin
  if new.id <> old.id or new.ilan_id <> old.ilan_id or new.aday_id <> old.aday_id
     or new.cv_dosyasi_id is distinct from old.cv_dosyasi_id
     or new.on_yazi is distinct from old.on_yazi
     or new.olusturma_tarihi <> old.olusturma_tarihi then
    raise exception 'Başvurunun kimliği ve içeriği değiştirilemez';
  end if;

  if old.is_deleted and not new.is_deleted then
    raise exception 'Arşivlenen kayıt yeniden açılamaz';
  end if;

  if old.durum is distinct from new.durum then
    if new.durum = 'geri_cekildi' and old.aday_id = (select auth.uid())
       and old.durum in ('gonderildi', 'inceleniyor', 'mulakat', 'teklif') then
      null;
    else
      select i.sirket_id into v_sirket_id from public.is_ilanlari i
        where i.id = old.ilan_id and i.is_deleted = false;
      if v_sirket_id is null or not (select private.sirket_uyesi_mi(v_sirket_id))
         or not (
           (old.durum = 'gonderildi' and new.durum in ('inceleniyor', 'reddedildi'))
           or (old.durum = 'inceleniyor' and new.durum in ('mulakat', 'reddedildi'))
           or (old.durum = 'mulakat' and new.durum in ('teklif', 'reddedildi'))
         ) then
        raise exception 'Geçersiz başvuru durumu';
      end if;
    end if;
  end if;

  new.guncelleme_tarihi := now();
  return new;
end;
$$;

drop trigger if exists is_basvurulari_alan_koruma on public.is_basvurulari;
create trigger is_basvurulari_alan_koruma before update on public.is_basvurulari
  for each row execute function private.is_basvurusu_alan_koruma();

drop policy if exists is_basvurulari_guncelleme on public.is_basvurulari;
create policy is_basvurulari_guncelleme on public.is_basvurulari for update to authenticated
  using (aday_id = (select auth.uid()) and durum in ('gonderildi', 'inceleniyor', 'mulakat', 'teklif') and is_deleted = false)
  with check (aday_id = (select auth.uid()) and durum = 'geri_cekildi' and is_deleted = false);

create or replace function public.is_basvurusu_asamasini_guncelle(p_basvuru_id uuid, p_durum text)
returns setof public.is_basvurulari language plpgsql security definer set search_path = '' as $$
declare
  v_ilan_id uuid;
  v_sirket_id uuid;
begin
  select b.ilan_id, i.sirket_id into v_ilan_id, v_sirket_id
    from public.is_basvurulari b
    join public.is_ilanlari i on i.id = b.ilan_id
    where b.id = p_basvuru_id and b.is_deleted = false and i.is_deleted = false;

  if v_ilan_id is null or not (select private.sirket_uyesi_mi(v_sirket_id)) then
    raise exception 'Başvuru bulunamadı';
  end if;

  if p_durum not in ('inceleniyor', 'mulakat', 'teklif', 'reddedildi') then
    raise exception 'Geçersiz başvuru durumu';
  end if;

  return query update public.is_basvurulari b set durum = p_durum
    where b.id = p_basvuru_id and b.is_deleted = false and b.durum <> p_durum
      and ((b.durum = 'gonderildi' and p_durum in ('inceleniyor', 'reddedildi'))
        or (b.durum = 'inceleniyor' and p_durum in ('mulakat', 'reddedildi'))
        or (b.durum = 'mulakat' and p_durum in ('teklif', 'reddedildi')))
    returning b.*;
end;
$$;

revoke all on function public.is_basvurusu_asamasini_guncelle(uuid, text) from public, anon;
grant execute on function public.is_basvurusu_asamasini_guncelle(uuid, text) to authenticated;

commit;
