-- Aday başına Türkiye takvim gününde en çok iki CV analizi.
-- Başarısız/yarım kalan istekler 10 dakika sonra kotadan düşer.
create table if not exists public.cv_analiz_istekleri (
  id uuid primary key default gen_random_uuid(),
  aday_id uuid not null references public.aday_profilleri(id),
  gun date not null,
  bitis_tarihi timestamptz not null default (now() + interval '10 minutes'),
  olusturma_tarihi timestamptz not null default now()
);

create index if not exists cv_analiz_istekleri_aktif_idx
  on public.cv_analiz_istekleri (aday_id, gun, bitis_tarihi);

alter table public.cv_analiz_istekleri enable row level security;
alter table public.cv_analizleri
  add column if not exists kota_istegi_id uuid references public.cv_analiz_istekleri(id);

create or replace function private.cv_analizi_kullanilan_hak(p_aday_id uuid, p_gun date)
returns integer language sql stable security definer set search_path = '' as $$
  select (
    (select count(*) from public.cv_analizleri a
     where a.aday_id = p_aday_id and not a.is_deleted
       and (a.olusturma_tarihi at time zone 'Europe/Istanbul')::date = p_gun)
    +
    (select count(*) from public.cv_analiz_istekleri i
     where i.aday_id = p_aday_id and i.gun = p_gun
       and i.bitis_tarihi > now()
       and not exists (
         select 1 from public.cv_analizleri a
         where a.kota_istegi_id = i.id and not a.is_deleted
       ))
  )::integer;
$$;

revoke all on function private.cv_analizi_kullanilan_hak(uuid, date) from public, anon, authenticated;

create or replace function public.cv_analizi_kotasi()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_aday_id uuid := auth.uid();
  v_gun date := (now() at time zone 'Europe/Istanbul')::date;
  v_kullanilan integer;
begin
  if v_aday_id is null then
    raise exception 'Oturum gerekli';
  end if;

  v_kullanilan := private.cv_analizi_kullanilan_hak(v_aday_id, v_gun);
  return jsonb_build_object(
    'dailyLimit', 2,
    'used', v_kullanilan,
    'remaining', greatest(0, 2 - v_kullanilan),
    'resetsAt', ((v_gun + 1)::timestamp at time zone 'Europe/Istanbul')
  );
end;
$$;

create or replace function public.cv_analizi_hakki_ayir()
returns uuid language plpgsql volatile security definer set search_path = '' as $$
declare
  v_aday_id uuid := auth.uid();
  v_gun date := (now() at time zone 'Europe/Istanbul')::date;
  v_istek_id uuid;
begin
  if v_aday_id is null then
    raise exception 'Oturum gerekli';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_aday_id::text || ':' || v_gun::text, 0));
  if private.cv_analizi_kullanilan_hak(v_aday_id, v_gun) >= 2 then
    return null;
  end if;

  insert into public.cv_analiz_istekleri (aday_id, gun)
  values (v_aday_id, v_gun)
  returning id into v_istek_id;

  return v_istek_id;
end;
$$;

revoke all on function public.cv_analizi_kotasi() from public, anon;
revoke all on function public.cv_analizi_hakki_ayir() from public, anon;
grant execute on function public.cv_analizi_kotasi() to authenticated;
grant execute on function public.cv_analizi_hakki_ayir() to authenticated;
