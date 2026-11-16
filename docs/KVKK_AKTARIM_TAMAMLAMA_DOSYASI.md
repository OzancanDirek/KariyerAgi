# CareerPath CV veri aktarımı: hukuki tamamlama dosyası

**İnceleme tarihi:** 16 Kasım 2026  
**Durum:** Sözleşme ve bildirim tamamlanmadı. Bu dosya imzalı bir hukuki güvence veya yayıma hazır aydınlatma metni değildir.

## Mevcut veri akışı

| İşlem | Bilinen alıcı ve amaç | Doğrulanması gereken konu |
| --- | --- | --- |
| Hesap, aday profili, CV ve başvuru kayıtları | Supabase Auth, Postgres ve özel Storage; ana proje bölgesi Frankfurt | Sözleşme tarafının tam tüzel kişiliği, alt işleyenler, destek ve CDN erişim bölgeleri, yedek saklama süresi |
| İsteğe bağlı CV analizi | Google Gemini API; CV içeriği analiz için gönderilir, sonuç CareerPath veritabanına kaydedilir | API anahtarının bağlı olduğu projede etkin faturalandırma, Google sözleşme tarafı, veri işleme eki ve alt işleyenler |
| İlanla başvuru eşleştirmesi | Google Gemini API; başvuruda seçilen CV ile ilanın onaylı ölçütleri değerlendirilir | Adaya yapılacak aydınlatmanın kapsamı ve bu aktarım için hukuki dayanak |
| İşverenin başvuruyu incelemesi | İlanın sahibi şirketin yetkili üyeleri; aday iletişim bilgileri, ön yazı ve seçilen CV | Aday aydınlatmasında alıcı grubu, erişim süresi ve şirketin kendi veri sorumluluğu |

**Veri sorumluları olarak bildirilen kişiler:** Ozancan Direk ve Mehmet Akif Tutal. İletişim: `kariyerbeceri@gmail.com`. Yalnızca “İstanbul, Çekmeköy, Taşdelen Mahallesi, Taşdelen Evleri Sitesi” bilgisi mevcut; tam tebligat adresi ve ortak sorumluluk düzeni doğrulanmadı. “CareerPath” uygulama adıdır; tek başına veri sorumlusu olarak yazılmamalıdır.

## Hukuki karar ve tamamlanma kanıtı

KVKK m. 9 bakımından düzenli yurt dışı aktarım için, ilgili işleme şartıyla birlikte yeterlilik kararı veya uygun güvence gerekir. Arızi aktarım istisnası, uygulamanın devamlı Supabase barındırması ve tekrarlanan Gemini çağrıları için genel çözüm kabul edilmemelidir. Uygun güvence olarak **veri sorumlusundan veri işleyene standart sözleşme** ihtimali, her alıcının somut rolüne göre hukukçu tarafından incelenmelidir. Supabase DPA'sı ve Google'ın veri işleme eki, kendiliğinden KVKK standart sözleşmesi sayılmaz.

Tamamlandı diyebilmek için her aktarım yönü bakımından şu kanıtların saklanması gerekir:

1. Alıcı şirketin tam adı, adresi, aktarım ülkeleri, alt işleyenleri ve taraf rollerini doğrulayan güncel kayıt.
2. KVKK m. 5/6 işleme şartı, m. 9 aktarım mekanizması ve özel nitelikli veriler için ek tedbirleri açıklayan hukuk incelemesi.
3. KVKK'nın yayımladığı doğru tipte **Türkçe** standart sözleşmenin iki tarafın yetkili imzalarıyla tamamlanmış nüshası veya seçilen başka geçerli güvenceye ilişkin belge. Kurul metninin zorunlu hükümleri değiştirilmemelidir.
4. Standart sözleşme seçilirse, imzaların tamamlanmasını izleyen **beş iş günü içinde** KVKK'ya bildirim kaydı ve imza yetkisi belgeleri.
5. Tam açık adres, ilgili kişi başvuru yöntemi, veri kategorileri, amaçlar, alıcılar, yurt dışı aktarım dayanağı ve gerçek saklama süreleriyle son aydınlatma metni; web ve mobilde aynı sürümün yayımlandığını gösteren kayıt.
6. Hesap kapatma talebi, iki takvim ayı sonrasına planlanan fiziksel silme, Storage nesneleri, analiz/eşleşme kayıtları ve yedekler için kanıtlanmış imha süreci.

**Şu an eksik:** 1–6'nın tamamlanmış kanıtı bulunmuyor. Özellikle imzalar, tedarikçi tarafın katılımı ve KVKK bildirimi kod veya kullanıcı kutucuğuyla oluşturulamaz. Hesap kapatmadan iki ay sonra kalıcı silme kararı verilmiş olsa da uygulamada bu işi yapan güvenilir akış henüz yoktur. Mevcut “sil” düğmeleri bazı kayıtları yalnızca görünümden kaldırır.

## Tedarikçilerle doğrulanacak sorular

- Supabase sözleşmesindeki asıl veri işleyen tüzel kişi hangisi; bu CareerPath hesabında Marketplace aracılığı var mı? KVKK standart sözleşmesini imzalama süreçleri var mı? Destek, CDN, alt işleyen ve yedek erişimleri hangi ülkelerdedir? Hesap/nesne silindiğinde yedeklerden silinme takvimi nedir?
- Gemini API anahtarının projesinde aktif Cloud Billing var mı? Google'ın sözleşme tarafı hangi tüzel kişi? KVKK standart sözleşmesi için karşı taraf imzası sağlanıyor mu? İstek/yanıt günlükleri ve güvenlik amaçlı geçici kayıtlar nerede, ne kadar süre tutuluyor?
- İki kurucunun müşterek veri sorumluluğu ve işveren şirketlerin bağımsız veri sorumluluğu hangi veri işlemleri için geçerli? İlgili kişi taleplerini kim yanıtlayacak?

## Teknik yayının mevcut durumu

Web'deki CV analizi, kullanıcıya Gemini aktarımını anlatan işaretlenmemiş bir kutu gösteriyor; API de istekte bu alanı arıyor ve işlem zamanını kaydediyor. Bu kayıt bir **bilgilendirme ve kullanıcı eylemi kanıtıdır**; KVKK m. 9 güvencesinin veya tedarikçi sözleşmesinin yerine geçmez. İşverenin ilan eşleştirmesi için aday tarafındaki ayrı bildirim de ayrıca netleştirilmelidir. Hukuki güvence sağlanmadan gerçek kişilerin CV'leriyle üretim kullanımının uygunluğu teyit edilmiş değildir.

## Resmî ve sağlayıcı kaynakları

- [KVKK: Yurt dışına aktarım](https://www.kvkk.gov.tr/Icerik/2053/Yurtdisina-Aktarim)
- [KVKK: Standart sözleşmelerde dikkat edilecek hususlar](https://www.kvkk.gov.tr/Icerik/8170/Yurt-Disina-Kisisel-Veri-Aktariminda-Kullanilacak-Standart-Sozlesmelerde-Dikkat-Edilmesi-Gereken-Hususlara-Iliskin-Kamuoyu-Duyurusu)
- [KVKK: Veri sorumlusundan veri işleyene standart sözleşme metni](https://www.kvkk.gov.tr/SharedFolderServer/CMSFiles/b531d656-9cea-4cdb-84ce-1ab92198c9b1.pdf)
- [Supabase DPA](https://supabase.com/legal/customer-resources/data-processing-addendum) ve [veri yerleşimi açıklaması](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq)
- [Gemini API güncel koşulları](https://ai.google.dev/gemini-api/terms)
