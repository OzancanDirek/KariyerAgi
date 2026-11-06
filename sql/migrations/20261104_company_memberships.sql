begin;

create table public.sirket_uyelikleri (
  id uuid primary key default gen_random_uuid(),
  sirket_id uuid not null references public.sirketler(id),
  kullanici_id uuid not null references public.sistem_kullanicilari(id),
  gorev text not null check (gorev in ('sahip', 'ise_alim')),
  durum text not null default 'beklemede' check (durum in ('beklemede', 'aktif', 'reddedildi')),
  is_deleted boolean not null default false,
  olusturma_tarihi timestamptz not null default now(),
  guncelleme_tarihi timestamptz not null default now()
);

create unique index sirket_uyelikleri_tek_aktif_idx
on public.sirket_uyelikleri(sirket_id, kullanici_id) where is_deleted = false;
create index sirket_uyelikleri_kullanici_idx on public.sirket_uyelikleri(kullanici_id, durum)
where is_deleted = false;

insert into public.sirket_uyelikleri(sirket_id, kullanici_id, gorev, durum)
select id, sahip_kullanici_id, 'sahip', 'aktif'
from public.sirketler;

create or replace function private.sirket_uyesi_mi(p_sirket_id uuid)
returns boolean language sql stable security definer
set search_path = public, pg_temp as $$
  select exists (
    select 1 from public.sirket_uyelikleri u
    join public.sirketler s on s.id = u.sirket_id
    where u.sirket_id = p_sirket_id
      and u.kullanici_id = (select auth.uid())
      and u.durum = 'aktif' and u.is_deleted = false and s.is_deleted = false
  );
$$;

create or replace function private.sirket_sahibi_mi(p_sirket_id uuid)
returns boolean language sql stable security definer
set search_path = public, pg_temp as $$
  select exists (
    select 1 from public.sirketler s
    where s.id = p_sirket_id and s.sahip_kullanici_id = (select auth.uid()) and s.is_deleted = false
  );
$$;

create or replace function private.sirket_sahibini_uyelestir()
returns trigger language plpgsql security definer
set search_path = public, pg_temp as $$
begin
  insert into public.sirket_uyelikleri(sirket_id, kullanici_id, gorev, durum)
  values (new.id, new.sahip_kullanici_id, 'sahip', 'aktif');
  return new;
end;
$$;

create trigger sirket_sahibi_uyeligi
after insert on public.sirketler for each row
execute function private.sirket_sahibini_uyelestir();

create or replace function private.sirket_uyeligini_koru()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if tg_op = 'INSERT' then
    if not private.sirket_sahibi_mi(new.sirket_id)
       or not ((new.gorev = 'sahip' and new.durum = 'aktif' and new.kullanici_id = auth.uid())
            or (new.gorev = 'ise_alim' and new.durum = 'beklemede'))
       or not exists (
         select 1 from public.kullanici_roller kr join public.roller r on r.id = kr.rol_id
         where kr.kullanici_id = new.kullanici_id and r.kod = 'isveren'
       ) then
      raise exception 'Geçersiz şirket daveti';
    end if;
  elsif tg_op = 'UPDATE' then
    if new.id <> old.id or new.sirket_id <> old.sirket_id or new.kullanici_id <> old.kullanici_id
       or new.gorev <> old.gorev or new.olusturma_tarihi <> old.olusturma_tarihi
       or old.gorev = 'sahip' then
      raise exception 'Şirket üyeliği değiştirilemez';
    end if;
    if new.is_deleted and not old.is_deleted then
      if not private.sirket_sahibi_mi(old.sirket_id) then
        raise exception 'Üyeyi yalnızca şirket sahibi kaldırabilir';
      end if;
    elsif old.durum = 'beklemede' and new.durum in ('aktif', 'reddedildi')
      and old.kullanici_id = auth.uid() and not new.is_deleted then
      null;
    else
      raise exception 'Geçersiz üyelik güncellemesi';
    end if;
  end if;
  new.guncelleme_tarihi := now();
  return new;
end;
$$;

create trigger sirket_uyeligi_koruma before insert or update on public.sirket_uyelikleri
for each row execute function private.sirket_uyeligini_koru();

alter table public.sirket_uyelikleri enable row level security;
create policy sirket_uyelikleri_okuma on public.sirket_uyelikleri for select to authenticated
using (kullanici_id = (select auth.uid()) or (select private.sirket_sahibi_mi(sirket_id)));
create policy sirket_uyelikleri_ekleme on public.sirket_uyelikleri for insert to authenticated
with check (gorev = 'ise_alim' and durum = 'beklemede' and is_deleted = false
  and (select private.sirket_sahibi_mi(sirket_id)));
create policy sirket_uyelikleri_guncelleme on public.sirket_uyelikleri for update to authenticated
using (is_deleted = false and (kullanici_id = (select auth.uid()) or (select private.sirket_sahibi_mi(sirket_id))))
with check (kullanici_id = (select auth.uid()) or (select private.sirket_sahibi_mi(sirket_id)));
grant select, insert, update on public.sirket_uyelikleri to authenticated;
grant all on public.sirket_uyelikleri to service_role;
revoke delete on public.sirket_uyelikleri from anon, authenticated;

create or replace function public.sirket_calisani_davet_et(p_sirket_id uuid, p_eposta text)
returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_kullanici_id uuid;
  v_uyelik_id uuid;
begin
  if not private.sirket_sahibi_mi(p_sirket_id) then
    raise exception 'Şirket sahibi değilsiniz';
  end if;
  select k.id into v_kullanici_id
  from public.sistem_kullanicilari k
  join public.kullanici_roller kr on kr.kullanici_id = k.id
  join public.roller r on r.id = kr.rol_id and r.kod = 'isveren'
  where lower(k.eposta) = lower(btrim(p_eposta))
  limit 1;
  if v_kullanici_id is null then
    raise exception 'Bu e-posta ile işveren hesabı bulunamadı';
  end if;
  insert into public.sirket_uyelikleri(sirket_id, kullanici_id, gorev)
  values (p_sirket_id, v_kullanici_id, 'ise_alim')
  returning id into v_uyelik_id;
  return v_uyelik_id;
end;
$$;
revoke all on function public.sirket_calisani_davet_et(uuid, text) from public, anon;
grant execute on function public.sirket_calisani_davet_et(uuid, text) to authenticated;

drop policy if exists sirketler_okuma on public.sirketler;
create policy sirketler_okuma on public.sirketler for select to authenticated
using (is_deleted = false or sahip_kullanici_id = (select auth.uid())
  or (select private.sirket_uyesi_mi(id)));

drop policy if exists is_ilanlari_okuma on public.is_ilanlari;
create policy is_ilanlari_okuma on public.is_ilanlari for select to authenticated
using ((select private.sirket_uyesi_mi(sirket_id)) or
  (is_deleted = false and durum = 'yayinda' and exists (
    select 1 from public.sirketler s where s.id = sirket_id and s.is_deleted = false)));
drop policy if exists is_ilanlari_ekleme on public.is_ilanlari;
create policy is_ilanlari_ekleme on public.is_ilanlari for insert to authenticated
with check (is_deleted = false and (select private.sirket_uyesi_mi(sirket_id)));
drop policy if exists is_ilanlari_guncelleme on public.is_ilanlari;
create policy is_ilanlari_guncelleme on public.is_ilanlari for update to authenticated
using (is_deleted = false and (select private.sirket_uyesi_mi(sirket_id)))
with check ((select private.sirket_uyesi_mi(sirket_id)));

drop policy if exists is_basvurulari_okuma on public.is_basvurulari;
create policy is_basvurulari_okuma on public.is_basvurulari for select to authenticated
using (is_deleted = false and (aday_id = (select auth.uid()) or exists (
  select 1 from public.is_ilanlari i where i.id = ilan_id and i.is_deleted = false
    and (select private.sirket_uyesi_mi(i.sirket_id)))));

commit;
