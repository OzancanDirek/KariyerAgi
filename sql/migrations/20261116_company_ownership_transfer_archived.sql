begin;

-- Archived companies still reference their owner. Allow their owner to
-- transfer ownership before account closure, without restoring the company.
create or replace function public.sirket_sahipligini_devret(p_sirket_id uuid, p_yeni_sahip_uyelik_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_eski_sahip uuid := auth.uid();
  v_yeni_sahip uuid;
begin
  perform 1 from public.sirketler
    where id = p_sirket_id and sahip_kullanici_id = v_eski_sahip
    for update;
  if v_eski_sahip is null or not found then
    raise exception 'Şirket sahibi değilsiniz';
  end if;

  select kullanici_id into v_yeni_sahip from public.sirket_uyelikleri
    where id = p_yeni_sahip_uyelik_id and sirket_id = p_sirket_id
      and gorev = 'ise_alim' and durum = 'aktif' and not is_deleted
    for update;
  if v_yeni_sahip is null or v_yeni_sahip = v_eski_sahip
    or not exists (select 1 from public.sistem_kullanicilari where id = v_yeni_sahip)
    or exists (select 1 from private.hesap_kapatma_talepleri where kullanici_id = v_yeni_sahip) then
    raise exception 'Aktif işe alım çalışanı seçin';
  end if;
  perform 1 from public.sirket_uyelikleri
    where sirket_id = p_sirket_id and kullanici_id = v_eski_sahip
      and gorev = 'sahip' and durum = 'aktif' and not is_deleted
    for update;
  if not found then raise exception 'Şirket sahibi üyeliği bulunamadı'; end if;

  perform set_config('careerpath.ownership_transfer', 'active', true);
  update public.sirketler set sahip_kullanici_id = v_yeni_sahip where id = p_sirket_id;
  update public.sirket_uyelikleri set gorev = 'ise_alim'
    where sirket_id = p_sirket_id and kullanici_id = v_eski_sahip and not is_deleted;
  update public.sirket_uyelikleri set gorev = 'sahip' where id = p_yeni_sahip_uyelik_id;
  perform set_config('careerpath.ownership_transfer', '', true);
end;
$$;

create or replace function public.sirket_uyelerini_listele(p_sirket_id uuid)
returns table (id uuid, sirket_id uuid, kullanici_id uuid, gorev text, durum text,
  uye_adi text, uye_eposta text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.sirketler s
    where s.id = p_sirket_id and s.sahip_kullanici_id = auth.uid()
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

commit;
