-- Run after the application no longer uses this table. Abort if it contains data.
do $$
begin
    if exists (select 1 from public.proje_becerileri limit 1) then
        raise exception 'proje_becerileri contains data; migration aborted';
    end if;
end $$;

drop table public.proje_becerileri;
