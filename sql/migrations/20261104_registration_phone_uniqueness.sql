begin;

create or replace function private.telefonu_normalize_et(p_telefon text)
returns text language plpgsql immutable set search_path = public, pg_temp as $$
declare
  v_rakamlar text;
begin
  v_rakamlar := regexp_replace(coalesce(p_telefon, ''), '[^0-9]', '', 'g');
  if v_rakamlar = '' then
    return null;
  end if;
  if length(v_rakamlar) = 12 and left(v_rakamlar, 2) = '90' then
    v_rakamlar := substr(v_rakamlar, 3);
  elsif length(v_rakamlar) = 11 and left(v_rakamlar, 1) = '0' then
    v_rakamlar := substr(v_rakamlar, 2);
  end if;
  if v_rakamlar !~ '^5[0-9]{9}$' then
    raise exception 'Geçersiz cep telefonu numarası';
  end if;
  return v_rakamlar;
end;
$$;

create or replace function private.sistem_kullanicisi_telefonunu_normalize_et()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  new.telefon := private.telefonu_normalize_et(new.telefon);
  return new;
end;
$$;

drop trigger if exists sistem_kullanicisi_telefonunu_normalize_et on public.sistem_kullanicilari;
create trigger sistem_kullanicisi_telefonunu_normalize_et
before insert or update of telefon on public.sistem_kullanicilari
for each row execute function private.sistem_kullanicisi_telefonunu_normalize_et();

update public.sistem_kullanicilari
set telefon = private.telefonu_normalize_et(telefon)
where telefon is not null;

create unique index if not exists sistem_kullanicilari_telefon_tekil
on public.sistem_kullanicilari (telefon) where telefon is not null;

create unique index if not exists sistem_kullanicilari_eposta_tekil
on public.sistem_kullanicilari (lower(btrim(eposta))) where eposta is not null;

create or replace function private.kullanici_hesabi_olustur(p_auth_id uuid, p_eposta text, p_meta jsonb)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_rol_id uuid;
begin
  insert into public.aktorler (id, aktor_tipi) values (p_auth_id, 'kullanici');

  insert into public.sistem_kullanicilari (id, ad, soyad, eposta, telefon, olusturan_id)
  values (p_auth_id, coalesce(p_meta ->> 'ad', ''), coalesce(p_meta ->> 'soyad', ''),
          p_eposta, private.telefonu_normalize_et(p_meta ->> 'telefon'), p_auth_id);

  select id into v_rol_id from public.roller
  where kod = coalesce(p_meta ->> 'rol', 'aday') and kendisi_secebilir;
  if v_rol_id is null then
    select id into v_rol_id from public.roller where kod = 'aday';
  end if;

  insert into public.kullanici_roller (kullanici_id, rol_id) values (p_auth_id, v_rol_id);
end;
$$;

commit;
