-- Gemini çıktısı servis tarafından doğrulandıktan sonra plan tek işlemde değiştirilir.
alter table public.aday_yol_haritasi_gorevleri add column if not exists tahmini_saat smallint not null default 2 check (tahmini_saat between 1 and 20);
-- Eski görevler soft delete ile saklanır; kısmi plan oluşmaz.
create or replace function public.aday_yol_haritasi_plani_kaydet(p_meslek_id uuid, p_gorevler jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Oturum gereklidir';
  end if;
  if jsonb_typeof(p_gorevler) <> 'array' or jsonb_array_length(p_gorevler) < 1 or jsonb_array_length(p_gorevler) > 32 then
    raise exception 'Geçersiz görev listesi';
  end if;
  if exists (
    select 1 from jsonb_to_recordset(p_gorevler) as task(beceri_id uuid)
    where not exists (select 1 from public.meslek_becerileri mb where mb.meslek_id = p_meslek_id and mb.beceri_id = task.beceri_id)
  ) then
    raise exception 'Görev becerisi seçilen mesleğe ait değil';
  end if;
  update public.aday_yol_haritasi_gorevleri
  set is_deleted = true
  where aday_id = auth.uid() and meslek_id = p_meslek_id and is_deleted = false;
  insert into public.aday_yol_haritasi_gorevleri
    (aday_id, meslek_id, beceri_id, hafta, son_tarih, baslik, aciklama, tur, oncelik, tahmini_saat)
  select auth.uid(), p_meslek_id, task.beceri_id, task.hafta, task.son_tarih,
         task.baslik, task.aciklama, task.tur, task.oncelik, task.tahmini_saat
  from jsonb_to_recordset(p_gorevler) as task(
    beceri_id uuid, hafta integer, son_tarih date, baslik text, aciklama text, tur text, oncelik text, tahmini_saat smallint
  );
end;
$$;
revoke all on function public.aday_yol_haritasi_plani_kaydet(uuid, jsonb) from public;
grant execute on function public.aday_yol_haritasi_plani_kaydet(uuid, jsonb) to authenticated;
