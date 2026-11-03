# Veritabanı envanteri — 3 Kasım 2026

Supabase `public` şemasındaki beceri tabloları canlı kayıt sayıları, uygulama kodu ve modül planıyla karşılaştırıldı. Boş tablo tek başına gereksiz tablo anlamına gelmez.

## Şu anda çalışan akışlar

- `aktorler`, `sistem_kullanicilari`, `roller`, `kullanici_roller`, `aday_profilleri`: kimlik, rol ve aday profili.
- `deneyimler`, `egitimler`, `projeler`, `sertifikalar`: profil kayıtları.
- `cv_dosyalari`, `cv_analizleri`: CV ve rapor kayıtları.
- `cv_taslaklari`: CV oluşturucuda hazırlanan düzenlenebilir taslaklar.
- `cv_analiz_istekleri`: günlük iki analiz sınırını eşzamanlı isteklerde de koruyan geçici hak kayıtları. Boş olabilir; kaldırılırsa limit güvenliği bozulur.
- `aday_yol_haritasi_gorevleri`: Gemini'nin ürettiği haftalık görevler, tamamlanma durumu ve soft delete ile arşivlenen eski planlar. Görev başlığı ve açıklaması doğrudan burada tutulur.
- `private.saklanan_dosya_gecmisi`: kaldırılan/değiştirilen fotoğraf ve sertifika dosyalarının izini tutan denetim kaydı. Boş olabilir; tetikleyiciler kullanır.

## Sonraki modüller için ilk şemada ayrılanlar

- `beceriler` ve `beceri_kategorileri`: yazılımın yanında yönetim, satış, finans, eğitim, sağlık, lojistik ve diğer alanları kapsayan beceri kataloğu ve gruplama. Katalog `20261103_expand_skill_catalog.sql` ile genişletildi.
- `beceri_iliskileri` (13 kayıt): haritada gösterilen katalog bağlantıları.
- `beceri_esanlamlilari` (22 kayıt): mevcut `beceri_ara` fonksiyonunun eşanlamlı araması; korunmalı.
- `aday_becerileri`: adayın seçtiği katalog becerileri. Aday ve beceri arasında tek ara tablo; silme işlemi `is_deleted` ile yapılır. Beceri haritası bu seçimleri ve son CV analizindeki katalogla eşleşen önerileri ayrı işaretlerle gösterir. CV önerileri aday onaylayana kadar bu tabloya yazılmaz.
- `meslekler` ve `meslek_becerileri`: yol haritasında rol seçimi ve gerekli becerilerin belirlenmesi için kullanılır.
- `proje_becerileri` (boştu): uygulama kodunda hiç kullanılmıyordu. Proje teknolojileri `projeler.teknolojiler` alanında tutuluyor. 3 Kasım 2026 tarihinde canlı veritabanından kaldırıldı; işlem öncesinde tablo boşluğu kontrol edildi.
- `beceri_gorev_sablonlari`: Gemini planı kullanıma alınınca işlevsiz kaldı. 20 şablon ve arşivde bunlara bağlı 6 görev vardı; arşiv görevlerinin metinleri `aday_yol_haritasi_gorevleri` içinde korundu. `sablon_id` alanı ve şablon tablosu `20261103_remove_roadmap_task_templates.sql` ile kaldırıldı. Sonrasında 14 görev kaydı korunduğu doğrulandı.

## Şu an uygulama kodunda kullanılmayanlar

- `riza_metinleri`, `riza_kayitlari`, `guncel_riza_metinleri` görünümü: ilk teslim edilen SQL şemasından geliyor; canlı veritabanında iki tabloda da sıfır kayıt var. CV yükleme için rıza önkoşulu daha önce kaldırıldı. Bu nesneler mevcut akışın çalışması için gerekli değil, fakat gelecekteki onay kayıtları için tutulmuş olabilir. Silinmeleri görünüm, fonksiyon ve RLS bağımlılıklarını da etkiler; ayrı bir şema kararı ve geri dönüş planı olmadan düşürülmemelidir.

Bu incelemede yeni gereksiz tablo oluşturulmadı. `cv_analiz_istekleri`, `cv_analizleri` ve özel dosya geçmişi tablosunun her birinin somut görevi var. İlan, şirket ve eşleştirme tabloları henüz canlı şemada oluşturulmamış; ilgili modülde eklenecek.
