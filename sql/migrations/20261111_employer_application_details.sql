begin;

-- Yalnızca başvurunun bağlı olduğu şirketin etkin üyeleri adayın başvuru özetini görebilir.
create or replace function public.is_basvurusu_aday_detayi(p_basvuru_id uuid)
returns table (
  id uuid, ilan_id uuid, aday_id uuid, aday_adi text,
  eposta text, telefon text, konum text, unvan text, ozet text,
  deneyim_seviyesi text, linkedin_url text, github_url text, portfolyo_url text,
  cv_dosyasi_id uuid, cv_dosya_adi text, cv_depolama_yolu text, cv_mime_tipi text,
  on_yazi text, durum text, olusturma_tarihi timestamptz
)
language sql stable security definer
set search_path = ''
as $$
  select b.id, b.ilan_id, b.aday_id,
         nullif(btrim(concat_ws(' ', nullif(btrim(k.ad), ''), nullif(btrim(k.soyad), ''))), ''),
         k.eposta, k.telefon, k.konum, p.unvan, p.ozet,
         p.deneyim_seviyesi, p.linkedin_url, p.github_url, p.portfolyo_url,
         c.id, c.orijinal_dosya_adi, c.depolama_yolu, c.mime_tipi,
         b.on_yazi, b.durum, b.olusturma_tarihi
  from public.is_basvurulari b
  join public.is_ilanlari i on i.id = b.ilan_id and i.is_deleted = false
  join public.sistem_kullanicilari k on k.id = b.aday_id
  left join public.aday_profilleri p on p.id = b.aday_id
  left join public.cv_dosyalari c on c.id = b.cv_dosyasi_id
    and c.aday_id = b.aday_id and c.is_deleted = false
  where b.id = p_basvuru_id
    and b.is_deleted = false
    and b.durum <> 'geri_cekildi'
    and (select private.sirket_uyesi_mi(i.sirket_id));
$$;

revoke all on function public.is_basvurusu_aday_detayi(uuid) from public, anon;
grant execute on function public.is_basvurusu_aday_detayi(uuid) to authenticated;

-- Depodaki nesneye erişim sadece aktif başvuruda seçilmiş dosya için açılır.
create or replace function private.is_basvurusuna_ekli_cv_mi(p_depolama_yolu text)
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.cv_dosyalari c
    join public.is_basvurulari b on b.cv_dosyasi_id = c.id
      and b.aday_id = c.aday_id and b.is_deleted = false
      and b.durum <> 'geri_cekildi'
    join public.is_ilanlari i on i.id = b.ilan_id and i.is_deleted = false
    where c.depolama_yolu = p_depolama_yolu and c.is_deleted = false
      and (select private.sirket_uyesi_mi(i.sirket_id))
  );
$$;

revoke all on function private.is_basvurusuna_ekli_cv_mi(text) from public, anon;
grant execute on function private.is_basvurusuna_ekli_cv_mi(text) to authenticated;

drop policy if exists "cv-dosyalari: basvurulan sirket secilen cvyi gorur" on storage.objects;
create policy "cv-dosyalari: basvurulan sirket secilen cvyi gorur"
  on storage.objects for select to authenticated
  using (bucket_id = 'cv-dosyalari' and (select private.is_basvurusuna_ekli_cv_mi(name)));

commit;
