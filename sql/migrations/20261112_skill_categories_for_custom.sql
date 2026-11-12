-- Candidate-owned custom skills keep their category. No category is required for a dismissed CV suggestion.
alter table public.aday_becerileri
    add column if not exists kategori_id uuid references public.beceri_kategorileri(id) on delete restrict;

insert into public.beceriler (kategori_id, ad)
select id, 'C#' from public.beceri_kategorileri
where kod = 'programlama_dilleri'
  and not exists (select 1 from public.beceriler where lower(coalesce(ad, ad_en)) = lower('C#'));

-- Preserve existing candidate selections while correcting the category shown on the map.
update public.aday_becerileri
set kategori_id = (select id from public.beceri_kategorileri where kod = 'programlama_dilleri')
where beceri_id is null and lower(btrim(ozel_ad)) in ('c#', 'c sharp', 'csharp')
  and kategori_id is null;
