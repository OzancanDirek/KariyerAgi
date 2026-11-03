-- Modül 05: Rol gereksinimleri ve gösterim sırası. İlerleme aday_becerileri ile hesaplanır.
alter table public.meslek_becerileri add column if not exists sira integer not null default 100;

with new_skills(category_name, skill_name) as (
  values
    ('UI/UX Tasarım', 'Kullanıcı araştırması'),
    ('UI/UX Tasarım', 'Prototipleme'),
    ('Yapay Zeka & Veri Bilimi', 'Veri analizi'),
    ('Yapay Zeka & Veri Bilimi', 'Veri görselleştirme'),
    ('DevOps & Bulut', 'CI/CD süreçleri'),
    ('DevOps & Bulut', 'Bulut altyapısı')
)
insert into public.beceriler (kategori_id, ad)
select c.id, s.skill_name
from new_skills s
join public.beceri_kategorileri c on c.ad = s.category_name
where not exists (select 1 from public.beceriler b where b.ad = s.skill_name);

with roles(name, description) as (
  values
    ('Frontend Geliştirici', 'Web arayüzleri ve kullanıcı deneyimi geliştirme'),
    ('Full-Stack Geliştirici', 'Arayüz ve sunucu uygulamalarını birlikte geliştirme'),
    ('Backend Geliştirici', 'API, iş kuralları ve veri katmanı geliştirme'),
    ('Veri Analisti', 'Veriyi inceleyip iş kararları için anlamlı sonuçlar üretme'),
    ('UI/UX Tasarımcısı', 'Kullanıcı araştırması ve arayüz tasarımı'),
    ('Ürün Yöneticisi', 'Ürün ihtiyaçlarını, öncelikleri ve teslim sürecini yönetme'),
    ('DevOps Mühendisi', 'Dağıtım ve çalışma ortamlarını yönetme')
)
insert into public.meslekler (ad, aciklama)
select name, description from roles
where not exists (select 1 from public.meslekler m where m.ad = roles.name);

-- Yalnızca katalogda gerçekten bulunan beceriler bağlanır.
with requirements(role_name, skill_name, importance, position) as (
  values
    ('Frontend Geliştirici','HTML','temel',1),
    ('Frontend Geliştirici','CSS','temel',2),
    ('Frontend Geliştirici','JavaScript','temel',3),
    ('Frontend Geliştirici','React','temel',4),
    ('Frontend Geliştirici','TypeScript','istege_bagli',5),
    ('Frontend Geliştirici','Figma','istege_bagli',6),
    ('Full-Stack Geliştirici','HTML','temel',1),
    ('Full-Stack Geliştirici','CSS','temel',2),
    ('Full-Stack Geliştirici','JavaScript','temel',3),
    ('Full-Stack Geliştirici','React','temel',4),
    ('Full-Stack Geliştirici','RESTful API','temel',5),
    ('Full-Stack Geliştirici','SQL','temel',6),
    ('Full-Stack Geliştirici','Docker','istege_bagli',7),
    ('Backend Geliştirici','Java','temel',1),
    ('Backend Geliştirici','RESTful API','temel',2),
    ('Backend Geliştirici','SQL','temel',3),
    ('Backend Geliştirici','Docker','istege_bagli',4),
    ('Veri Analisti','SQL','temel',1),
    ('Veri Analisti','Python','temel',2),
    ('Veri Analisti','Veri analizi','temel',3),
    ('Veri Analisti','Veri görselleştirme','istege_bagli',4),
    ('UI/UX Tasarımcısı','Figma','temel',1),
    ('UI/UX Tasarımcısı','Kullanıcı araştırması','temel',2),
    ('UI/UX Tasarımcısı','Prototipleme','temel',3),
    ('Ürün Yöneticisi','Pazar araştırması','temel',1),
    ('Ürün Yöneticisi','Paydaş yönetimi','temel',2),
    ('Ürün Yöneticisi','Proje planlama','temel',3),
    ('Ürün Yöneticisi','Performans göstergeleri belirleme','istege_bagli',4),
    ('DevOps Mühendisi','Docker','temel',1),
    ('DevOps Mühendisi','Git','temel',2),
    ('DevOps Mühendisi','CI/CD süreçleri','temel',3),
    ('DevOps Mühendisi','Bulut altyapısı','istege_bagli',4)
)
insert into public.meslek_becerileri (meslek_id, beceri_id, onem, sira)
select m.id, b.id, r.importance, r.position
from requirements r
join public.meslekler m on m.ad = r.role_name
join public.beceriler b on b.ad = r.skill_name and b.aktif_mi = true
where not exists (
  select 1 from public.meslek_becerileri mb where mb.meslek_id = m.id and mb.beceri_id = b.id
);
