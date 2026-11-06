begin;

create or replace function public.is_ilani_basvurulari(p_ilan_id uuid)
returns table (
  id uuid,
  ilan_id uuid,
  aday_id uuid,
  aday_adi text,
  cv_dosyasi_id uuid,
  on_yazi text,
  durum text,
  olusturma_tarihi timestamptz,
  guncelleme_tarihi timestamptz
)
language sql stable security definer
set search_path = ''
as $$
  select b.id, b.ilan_id, b.aday_id,
         nullif(btrim(concat_ws(' ', nullif(btrim(k.ad), ''), nullif(btrim(k.soyad), ''))), '') as aday_adi,
         b.cv_dosyasi_id, b.on_yazi, b.durum, b.olusturma_tarihi, b.guncelleme_tarihi
  from public.is_basvurulari b
  join public.is_ilanlari i on i.id = b.ilan_id
  join public.sistem_kullanicilari k on k.id = b.aday_id
  where b.ilan_id = p_ilan_id
    and b.is_deleted = false
    and i.is_deleted = false
    and (select private.sirket_uyesi_mi(i.sirket_id))
  order by b.olusturma_tarihi desc;
$$;

revoke all on function public.is_ilani_basvurulari(uuid) from public, anon;
grant execute on function public.is_ilani_basvurulari(uuid) to authenticated;

commit;
