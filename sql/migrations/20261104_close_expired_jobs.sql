begin;

create extension if not exists pg_cron with schema extensions;

create or replace function private.kapanan_ilanlari_kapat()
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  update public.is_ilanlari
  set durum = 'kapali'
  where durum = 'yayinda' and is_deleted = false
    and son_basvuru_tarihi is not null
    and son_basvuru_tarihi <= now();
end;
$$;

select private.kapanan_ilanlari_kapat();
select cron.schedule('careerpath-close-expired-jobs', '* * * * *',
  'select private.kapanan_ilanlari_kapat()');

commit;
