# CareerPath Web

React ve JSX tabanlı web uygulaması. API projesi `../api` klasöründedir.

## Çalıştırma

1. `npm install`
2. Ayrı terminalde `../api` projesini `dotnet run` ile başlatın.
3. `npm run dev`

Tarayıcı adresi: `http://localhost:3000`. Üretim derlemesi: `npm run build`.

## Yapı

- `src/App.jsx`: oturum durumuna göre ekran seçimi.
- `src/features/auth`: giriş, kayıt, oturum yenileme ve çıkış akışı.
- `src/features/profile`: gerçek API'ye bağlı kişisel profil ekranı ve çağrıları.
- `src/features/dashboard/components/WelcomeDashboard.jsx`: başlangıç ekranı.
- `src/features/dashboard/components` ve `data`: ileride API'ye bağlanacak örnek modül ekranları. Canlı uygulamada açılmaz.
- `src/shared/api`: ortak API isteği ve hata okuma.
- `src/shared/ui`: paylaşılan arayüz bileşenleri.
- `src/features/onboarding`: ileride bağlanacak CV yükleme taslağı.

Kayıtta API `emailConfirmationRequired` döndürürse kullanıcı e-postasındaki bağlantıyı açıp giriş yapar. Profil ekranında e-posta salt okunurdur. Google ile giriş, şifre sıfırlama ve profil fotoğrafı dosya yükleme henüz uygulanmadı.

Tek profil formunun kariyer bölümü `aday_profilleri` tablosundaki unvan, özet, deneyim seviyesi, bağlantılar, hedefler, çalışma modelleri, tercih edilen konumlar, kariyer notları ve görünürlük alanlarını düzenler. İşveren hesabı için aday profili bulunmaz.

Profil özetinde kişisel bilgiler ve kariyer özeti canlı API’den gelir. Deneyim ve eğitim kartları gerçek API kayıtlarını listeler; ekleme, düzenleme ve silme işlemleri yapılabilir. Proje, CV ve sertifika kartları henüz gerçek veriye bağlanmadı; taslaktaki örnek kayıtlar kullanılmaz.

Kişisel ve kariyer alanları tek formda, tek düğmeyle kaydedilir. İki ayrı tabloya yazıldığı için kariyer kaydı başarısız olursa kişisel bilgilerin kaydedildiği ekranda açıkça belirtilir.

Eğitim formundaki üniversite ve bölüm seçenekleri `src/features/profile/data/universityPrograms.json` dosyasından gelir. Kaynak ve kapsam için aynı klasördeki `DATA_SOURCE.md` dosyasına bakın. Okul seçilince yalnızca o okulun bölümleri gösterilir; listede olmayan lise/kurum ve bölümler için "Diğer" seçeneği vardır. Backend kodu değiştirildikten sonra çalışan API sürecini yeniden başlatın; eski süreç yeni uç noktalara 404 döner.
