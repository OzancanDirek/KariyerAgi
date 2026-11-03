-- Rol becerilerinden kişisel, haftalık çalışma planı.
create table if not exists public.beceri_gorev_sablonlari (
  id uuid primary key default gen_random_uuid(),
  beceri_id uuid not null references public.beceriler(id),
  baslik text not null,
  aciklama text not null,
  tur text not null check (tur in ('arastirma','pratik','proje')),
  oncelik text not null check (oncelik in ('yuksek','orta','dusuk')),
  sira integer not null default 100,
  unique (beceri_id, baslik)
);
create table if not exists public.aday_yol_haritasi_gorevleri (
  id uuid primary key default gen_random_uuid(),
  aday_id uuid not null references auth.users(id),
  meslek_id uuid not null references public.meslekler(id),
  beceri_id uuid not null references public.beceriler(id),
  sablon_id uuid references public.beceri_gorev_sablonlari(id),
  hafta integer not null check (hafta between 1 and 52),
  son_tarih date not null,
  baslik text not null,
  aciklama text not null,
  tur text not null check (tur in ('arastirma','pratik','proje')),
  oncelik text not null check (oncelik in ('yuksek','orta','dusuk')),
  tamamlandi_mi boolean not null default false,
  is_deleted boolean not null default false,
  olusturma_tarihi timestamptz not null default now(),
  unique (aday_id, meslek_id, sablon_id)
);
create index if not exists idx_aday_yol_haritasi_gorevleri_aktif on public.aday_yol_haritasi_gorevleri(aday_id, meslek_id, hafta, son_tarih) where is_deleted = false;
alter table public.beceri_gorev_sablonlari enable row level security;
alter table public.aday_yol_haritasi_gorevleri enable row level security;
drop policy if exists "Gorev sablonlari okunabilir" on public.beceri_gorev_sablonlari;
create policy "Gorev sablonlari okunabilir" on public.beceri_gorev_sablonlari for select to authenticated using (true);
drop policy if exists "Aday kendi yol haritasi gorevlerini yonetir" on public.aday_yol_haritasi_gorevleri;
create policy "Aday kendi yol haritasi gorevlerini yonetir" on public.aday_yol_haritasi_gorevleri for all to authenticated using (aday_id = auth.uid()) with check (aday_id = auth.uid());
with templates(skill_name,title,description,kind,priority,position) as (
 values
 ('RESTful API','Bir API sözleşmesi tasarla','Uç noktaları, istek ve yanıt örneklerini, hata durumlarını belgeleyip küçük bir örnek uygula.','proje','yuksek',1),
 ('SQL','İlişkisel veri modeli kur','Üç ilişkili tablo tasarla; anahtarları, indeksleri ve örnek sorguları açıkla.','proje','yuksek',1),
 ('React','Bileşen tabanlı arayüz oluştur','Bir ekranı bileşenlere ayır, durum yönetimi ve erişilebilirlik kontrollerini uygula.','proje','yuksek',1),
 ('JavaScript','JavaScript temellerini uygula','Dizi, nesne ve asenkron işlemler için küçük alıştırmalar yap.','pratik','yuksek',1),
 ('HTML','Anlamsal bir sayfa hazırla','Başlık, form ve gezinme yapısını anlamsal HTML ile kur.','pratik','orta',1),
 ('CSS','Duyarlı bir sayfa düzenle','Mobil ve masaüstü genişliklerinde çalışan bir düzen oluştur.','pratik','orta',1),
 ('Java','Java ile küçük servis geliştir','Veri doğrulama ve hata yönetimi içeren basit bir servis uygula.','proje','yuksek',1),
 ('Docker','Uygulamayı konteynerde çalıştır','Örnek uygulama için Dockerfile oluştur ve yerelde çalıştır.','pratik','orta',1),
 ('Python','Python ile veri işle','Bir CSV veri kümesini temizleyip özet istatistiklerini çıkar.','pratik','yuksek',1),
 ('Veri analizi','Bir veri kümesini yorumla','Veri temizliği, temel ölçütler ve sonuçları içeren kısa rapor hazırla.','proje','yuksek',1),
 ('Veri görselleştirme','Veriyi grafikle anlat','Aynı veri için uygun grafik türleri seç ve bulguları yaz.','proje','orta',1),
 ('Figma','Bir arayüz akışı çiz','Temel kullanıcı akışını Figma üzerinde prototiple.','proje','yuksek',1),
 ('Kullanıcı araştırması','Kullanıcı görüşmesi planla','Görüşme sorularını yaz, bulguları temalara ayır.','arastirma','yuksek',1),
 ('Prototipleme','Test edilebilir prototip oluştur','Bir akış için düşük sadakatli prototip hazırla ve geri bildirim topla.','proje','yuksek',1),
 ('Pazar araştırması','Rakip ve pazar analizi yap','Üç çözümü karşılaştır ve fırsat alanlarını özetle.','arastirma','yuksek',1),
 ('Paydaş yönetimi','Paydaş haritası hazırla','Beklentileri ve iletişim sıklığını içeren paydaş tablosu oluştur.','pratik','orta',1),
 ('Proje planlama','Dört haftalık proje planı kur','Teslimleri, bağımlılıkları ve riskleri bir zaman çizelgesine yerleştir.','proje','yuksek',1),
 ('Git','Sürüm yönetimi pratiği yap','Dal aç, değişiklikleri açıklayan commitler oluştur ve birleştir.','pratik','orta',1),
 ('CI/CD süreçleri','Basit dağıtım hattı kur','Derleme ve test adımlarını otomatikleştiren örnek iş akışı oluştur.','proje','yuksek',1),
 ('Bulut altyapısı','Bulut mimarisini karşılaştır','İki barındırma yaklaşımını maliyet, güvenlik ve ölçek açısından karşılaştır.','arastirma','orta',1)
)
insert into public.beceri_gorev_sablonlari(beceri_id,baslik,aciklama,tur,oncelik,sira)
select b.id,t.title,t.description,t.kind,t.priority,t.position from templates t join public.beceriler b on b.ad=t.skill_name
on conflict (beceri_id,baslik) do nothing;
