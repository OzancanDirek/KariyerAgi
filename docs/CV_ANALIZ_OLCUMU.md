# CV analizinde belge okuma karşılaştırması

Yeni CV yüklemelerinde yalnızca PDF kabul edilir. Varsayılan analiz yöntemi otomatik seçimdir: tek sütunlu, okunabilir dijital PDF metin olarak Gemini'ye gönderilir (`pdf_text`). Taranmış, metni eksik veya çok sütunlu PDF belge olarak gönderilir (`pdf_document`). Eski DOCX kayıtları korunur fakat yeni analiz için kabul edilmez.

Metin PdfPig ile çıkarılır. Sayfa başına yeterli okunabilir metin yoksa, metin sınırı aşılırsa veya merkez boşluğu boyunca eşzamanlı iki sütun algılanırsa belge yöntemine dönülür. `Gemini__PdfInputMode=document` tüm PDF'lerde belge yöntemini zorlar; karşılaştırma veya sorun giderme için kullanılabilir. Sütun algılaması bir yerleşim sezgisidir ve her tasarımı kusursuz sınıflandıramaz.

Her başarılı analizin `cv_analizleri` kaydında `girdi_yontemi`, `girdi_token_sayisi`, `cikti_token_sayisi`, `toplam_token_sayisi` ve `gorsel_token_sayisi` tutulur. Eski kayıtların sayaçları 0 ve yöntemleri `unknown` kalır. Bu sayılar Gemini'nin `usageMetadata` yanıtından gelir; faturayı veya kaliteyi tek başına göstermez.

Karşılaştırma için kişisel veri içermeyen aynı dijital PDF'yi otomatik ve zorunlu belge modlarında analiz edin. İki raporda beceri, eğitim ve deneyim doğruluğunu gözle kontrol edin; token sayılarını ve sağlayıcının geçerli fiyatlandırmasını birlikte değerlendirin. Uygulama içinden yapılan her analiz günlük iki hak kotasından birini kullanır. Gerçek kullanıcı CV'lerini otomatik olarak yeniden analiz etmeyin.

## 1 Kasım 2026 örnek karşılaştırması

Kişisel bilgi içermeyen, tek sayfalık kurgusal bir PDF iki yöntemle aynı Gemini modeli ve aynı prompt kullanılarak analiz edildi.

| Yöntem | Girdi token | Çıktı token | Toplam token | Görsel token |
| --- | ---: | ---: | ---: | ---: |
| PDF belge (`pdf_document`) | 710 | 388 | 1917 | 532 |
| Çıkarılmış metin (`pdf_text`) | 270 | 393 | 1536 | 0 |

İki rapor da örnekteki eğitim, staj ve temel teknik becerileri doğru yakaladı. Toplam token sayısına modelin diğer işlem tokenları da dahildir; bu tablo doğrudan fatura tutarı değildir. Tek sayfalık düz bir PDF, çok sütunlu veya taranmış CV'leri temsil etmez. Daha sonra eklenen otomatik seçim, karmaşık belgeleri doğrudan PDF yoluna yönlendirir.

## Otomatik seçim kontrolleri

Kurgusal tek sütunlu PDF `pdf_text`, iki sütunlu PDF `pdf_document`, metinsiz PDF `pdf_document` olarak seçildi. Görüntü tabanlı örnek PDF de `pdf_document` yoluna yönlendirildi. Bu testler dosya yönlendirmesini doğrular; gerçek kullanıcı CV'sinin analiz doğruluğunu garanti etmez.

İki sütunlu ve görüntü tabanlı örnekler Gemini'de ayrıca analiz edildi:

| Örnek | Seçilen yöntem | Girdi token | Toplam token | Sonuç |
| --- | --- | ---: | ---: | --- |
| İki sütunlu PDF | `pdf_document` | 710 | 1896 | Eğitim, staj ve beceriler çıkarıldı |
| Görüntü tabanlı PDF | `pdf_document` | 710 | 1728 | Eğitim, staj ve beceriler çıkarıldı |

Bu iki istekte de gerçek CV kullanılmadı. Sonuçlar örnek belgeler için geçerlidir; OCR kalitesi tarama çözünürlüğüne ve belge düzenine bağlıdır.
