begin;

-- PostgreSQL also checks SELECT visibility for the row produced by UPDATE.
-- Owners may read their archived rows so a soft delete can complete; API lists
-- still filter is_deleted = false. Other users see only active published data.
drop policy if exists sirketler_okuma on public.sirketler;
create policy sirketler_okuma on public.sirketler for select to authenticated
using (is_deleted = false or sahip_kullanici_id = (select auth.uid()));

drop policy if exists is_ilanlari_okuma on public.is_ilanlari;
create policy is_ilanlari_okuma on public.is_ilanlari for select to authenticated
using (
  exists (
    select 1 from public.sirketler s
    where s.id = sirket_id and s.sahip_kullanici_id = (select auth.uid())
  )
  or (
    is_deleted = false and durum = 'yayinda'
    and exists (
      select 1 from public.sirketler s
      where s.id = sirket_id and s.is_deleted = false
    )
  )
);

commit;
