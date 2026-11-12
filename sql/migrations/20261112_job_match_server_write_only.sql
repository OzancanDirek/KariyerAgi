-- Only the .NET API, using a server-side service role key, may persist a match.
-- Apply after configuring Supabase:SecretKey on the API server.
begin;

create or replace function public.is_basvurusu_eslestirmesini_kaydet(
  p_basvuru_id uuid, p_olcut_surumu integer, p_puan integer, p_dayanaklar jsonb
)
returns setof public.is_basvuru_eslestirmeleri
language plpgsql security definer set search_path = '' as $$
declare
  v_ilan_id uuid;
begin
  if (select auth.role()) is distinct from 'service_role' then
    raise exception 'JOB_MATCH_FORBIDDEN';
  end if;

  select b.ilan_id into v_ilan_id
    from public.is_basvurulari b
    join public.is_ilanlari i on i.id = b.ilan_id
    where b.id = p_basvuru_id and not b.is_deleted
      and b.durum <> 'geri_cekildi' and not i.is_deleted;

  if v_ilan_id is null then
    raise exception 'JOB_MATCH_FORBIDDEN';
  end if;

  if p_puan not between 0 and 100 or jsonb_typeof(p_dayanaklar) <> 'array'
    or not exists (
      select 1 from public.is_ilani_eslestirme_olcutleri c
      where c.ilan_id = v_ilan_id and c.surum = p_olcut_surumu and not c.is_deleted
    ) then
    raise exception 'JOB_MATCH_CRITERIA_INVALID';
  end if;

  insert into public.is_basvuru_eslestirmeleri
    (basvuru_id, ilan_id, olcut_surumu, puan, dayanaklar)
  values
    (p_basvuru_id, v_ilan_id, p_olcut_surumu, p_puan, p_dayanaklar)
  on conflict (basvuru_id) do update
    set olcut_surumu = excluded.olcut_surumu,
        puan = excluded.puan,
        dayanaklar = excluded.dayanaklar,
        olusturma_tarihi = now(),
        is_deleted = false;

  return query select * from public.is_basvuru_eslestirmeleri
    where basvuru_id = p_basvuru_id;
end;
$$;

revoke all on function public.is_basvurusu_eslestirmesini_kaydet(uuid, integer, integer, jsonb)
  from public, anon, authenticated;
grant execute on function public.is_basvurusu_eslestirmesini_kaydet(uuid, integer, integer, jsonb)
  to service_role;

commit;
