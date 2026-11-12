# Ortak başvuru ve ilan eşleşmesi sözleşmesi

Güncelleme: 2026-11-12. React ve mobil istemciler için kaynak, bu belgeyle birlikte `apps/api/Controllers/JobsController.cs`, `apps/api/Controllers/ApplicationsController.cs` ve `sql/migrations` altındaki SQL dosyalarıdır. Eski `ORTAK_SIRKET_ILAN_BASVURU_SOZLESMESI.md` dosyasının ilk sürüm notları (tek şirket sahibi, iki başvuru durumu, CV erişimi yok) artık güncel değildir.

## Şema değişiklikleri

Paylaşılan Supabase şemasında ilgili dosyaları şu sırayla izleyin:

1. `20261104_company_memberships.sql`: aynı şirkette birden çok işveren hesabı.
2. `20261111_application_stages.sql`: başvuru aşamaları ve `is_basvurusu_asamasini_guncelle` RPC'si.
3. `20261111_employer_application_details.sql`: ilgili şirket üyesi için aday detayı ve başvuruda seçilmiş CV'ye erişim.
4. `20261111_job_match.sql`: `is_ilani_eslestirme_olcutleri`, `is_basvuru_eslestirmeleri`, `is_ilani_olcutlerini_kaydet` ve `is_basvurusu_eslestirmesini_kaydet` RPC'leri.
5. `20261112_job_match_server_write_only.sql`: eşleşme puanını kaydetme yetkisi yalnızca sunucu rolüne verilir. Bu dosyayı uygulamadan önce API sunucusunda `Supabase:SecretKey` gizli ayarını tanımlayın. Anahtarı React veya mobil uygulamaya koymayın.

Bu migration dosyaları mevcut canlı şemanın repodaki kaydıdır. Paylaşılan şemayı değiştiren yeni işler önce migration dosyası ve sözleşme güncellemesiyle duyurulmalıdır.

## Başvuru aşamaları

Başlangıç `gonderildi`. İşveren geçişleri: `gonderildi → inceleniyor | reddedildi`, `inceleniyor → mulakat | reddedildi`, `mulakat → teklif | reddedildi`. Aday kendi etkin başvurusunu `geri_cekildi` durumuna alabilir. Değerler JSON'da ve veritabanında bu Türkçe kodlarla kullanılır; ekranda kullanıcı dostu etiket gösterilebilir.

`PATCH /api/applications/{id}/status` isteği: `{"status":"inceleniyor"}`. Geçersiz geçiş `APP-005` ve HTTP 409 döner. İşverenin başvuruları `GET /api/jobs/{id}/applications`; aday detayı `GET /api/applications/{id}`; başvuruda seçilen PDF `GET /api/applications/{id}/cv` üzerinden alınır. CV yanıtı `inline` PDF ve `Cache-Control: no-store` kullanır. Bu uçlara yalnızca ilanın şirketindeki yetkili hesap erişebilir. Mobil istemci PDF isteğinde de Supabase oturum token'ını `Authorization: Bearer <token>` olarak göndermelidir.

## İlan eşleşmesi

İşveren, ilan metninden bir taslak almak için `POST /api/jobs/{id}/match-criteria/draft` çağırır. Taslak otomatik kaydedilmez. İncelediği ölçütleri `PUT /api/jobs/{id}/match-criteria` ile kaydeder; `GET /api/jobs/{id}/match-criteria` ile okur. İstek örneği:

```json
{
  "criteria": [
    {"title":"İlgili deneyim","description":"İlanda tanımlanan alandaki iş veya proje deneyimi","weight":40,"required":true},
    {"title":"Teknik bilgi","description":"İlanda belirtilen araç veya yöntemler","weight":30,"required":true},
    {"title":"Eğitim","description":"İlgili eğitim veya belgelenmiş öğrenim","weight":20,"required":false},
    {"title":"İletişim","description":"İlanda açıkça istenen iletişim çalışmaları","weight":10,"required":false}
  ]
}
```

Ölçüt sayısı 4–8, ağırlıkların toplamı 100 olmalıdır. Başlık en çok 100, açıklama en çok 500 karakterdir. Yanıtta `jobId`, `version`, `criteria` bulunur. İlanın başlığı veya açıklaması değişirse ölçütler geçersiz kılınır; yeniden kaydetmek gerekir.

İşveren `POST /api/applications/{id}/match` ile seçilmiş PDF CV'yi ve kayıtlı ölçütleri Gemini ile değerlendirir. `GET /api/applications/{id}/match` tek sonucu, `GET /api/jobs/{id}/matches` ilanın güncel ölçüt sürümüne ait sonuçları döner. Yanıtta `applicationId`, `jobId`, `criteriaVersion`, `score` (0–100), `evidence` ve `createdAt` vardır. Her kanıtta `title`, `verdict`, `evidence`, `weight`, `required` bulunur. `verdict`: `matched`, `partial`, `not_found`, `cannot_determine`. Puan, ağırlık × (`matched`: 1; `partial`: 0,5; diğerleri: 0) toplamının yuvarlanmasıyla hesaplanır. `required` şu an ek puan/ceza üretmez. Bu bir işe alınma olasılığı veya ATS sistemlerinin ortak puanı değildir; ilgili ilanın kaydedilmiş ölçütlerine göre yardımcı değerlendirmedir.

Ölçüt yoksa `JOB-006` (409), incelenebilir PDF yoksa `JOB-007` (409), geçersiz ölçütlerde `JOB-005` (400), değerlendirme başarısızsa `JOB-008` (502), sunucu gizli anahtarı yapılandırılmamışsa `JOB-009` (503) döner. Adayın CV'si Gemini'ye gönderilir ve sonuç işveren ekranı için saklanır; bu akıştaki veri işleme metinleri canlıya çıkmadan ayrıca tamamlanmalıdır.

**Mobil entegrasyonu:** Eşleşme sonucunu mobilde doğrudan Supabase RPC'sine yazarak üretmeyin; aynı .NET API uçlarını kullanın. Sunucuya özel yazma kuralı canlı veritabanına uygulandı; şirket oturumu artık puan kaydedemez. Kural uygulanmadan önceki puan verisi istemci tarafından değiştirilmiş olabilir; eski sonuçları doğrulanmış saymayın. Sunucu tarafından üretilen puan da otomatik işe alım kararı değil, işverenin incelemesine yardımcı göstergedir.
