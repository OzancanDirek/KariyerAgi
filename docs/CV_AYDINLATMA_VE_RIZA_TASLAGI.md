# CV yükleme için aydınlatma ve aktarım metni taslağı

**Durum:** Ürün içi yayına hazır değildir. Köşeli alanlar veri sorumlusu tarafından doğrulanmadan ve yurt dışı aktarım dayanağı tamamlanmadan veritabanına yürürlükte metin olarak eklenmez.

**Doğrulanan teknik bilgi (30.10.2026):** CareerPath'in mevcut Supabase projesinin ana bölgesi `Central EU (Frankfurt) / eu-central-1` olarak görünüyor. Bu, Türkiye dışına düzenli veri aktarımı ihtimalini doğurur. Supabase'in alt işleyenleri, destek erişimleri ve yedekleme yerleri ayrıca doğrulanmalıdır.

## 1. CV verileri aydınlatma metni

**Veri sorumlusu:** [Tam ad / ticaret unvanı, adres, iletişim ve KVKK başvuru e-postası]

CareerPath hesabınıza yüklediğiniz PDF veya DOCX CV dosyası ile dosya adı, türü, boyutu, yüklenme tarihi ve birincil CV tercihiniz işlenir. CV içeriğinde kendi eklediğiniz kimlik ve iletişim bilgileriniz, eğitim ve iş geçmişiniz, becerileriniz, sertifikalarınız ve başka bilgiler bulunabilir. CV'nize başkalarına ait veya özel nitelikli kişisel veri eklememenizi öneririz.

Veriler, CV'nizi hesabınızda saklamak, size listelemek ve indirmenizi sağlamak, birincil CV tercihinizi yönetmek amacıyla işlenir. [İleride AI analizi açılacaksa bu amaç, kullanılan sağlayıcılar ve aktarım ayrıca açıklanmalıdır; mevcut CV yükleme onayı AI analizine izin vermez.]

Veriler, dosyayı yüklemeniz yoluyla elektronik ortamda toplanır. Bu işlemenin hukuki sebebi [somut hizmet ilişkisine göre KVKK m.5 kapsamındaki dayanak]; CV içinde bulunabilecek özel nitelikli verilerin işlenme şartı ve ek tedbirleri [ayrıca değerlendirilecek] şeklindedir. Veriler, barındırma ve depolama hizmeti sağlayıcısı [doğrulanmış tüzel kişi/alt işleyenler] ile [doğrulanmış alıcı grupları] tarafından [doğrulanmış ülke/bölgelerde] işlenebilir. Düzenli yurt dışı aktarımın KVKK m.9 dayanağı ve uygun güvencesi [somut karar/standart sözleşme bilgisi] olarak belirtilecektir.

CV dosyası kullanıcı arayüzünde silindiğinde kayıt görünümden kaldırılır; mevcut soft delete tasarımında dosya ve kayıt hemen fiziksel olarak silinmez. Saklama süresi, yedeklerin yaşam süresi, kalıcı imha takvimi ve ilgili kişi talep süreci [belirlenecek] şeklindedir. Bu bilgiler tamamlanmadan gerçek kişilerin CV'leri alınmaz.

KVKK m.11 kapsamındaki erişim, düzeltme, silme ve diğer taleplerinizi [başvuru kanalı] üzerinden iletebilirsiniz. Başvuru usulü ve kimlik doğrulama yöntemi [belirlenecek].

## 2. Yurt dışı aktarım hakkında ayrı bilgilendirme ve açık rıza taslağı

**Yalnızca gerçekten arızi bir aktarım için ve gerekli koşullar doğrulandıktan sonra kullanılabilir. Düzenli CV barındırmasını tek başına meşrulaştırmaz.**

“[Belirli CV dosyamın / verilerimin], [belirli amaç] için [belirli ülkedeki alıcıya] aktarılabileceği; aktarımın gerçekleşeceği yerdeki koruma ve başvuru imkânları ile [somut riskler] hakkında bilgilendirildim. Bu **arızi** aktarıma özgür irademle açık rıza veriyorum.”

Bu metin aydınlatma metninden ayrı bir onayla sunulmalı, önceden işaretlenmemeli ve rıza vermeyen kullanıcı CV yükleme dışındaki hizmetleri kullanabilmelidir. Düzenli aktarım için uygun güvence sağlanmışsa arızi aktarım rızası yerine gerçek hukuki dayanak ve güvence aydınlatma metninde açıklanmalıdır.

## Yayına alma koşulları

1. Veri sorumlusu ve başvuru kanalı kesinleştirilmeli.
2. Supabase projesinin veri bölgesi, alt işleyenler ve tüm erişim/transfer yolları doğrulanmalı.
3. Düzenli yurt dışı aktarım için KVKK m.9 kapsamındaki uygun güvence kurulmalı; standart sözleşme seçildiyse taraflarca imzalanıp süresinde Kuruma bildirilmeli.
4. Saklama, soft delete sonrası kalıcı imha ve ilgili kişi başvurusu süreçleri tanımlanmalı.
5. Aydınlatma metni ve gerekiyorsa ayrı açık rıza metni son haliyle hukuk incelemesinden geçirilmeli.

Kaynaklar: [KVKK yurt dışına aktarım](https://www.kvkk.gov.tr/Icerik/2053/Yurtdisina-Aktarim), [KVKK aydınlatma yükümlülüğü](https://www.kvkk.gov.tr/Icerik/2033/Aydinlatma-Yukumlulugu-), [KVKK'nın aydınlatma ve açık rızanın ayrılmasına ilişkin 2026/347 ilke kararı](https://www.kvkk.gov.tr/Icerik/8710/veri-sorumlulari-tarafindan-acik-riza-ve-aydinlatma-metinlerinin-ayri-ayri-duzenlenmesi-gerektigi-hakkinda-kisisel-verileri-koruma-kurulunun-18-02-2026-tarihli-ve-2026-347-sayili-ilke-kararina-iliskin-kamuoyu-duyurusu).
