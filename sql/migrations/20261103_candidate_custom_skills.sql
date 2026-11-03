alter table public.aday_becerileri
    alter column beceri_id drop not null,
    add column ozel_ad text;

alter table public.aday_becerileri
    add constraint aday_becerileri_tek_kaynak check (
        (beceri_id is not null) <> (ozel_ad is not null)
        and (ozel_ad is null or char_length(btrim(ozel_ad)) between 1 and 80)
    );

create unique index aday_becerileri_aktif_ozel_ad_idx
    on public.aday_becerileri(aday_id, lower(ozel_ad))
    where is_deleted = false and ozel_ad is not null;

-- A deleted row also records that the candidate dismissed a CV suggestion.
-- It remains visible only to the candidate and never counts as a saved skill.
create policy aday_becerileri_ozel_oneri_gizle on public.aday_becerileri
    for insert to authenticated
    with check (aday_id = auth.uid() and is_deleted = true);
