create table if not exists public.egitim_kaynaklari (
  id uuid primary key default gen_random_uuid(),
  beceri_id uuid not null references public.beceriler(id) on delete restrict,
  baslik text not null check (char_length(baslik) between 5 and 160),
  url text not null check (url ~ '^https://[^[:space:]]+$'),
  saglayici text not null check (char_length(saglayici) between 2 and 100),
  tur text not null check (tur in ('dokumantasyon', 'kurs', 'makale', 'video', 'uygulama')),
  dil text not null check (dil in ('tr', 'en')),
  seviye text not null check (seviye in ('baslangic', 'orta', 'ileri')),
  ucretli_mi boolean not null default false,
  aktif_mi boolean not null default true,
  son_kontrol_tarihi date,
  olusturan_id uuid references public.sistem_kullanicilari(id),
  guncelleyen_id uuid references public.sistem_kullanicilari(id),
  olusturma_tarihi timestamptz not null default now(),
  guncelleme_tarihi timestamptz not null default now(),
  unique (beceri_id, url)
);

create index if not exists egitim_kaynaklari_aktif_beceri_idx
  on public.egitim_kaynaklari (beceri_id, seviye) where aktif_mi = true;

create or replace function private.egitim_kaynagi_denetim()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  if tg_op = 'INSERT' then
    new.olusturan_id := auth.uid();
  else
    new.olusturan_id := old.olusturan_id;
    new.olusturma_tarihi := old.olusturma_tarihi;
  end if;
  new.guncelleyen_id := auth.uid();
  new.guncelleme_tarihi := now();
  return new;
end;
$$;

drop trigger if exists egitim_kaynagi_denetim on public.egitim_kaynaklari;
create trigger egitim_kaynagi_denetim before insert or update
  on public.egitim_kaynaklari for each row execute function private.egitim_kaynagi_denetim();

alter table public.egitim_kaynaklari enable row level security;
create policy "Kaynak: aday aktif kaynagi okur" on public.egitim_kaynaklari
  for select to authenticated
  using (aktif_mi = true or (select private.rolu_var_mi('yonetici')));
create policy "Kaynak: yonetici ekler" on public.egitim_kaynaklari
  for insert to authenticated
  with check ((select private.rolu_var_mi('yonetici')));
create policy "Kaynak: yonetici gunceller" on public.egitim_kaynaklari
  for update to authenticated
  using ((select private.rolu_var_mi('yonetici')))
  with check ((select private.rolu_var_mi('yonetici')));

grant select, insert, update on public.egitim_kaynaklari to authenticated;

insert into public.egitim_kaynaklari (beceri_id, baslik, url, saglayici, tur, dil, seviye, ucretli_mi, son_kontrol_tarihi)
select b.id, kaynak.baslik, kaynak.url, kaynak.saglayici, kaynak.tur, kaynak.dil, kaynak.seviye, false, current_date
from (values
  ('JavaScript', 'JavaScript Rehberi', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', 'MDN', 'dokumantasyon', 'en', 'baslangic'),
  ('React', 'React Öğren', 'https://react.dev/learn', 'React', 'dokumantasyon', 'en', 'baslangic'),
  ('Python', 'Python Resmî Eğitimi', 'https://docs.python.org/3/tutorial/', 'Python', 'dokumantasyon', 'en', 'baslangic'),
  ('Docker', 'Docker ile Başlangıç', 'https://docs.docker.com/get-started/', 'Docker', 'dokumantasyon', 'en', 'baslangic'),
  ('HTML', 'HTML Temelleri', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax', 'MDN', 'dokumantasyon', 'en', 'baslangic'),
  ('CSS', 'CSS Temelleri', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics', 'MDN', 'dokumantasyon', 'en', 'baslangic'),
  ('PostgreSQL', 'PostgreSQL SQL Eğitimi', 'https://www.postgresql.org/docs/current/tutorial-sql.html', 'PostgreSQL', 'dokumantasyon', 'en', 'baslangic'),
  ('SQL', 'PostgreSQL SQL Eğitimi', 'https://www.postgresql.org/docs/current/tutorial-sql.html', 'PostgreSQL', 'dokumantasyon', 'en', 'baslangic')
  ,('TypeScript', 'TypeScript El Kitabı', 'https://www.typescriptlang.org/docs/handbook/', 'TypeScript', 'dokumantasyon', 'en', 'baslangic')
  ,('Figma', 'Figma Tasarımına Başlangıç', 'https://help.figma.com/hc/en-us/sections/30880632542743-Figma-Design-for-beginners', 'Figma', 'kurs', 'en', 'baslangic')
  ,('Java', 'Java Öğren', 'https://dev.java/learn/', 'Oracle', 'dokumantasyon', 'en', 'baslangic')
  ,('RESTful API', 'HTTP Temelleri', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview', 'MDN', 'dokumantasyon', 'en', 'baslangic')
  ,('Veri analizi', 'pandas ile Başlangıç', 'https://pandas.pydata.org/pandas-docs/stable/getting_started/index.html', 'pandas', 'dokumantasyon', 'en', 'baslangic')
  ,('Veri görselleştirme', 'Power BI ile Veri Görselleştirme', 'https://learn.microsoft.com/training/paths/prepare-visualize-data-power-bi/', 'Microsoft Learn', 'kurs', 'en', 'baslangic')
  ,('Git', 'Pro Git Kitabı', 'https://git-scm.com/book/en/v2.html', 'Git', 'dokumantasyon', 'en', 'baslangic')
  ,('CI/CD süreçleri', 'GitHub Actions Başlangıç', 'https://docs.github.com/en/actions/get-started/quickstart', 'GitHub', 'dokumantasyon', 'en', 'baslangic')
  ,('Bulut altyapısı', 'Azure Altyapı Temelleri', 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services', 'Microsoft Learn', 'kurs', 'en', 'baslangic')
) as kaynak(beceri, baslik, url, saglayici, tur, dil, seviye)
join public.beceriler b on lower(b.ad) = lower(kaynak.beceri)
on conflict (beceri_id, url) do nothing;
