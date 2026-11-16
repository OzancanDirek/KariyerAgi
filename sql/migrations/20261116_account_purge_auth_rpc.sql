begin;

-- Called only by the purge worker after application data has been removed.
create or replace function public.hesap_imha_auth(p_talep_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_uid uuid;
begin
  select kullanici_id into v_uid
    from private.hesap_kapatma_talepleri
    where id = p_talep_id and imha_tarihi <= now() and durum = 'veri_silindi'
    for update;
  if not found then raise exception 'İmha talebi hazır değil'; end if;
  if v_uid is not null then
    delete from auth.users where id = v_uid;
  end if;
end;
$$;
revoke all on function public.hesap_imha_auth(uuid) from public, anon, authenticated;
grant execute on function public.hesap_imha_auth(uuid) to service_role;

commit;
