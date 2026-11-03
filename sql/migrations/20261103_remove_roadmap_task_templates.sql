-- Gemini planlari gorev metnini aday_yol_haritasi_gorevleri tablosunda saklar.
-- Eski sablonlara ait arsiv gorevlerinin baslik, aciklama ve diger alanlari korunur.
begin;

alter table public.aday_yol_haritasi_gorevleri
  drop column if exists sablon_id;

drop table if exists public.beceri_gorev_sablonlari;

commit;
