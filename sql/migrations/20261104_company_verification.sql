begin;

alter table public.sirketler
  add column dogrulama_durumu text not null default 'beklemede'
    check (dogrulama_durumu in ('beklemede', 'onaylandi', 'reddedildi')),
  add column dogrulama_tarihi timestamptz,
  add column dogrulayan_id uuid references public.sistem_kullanicilari(id);

create index sirketler_dogrulama_bekleyen_idx on public.sirketler(olusturma_tarihi)
  where is_deleted = false and dogrulama_durumu = 'beklemede';

create or replace function private.sirket_dogrulamasini_koru()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  if tg_op = 'INSERT' then
    new.dogrulama_durumu := 'beklemede';
    new.dogrulama_tarihi := null;
    new.dogrulayan_id := null;
  elsif new.dogrulama_durumu is distinct from old.dogrulama_durumu
     or new.dogrulama_tarihi is distinct from old.dogrulama_tarihi
     or new.dogrulayan_id is distinct from old.dogrulayan_id then
    if not private.rolu_var_mi('yonetici') then
      raise exception 'Şirket doğrulamasını yalnızca yönetici değiştirebilir';
    end if;
    if new.dogrulama_durumu = 'beklemede' then
      new.dogrulama_tarihi := null;
      new.dogrulayan_id := null;
    else
      new.dogrulama_tarihi := now();
      new.dogrulayan_id := auth.uid();
    end if;
  elsif old.dogrulama_durumu = 'reddedildi' and new.sahip_kullanici_id = auth.uid()
    and (new.ad, new.aciklama, new.sektor, new.konum, new.web_sitesi)
        is distinct from (old.ad, old.aciklama, old.sektor, old.konum, old.web_sitesi) then
    new.dogrulama_durumu := 'beklemede';
    new.dogrulama_tarihi := null;
    new.dogrulayan_id := null;
  end if;
  return new;
end;
$$;

create trigger sirket_dogrulama_koruma before insert or update on public.sirketler
  for each row execute function private.sirket_dogrulamasini_koru();

create policy sirketler_yonetici_guncelleme on public.sirketler for update to authenticated
  using (is_deleted = false and (select private.rolu_var_mi('yonetici')))
  with check (is_deleted = false and (select private.rolu_var_mi('yonetici')));

create or replace function private.ilan_yayinini_koru()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  if new.durum = 'yayinda' and not exists (
    select 1 from public.sirketler s
    where s.id = new.sirket_id and s.is_deleted = false and s.dogrulama_durumu = 'onaylandi'
  ) then
    raise exception 'Şirket onaylanmadan ilan yayımlanamaz';
  end if;
  return new;
end;
$$;

create trigger is_ilani_yayin_koruma before insert or update on public.is_ilanlari
  for each row execute function private.ilan_yayinini_koru();

commit;
