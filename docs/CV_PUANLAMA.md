# CV puanlama ölçütleri (v2)

Bu puanlar CareerPath'in açıklanabilir CV hazırlık göstergeleridir; belirli bir ATS ürününün skoru, işe alınma olasılığı veya otomatik eleme tahmini değildir. Gemini puan üretmez. Yalnızca CV'de açıkça görülen üç içerik kanıtını `true/false` olarak işaretler. Belirsiz kanıt `false` sayılır. Puanlar kodda toplanır.

## ATS ayrıştırılabilirliği (100 puan)

- PDF'den seçilebilir metin çıkarılması: 35
- Deneyim veya proje başlığının PDF metninde bulunması: 15
- Eğitim başlığının PDF metninde bulunması: 15
- Beceri başlığının PDF metninde bulunması: 15
- E-posta adresinin PDF metninde bulunması: 10
- Dört haneli yılın PDF metninde bulunması: 10

Taranmış PDF'yi Gemini okuyabilse bile bu, işverenin ATS'sinin metni ayrıştıracağını göstermez. Kendi PDF ayrıştırıcımızın yakalayamadığı metinler için puan verilmez. Bu ihtiyatlı yaklaşım, bazı ATS'lerin farklı davranabileceği gerçeğiyle birlikte ekranda anlatılır.

## Biçim ve düzen (100 puan)

- Tek sütunlu, okunabilir metin sırası: 40
- Her sayfada okunabilir metin olması: 30
- En az iki standart bölüm başlığı: 20
- Tarih/yıl bilgisinin metin olarak yazılması: 10

Sabit sayfa sayısı veya madde işareti zorunluluğu yoktur. Birden fazla sayfa deneyime göre uygun olabilir. Bu ölçütler görsel estetiği değil metin ayrıştırma kolaylığını temsil eder.

## İçerik derinliği (100 puan)

- Deneyim açıklaması: 20
- Eğitim açıklaması: 10
- Beceri listesi: 15
- Açıkça belirtilen ölçülebilir sonuç: 25
- İş/proje teknik ayrıntısı: 20
- Eylem odaklı anlatım: 10

Son üç ölçütün varlığı Gemini tarafından işaretlenir; puan koda aittir. Bunlar CV'nin anlatım kalitesine ilişkin göstergelerdir; adayın gerçek beceri seviyesini doğrulamaz. Başlık ve içerik kontrolü Türkçe/İngilizce temel başlıkları kapsar; sektörlere özgü eşdeğer başlıklar zamanla eklenebilir.

## Genel puan

`0,40 × ATS + 0,20 × biçim + 0,40 × içerik`, en yakın tam sayıya yuvarlanır. Ağırlıklar CareerPath'in ürün kararıdır, bilimsel olarak kalibre edilmiş bir işe alım modeli değildir. Hedef rol/ilan eşleşmesi bu hesapta yoktur; gerçek şirket ilanlarıyla ayrı modülde hesaplanır.

Eski analizlere geriye dönük puan atanmaz. Yeni analiz günlük kota kullanır. Rubrik sürümü `puan_detaylari.version` içinde saklanır. Farklı rubrik sürümlerinin puanları doğrudan karşılaştırılmamalıdır.

## İncelenen kaynaklar

- Workday, Resume Parsing: https://doc.workday.com/admin-guide/en-us/human-capital-management/recruiting/candidates/set-up-prospects-and-candidates/hdc1552497830785.html
- Greenhouse, What really happens after you apply: https://my.greenhouse.com/blogs/what-really-happens-after-you-apply-for-a-job
- University of Illinois Career Center, How to Write a Resume: https://careercenter.illinois.edu/howtoresume
- Indeed, How To Optimize Your Application for ATS Software and AI Resume Scanners: https://www.indeed.com/career-advice/resumes-cover-letters/resume-ai
