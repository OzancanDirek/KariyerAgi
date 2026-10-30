begin;

alter table public.sistem_kullanicilari
    add column if not exists profil_fotografi_yolu text;

do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conname = 'sistem_kullanicilari_fotograf_yolu_sahibi'
    ) then
        alter table public.sistem_kullanicilari
            add constraint sistem_kullanicilari_fotograf_yolu_sahibi
            check (profil_fotografi_yolu is null or profil_fotografi_yolu like id::text || '/%');
    end if;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profil-fotograflari', 'profil-fotograflari', false, 3145728, array['image/jpeg', 'image/png'])
on conflict (id) do nothing;

drop policy if exists "profil-fotograflari: kendi fotografini yukler" on storage.objects;
create policy "profil-fotograflari: kendi fotografini yukler"
    on storage.objects for insert to authenticated
    with check (
        bucket_id = 'profil-fotograflari'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

drop policy if exists "profil-fotograflari: kendi fotografini okur" on storage.objects;
create policy "profil-fotograflari: kendi fotografini okur"
    on storage.objects for select to authenticated
    using (
        bucket_id = 'profil-fotograflari'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

drop policy if exists "profil-fotograflari: kendi fotografini siler" on storage.objects;
create policy "profil-fotograflari: kendi fotografini siler"
    on storage.objects for delete to authenticated
    using (
        bucket_id = 'profil-fotograflari'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

commit;
