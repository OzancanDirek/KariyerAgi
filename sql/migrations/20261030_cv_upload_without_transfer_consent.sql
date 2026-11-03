-- Modül 04: CV yükleme için önceki yurt dışı aktarım rızası bağımlılığını kaldırır.
-- Sahiplik, aday profili, özel bucket, MIME tipi ve 10 MB sınırı korunur.
begin;

drop policy if exists "cv_dosyalari: rizasi olan aday kendi dosyasini kaydeder" on public.cv_dosyalari;
drop policy if exists "cv_dosyalari: aday kendi dosyasini kaydeder" on public.cv_dosyalari;
create policy "cv_dosyalari: aday kendi dosyasini kaydeder"
  on public.cv_dosyalari for insert to authenticated
  with check (
    aday_id = (select auth.uid())
    and (select private.aday_profili_var_mi())
  );

drop policy if exists "cv-dosyalari: rizasi olan aday kendi klasorune yukler" on storage.objects;
drop policy if exists "cv-dosyalari: aday kendi klasorune yukler" on storage.objects;
create policy "cv-dosyalari: aday kendi klasorune yukler"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'cv-dosyalari'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select private.aday_profili_var_mi())
  );

commit;
