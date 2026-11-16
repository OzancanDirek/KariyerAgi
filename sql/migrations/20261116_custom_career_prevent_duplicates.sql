-- Keep historical drafts, but prevent a candidate from creating another active
-- draft for the same profession. The advisory lock also covers concurrent requests.
create or replace function public.aday_ozel_meslek_tekrarini_engelle()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  normalized_name text;
begin
  normalized_name := lower(regexp_replace(btrim(new.meslek_adi), '[[:space:]]+', ' ', 'g'));
  new.meslek_adi := regexp_replace(btrim(new.meslek_adi), '[[:space:]]+', ' ', 'g');
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.aday_id::text || ':' || normalized_name, 0));

  if exists (
    select 1 from public.aday_ozel_meslek_taslaklari existing
    where existing.aday_id = new.aday_id
      and existing.id is distinct from new.id
      and existing.durum in ('processing', 'draft', 'confirmed')
      and lower(regexp_replace(btrim(existing.meslek_adi), '[[:space:]]+', ' ', 'g')) = normalized_name
  ) then
    raise exception 'Bu meslek zaten kayıtlı.' using errcode = '23505';
  end if;
  return new;
end;
$$;

drop trigger if exists aday_ozel_meslek_tekrari on public.aday_ozel_meslek_taslaklari;
create trigger aday_ozel_meslek_tekrari
before insert or update of meslek_adi on public.aday_ozel_meslek_taslaklari
for each row execute function public.aday_ozel_meslek_tekrarini_engelle();
