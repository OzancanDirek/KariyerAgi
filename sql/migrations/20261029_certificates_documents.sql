begin;

alter table public.sertifikalar
  add column if not exists belge_yolu text,
  add column if not exists belge_dosya_adi text;

alter table public.sertifikalar
  add constraint sertifikalar_belge_yolu_adaya_ait
  check (belge_yolu is null or belge_yolu like aday_id::text || '/%'),
  add constraint sertifikalar_belge_yolu_uzunluk
  check (belge_yolu is null or char_length(belge_yolu) <= 500),
  add constraint sertifikalar_belge_adi_uzunluk
  check (belge_dosya_adi is null or char_length(belge_dosya_adi) <= 255);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sertifika-belgeleri',
  'sertifika-belgeleri',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do nothing;

create policy "sertifika-belgeleri: aday kendi klasorune yukler"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'sertifika-belgeleri'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select private.aday_profili_var_mi())
  );

create policy "sertifika-belgeleri: aday kendi dosyasini okur"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'sertifika-belgeleri'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "sertifika-belgeleri: aday kendi dosyasini siler"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'sertifika-belgeleri'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

commit;
