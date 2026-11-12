-- Katalog dışındaki, adayın onayladığı mesleğe ait kişisel haftalık plan.
create table if not exists public.aday_ozel_meslek_gorevleri (
  id uuid primary key default gen_random_uuid(),
  aday_id uuid not null references auth.users(id),
  taslak_id uuid not null references public.aday_ozel_meslek_taslaklari(id),
  beceri_id uuid not null,
  beceri_adi text not null,
  hafta integer not null check (hafta between 1 and 8),
  son_tarih date not null,
  baslik text not null,
  aciklama text not null,
  tur text not null check (tur in ('arastirma','pratik','proje')),
  oncelik text not null check (oncelik in ('yuksek','orta','dusuk')),
  tahmini_saat smallint not null check (tahmini_saat between 1 and 20),
  tamamlandi_mi boolean not null default false,
  is_deleted boolean not null default false,
  olusturma_tarihi timestamptz not null default now()
);

create index if not exists idx_aday_ozel_meslek_gorevleri_aktif
  on public.aday_ozel_meslek_gorevleri(aday_id, taslak_id, hafta, son_tarih)
  where is_deleted = false;

alter table public.aday_ozel_meslek_gorevleri enable row level security;
create policy "Aday kendi ozel meslek gorevlerini okur"
  on public.aday_ozel_meslek_gorevleri for select to authenticated
  using (aday_id = auth.uid());
create policy "Aday kendi ozel meslek gorevlerini gunceller"
  on public.aday_ozel_meslek_gorevleri for update to authenticated
  using (aday_id = auth.uid()) with check (aday_id = auth.uid());
create policy "Aday kendi ozel meslek gorevlerini ekler"
  on public.aday_ozel_meslek_gorevleri for insert to authenticated
  with check (aday_id = auth.uid());
grant select, insert, update on public.aday_ozel_meslek_gorevleri to authenticated;

create or replace function public.aday_ozel_meslek_plani_kaydet(p_taslak_id uuid, p_gorevler jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  approved_skills jsonb;
begin
  select onaylananlar into approved_skills
  from public.aday_ozel_meslek_taslaklari
  where id = p_taslak_id and aday_id = auth.uid() and durum = 'confirmed';

  if approved_skills is null then
    raise exception 'Onaylanmis meslek bulunamadi';
  end if;
  if p_gorevler is null or jsonb_typeof(p_gorevler) <> 'array' or jsonb_array_length(p_gorevler) < 1 or jsonb_array_length(p_gorevler) > 32 then
    raise exception 'Gecersiz gorev listesi';
  end if;
  if exists (
    select 1 from jsonb_to_recordset(p_gorevler) as task(beceri_adi text)
    where not exists (
      select 1 from jsonb_array_elements(approved_skills) as skill(value)
      where lower(trim(skill.value->>'name')) = lower(trim(task.beceri_adi))
    )
  ) then
    raise exception 'Gorev becerisi onaylanan meslege ait degil';
  end if;

  update public.aday_ozel_meslek_gorevleri
  set is_deleted = true
  where aday_id = auth.uid() and taslak_id = p_taslak_id and is_deleted = false;

  insert into public.aday_ozel_meslek_gorevleri
    (aday_id, taslak_id, beceri_id, beceri_adi, hafta, son_tarih, baslik, aciklama, tur, oncelik, tahmini_saat)
  select auth.uid(), p_taslak_id, task.beceri_id, task.beceri_adi, task.hafta, task.son_tarih,
         task.baslik, task.aciklama, task.tur, task.oncelik, task.tahmini_saat
  from jsonb_to_recordset(p_gorevler) as task(
    beceri_id uuid, beceri_adi text, hafta integer, son_tarih date, baslik text,
    aciklama text, tur text, oncelik text, tahmini_saat smallint
  );
end;
$$;
revoke all on function public.aday_ozel_meslek_plani_kaydet(uuid, jsonb) from public;
grant execute on function public.aday_ozel_meslek_plani_kaydet(uuid, jsonb) to authenticated;
