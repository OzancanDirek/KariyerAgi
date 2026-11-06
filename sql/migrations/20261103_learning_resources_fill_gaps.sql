-- Yedi başlangıç rolündeki bütün beceriler için en az bir incelenmiş kaynak.
insert into public.egitim_kaynaklari
  (beceri_id, baslik, url, saglayici, tur, dil, seviye, ucretli_mi, son_kontrol_tarihi)
select b.id, source.baslik, source.url, source.saglayici, source.tur, 'en', 'baslangic', false, current_date
from (values
  ('Kullanıcı araştırması', 'Kullanıcı Araştırması Yöntemleri', 'https://www.nngroup.com/articles/guide-ux-research-methods/', 'Nielsen Norman Group', 'makale'),
  ('Prototipleme', 'Figma ile Prototip Oluşturma', 'https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma', 'Figma', 'dokumantasyon'),
  ('Pazar araştırması', 'Ürün ve Pazar Uyumunu Araştırma', 'https://www.atlassian.com/agile/product-management/product-market-fit', 'Atlassian', 'makale'),
  ('Paydaş yönetimi', 'Projede Paydaş Katılımı', 'https://www.pmi.org/learning/library/engaging-stakeholders-project-success-11199', 'PMI', 'makale'),
  ('Proje planlama', 'Proje Planlama Kaynakları', 'https://www.atlassian.com/project-management/project-planning', 'Atlassian', 'makale'),
  ('Performans göstergeleri belirleme', 'Ürün Performansı Metrikleri', 'https://www.atlassian.com/agile/product-management/product-metrics', 'Atlassian', 'makale')
) as source(skill_name, baslik, url, saglayici, tur)
join public.beceriler b on b.ad = source.skill_name and b.aktif_mi = true
on conflict (beceri_id, url) do nothing;
