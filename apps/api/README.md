# CareerPath API

ASP.NET Core 8 backend. Kimlik doğrulama Supabase Auth üzerinden, profil okuma ve güncelleme Supabase REST üzerinden kullanıcının kendi JWT'siyle yapılır. İlan eşleşmesi sonucunu yazmak için yalnızca sunucuda saklanan `Supabase:SecretKey` (`sb_secret_...`) kullanılır; istemcilere verilmez. Bu anahtar yoksa eşleşme kaydı `JOB-009` ile durur. Yerel ortamda `dotnet user-secrets`, canlı ortamda sunucu gizli ayarları kullanılmalıdır.

## Yapı

- `Controllers`: Authentication, Session, Profile, CareerProfile, Experiences, Education, Certificates, Projects ve Cv uç noktaları.
- `Services/*`: kimlik, profil, aday kayıtları ve CV iş kuralları ile interface'ler.
- `Repositories/*`: Supabase veri erişimi ve interface'ler.
- `Infrastructure/Supabase`: ortak Supabase istek oluşturma ve HTTP istemcileri.
- `Entities`: kullanıcı, aday profili, deneyim, eğitim, sertifika, proje ve CV tabloları.
- `Dtos`: istek ve yanıt modelleri.
- `Exceptions`: merkezi hata tanımları ve global hata işleme.
- `Security`: doğrulanmış `CurrentUserContext` ve token okuma.
- `Validation`: profil alanlarını doğrulama ve temizleme.
- `Mappers`: entity–DTO dönüşümleri.
- `Utils`: tekrar kullanılabilir metin işlemleri.

## Uç noktalar

| Yöntem | Yol | Açıklama |
|---|---|---|
| POST | `/api/auth/register` | `{ad, soyad, email, password, rol}` |
| POST | `/api/auth/login` | Access ve refresh token döner |
| POST | `/api/auth/logout` | Oturumu kapatır |
| POST | `/api/session/refresh` | `{refreshToken}` ile token yeniler |
| GET | `/api/session/me` | Kimlik servisinden kullanıcıyı getirir |
| GET | `/api/profile/me` | Giriş yapan kişinin temel profilini getirir |
| PUT | `/api/profile/me` | Ad, soyad, telefon, konum ve fotoğraf adresini günceller |
| POST/GET/DELETE | `/api/profile/me/photo` | Profil fotoğrafını yükler, okur veya kaldırır |
| GET | `/api/career-profile/me` | Giriş yapan adayın kariyer profilini getirir |
| PUT | `/api/career-profile/me` | Adayın unvan, özet, bağlantı, hedef ve görünürlük bilgilerini günceller |
| GET/POST | `/api/experiences` | Deneyimleri listele veya ekle |
| PUT/DELETE | `/api/experiences/{id}` | Deneyimi güncelle veya sil |
| GET/POST | `/api/educations` | Eğitimleri listele veya ekle |
| PUT/DELETE | `/api/educations/{id}` | Eğitimi güncelle veya sil |
| GET/POST | `/api/certificates` | Sertifikaları listele veya ekle |
| PUT/DELETE | `/api/certificates/{id}` | Sertifikayı güncelle veya sil |
| POST/GET/DELETE | `/api/certificates/{id}/document` | Belge yükle, indir veya kaldır |
| GET/POST | `/api/projects` | Projeleri listele veya ekle |
| PUT/DELETE | `/api/projects/{id}` | Projeyi güncelle veya sil |
| GET/POST | `/api/cv` | CV dosyalarını listele veya yükle |
| GET | `/api/cv/{id}/document` | CV dosyasını indir |
| PUT | `/api/cv/{id}/primary` | Birincil CV'yi seç |
| DELETE | `/api/cv/{id}` | CV dosyasını sil |
| GET | `/api/health` | Sağlık kontrolü |

`/api/session/me`, `/api/profile/me`, `/api/career-profile/me` ve çıkış için `Authorization: Bearer <accessToken>` gerekir. Profil uç noktalarında kullanıcı ID'si istemciden alınmaz; Supabase Auth'ta doğrulanan kimlik kullanılır. Veritabanındaki RLS de aynı kullanıcıyla sınırlar. E-posta profil güncellemesinin parçası değildir. Profil kaydı `auth.users` kayıt tetikleyicisiyle oluşur; silme ise hesap silme akışı tasarlandığında ele alınacaktır.

`appsettings.Development.json` içindeki Supabase URL ve publishable key geliştirme ortamına aittir. Canlı ortamda aynı ayarlar güvenli yapılandırmayla verilmelidir.

Aday profili `aday` rolü verildiğinde veritabanı tetikleyicisiyle oluşur. İşveren hesabında aday profili bulunmaz. Kariyer görünürlük tercihi bu aşamada yalnızca kaydedilir; işverenlerin adayları görmesine ilişkin erişim politikaları ayrı modülde ele alınacaktır.

Deneyim ve eğitim kayıtları kullanıcının kendi aday kimliğiyle filtrelenir. Ortak CRUD veri erişimi `CandidateRecordStore<T>` içindedir.

Sertifika alanları `sertifikalar` tablosuyla eşleşir. Belgeler özel `sertifika-belgeleri` alanında tutulur ve yalnızca sahibinin JWT'siyle erişilir. Yükleme PDF, JPG ve PNG dosyalarıyla 10 MB'ı aşmayacak şekilde sınırlandırılmıştır. Dosya yükleme, sertifika kaydından sonra ayrı bir istektir; yükleme başarısız olursa sertifika bilgileri kayıtlı kalır ve kullanıcıya yeniden deneme uyarısı gösterilir. Veritabanı ve dosya alanı değişikliği `sql/migrations/20261029_certificates_documents.sql` dosyasındadır.

Projeler `projeler` tablosuyla eşleşir. CV dosyaları özel `cv-dosyalari` Storage alanında, dosya bilgileri `cv_dosyalari` tablosunda tutulur. Yeni yüklemelerde yalnızca PDF, en fazla 10 MB kabul edilir. CV yükleme için yurt dışı aktarım onayı teknik şartı kaldırılmıştır. Dosya sahibine özel erişim ve boyut/tür sınırları korunur. Gerçek kullanıcılarla canlı yayın öncesi veri aktarımının hukuki dayanağı ve aydınlatma yükümlülüğü ayrıca netleştirilmelidir; yalnızca bir metin eklemek yeterli kabul edilmemelidir. Bkz. `../../docs/CV_VERI_AKTARIMI.md`.

Veritabanı sütunu → entity → API DTO alan eşleştirmesini kontrol etmek için proje kökünden `dotnet run --project apps/api.contractchecks/CareerPath.ContractChecks.csproj` çalıştırın. Profil, kariyer, deneyim, eğitim, sertifika, proje ve CV örnek yanıtları doğrulanır.

### CV analizi (Gemini)

`Gemini__ApiKey` ortam değişkeni .NET API sürecinde ayarlanır. Anahtarı React `.env` dosyasına veya Git'e koymayın. Analiz ekranı kullanıcının kendi PDF CV'sini işler ve yalnızca yapılandırılmış bulguları `cv_analizleri` tablosuna kaydeder. Önce `sql/migrations/20261030_cv_analyses.sql` migration'ını uygulayın. Anahtar yoksa analiz isteği `CV-006` hatası döner; CV yükleme ve görüntüleme çalışmaya devam eder.

Günlük sınır için `sql/migrations/20261031_cv_analysis_daily_quota.sql` uygulanır. Aday başına Türkiye takvim gününde iki analiz yapılabilir. Önceki başarılı analizler de sayılır; eşzamanlı istekler veritabanında kilitlenerek kontrol edilir. Tamamlanmayan bir isteğin geçici rezervasyonu 10 dakika sonra sona erer. `GET /api/cv/analysis/quota` kalan hakkı döner; sınır dolduğunda `POST /api/cv/{id}/analysis` `CV-008` ve HTTP 429 döner.
