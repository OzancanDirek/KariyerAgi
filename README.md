# CareerPath

Tek VS Code çalışma klasörü içinde iki uygulama:

- `apps/web`: React ve JSX web uygulaması
- `apps/api`: ASP.NET Core 8 API

## Kurulum

1. `apps/api/appsettings.Development.example.json` dosyasını `apps/api/appsettings.Development.json` olarak kopyalayıp kendi Supabase URL ve publishable key değerlerinizi girin. Yerel ayar dosyası Git’e eklenmez.
2. `apps/api` içinde `dotnet run` çalıştırın. API `http://localhost:5088` adresinde açılır.
3. Ayrı terminalde `apps/web` içinde `npm install` ve `npm run dev` çalıştırın.

Sertifikalar için `sql/migrations/20261029_certificates_documents.sql` Supabase projesine uygulanmıştır. Bu değişiklik sertifika belgesi alanlarını ve kullanıcıya özel dosya saklama alanını oluşturur.

Profil fotoğrafı için `sql/migrations/20261030_profile_photos.sql` Supabase projesine uygulanmıştır. Fotoğraflar kullanıcıya özel alanda tutulur; JPG ve PNG dosyaları en fazla 3 MB olabilir.

Web giriş ve kayıt isteklerini .NET API’ye gönderir. API bu işlemler için Supabase Auth ile konuşur. `GET /api/health` sağlık kontrolüdür.

Profil özetinde deneyim, eğitim, sertifika, proje ve CV kayıtlarının en yeni üçü görünür. Her bölümdeki “Tümünü gör” bağlantısı bütün kayıtların yönetilebildiği ayrı ekrana açılır. CV yönetim ekranı hazırdır. Canlı CV yükleme, veri aktarımının hukuki dayanağı ve aydınlatma metni netleştirilene kadar kapalıdır. Ayrıntılar `docs/CV_VERI_AKTARIMI.md` dosyasındadır.

## Git akışı

`main` kararlı sürümleri, `develop` devam eden geliştirmeyi tutar. Yeni özellikler `feature/<kisa-ad>` dalında geliştirilir, inceleme sonrası `develop` dalına birleştirilir. Sürüm hazır olduğunda `develop` içeriği `main` dalına alınır.
