begin;

-- Şirket arşivlenmeden önce ilanları kapat. İşlem tek transaction içinde kalır;
-- ilan güncellemesi başarısız olursa şirket de arşivlenmez.
create or replace function private.sirket_arsivlenince_ilanlari_kapat()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.is_deleted and not old.is_deleted then
    update public.is_ilanlari
    set durum = 'kapali'
    where sirket_id = old.id
      and is_deleted = false
      and durum = 'yayinda';
  end if;

  return new;
end;
$$;

create trigger sirket_arsivleme_ilan_kapatma
before update of is_deleted on public.sirketler
for each row
execute function private.sirket_arsivlenince_ilanlari_kapat();

-- Bu üç tabloda silme yalnızca is_deleted üzerinden yapılır.
revoke delete on public.sirketler, public.is_ilanlari, public.is_basvurulari
from anon, authenticated;

commit;
