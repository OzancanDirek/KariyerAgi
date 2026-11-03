-- Yeni CV yüklemelerini PDF ile sınırlar. Önceden yüklenmiş DOCX dosyaları korunur.
begin;

update storage.buckets
set allowed_mime_types = array['application/pdf'],
    file_size_limit = 10485760
where id = 'cv-dosyalari';

drop policy if exists "cv-dosyalari: aday kendi klasorune yukler" on storage.objects;
create policy "cv-dosyalari: aday kendi klasorune yukler"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'cv-dosyalari'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and lower(right(name, 4)) = '.pdf'
    and (select private.aday_profili_var_mi())
  );

drop policy if exists "cv_dosyalari: aday kendi dosyasini kaydeder" on public.cv_dosyalari;
create policy "cv_dosyalari: aday kendi dosyasini kaydeder"
  on public.cv_dosyalari for insert to authenticated
  with check (
    aday_id = (select auth.uid())
    and mime_tipi = 'application/pdf'
    and (select private.aday_profili_var_mi())
  );

commit;
