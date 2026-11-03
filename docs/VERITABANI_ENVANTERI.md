# Veritabanı envanteri — 3 Kasım 2026

Supabase `public` şemasındaki beceri tabloları canlı kayıt sayıları, uygulama kodu ve modül planıyla karşılaştırıldı. Boş tablo tek başına gereksiz tablo anlamına gelmez.

## Şu anda çalışan akışlar

- `aktorler`, `sistem_kullanicilari`, `roller`, `kullanici_roller`, `aday_profilleri`: kimlik, rol ve aday profili.
- `deneyimler`, `egitimler`, `projeler`, `sertifikalar`: profil kayıtları.
- `cv_dosyalari`, `cv_analizleri`: CV ve rapor kayıtları.
- `cv_analiz_istekleri`: günlük iki analiz sınırını eşzamanlı isteklerde de koruyan geçici hak kayıtları. Boş olabilir; kaldırılırsa limit güvenliği bozulur.
- `private.saklanan_dosya_gecmisi`: kaldırılan/değiştirilen fotoğraf ve sertifika dosyalarının izini tutan denetim kaydı. Boş olabilir; tetikleyiciler kullanır.

## Sonraki modüller için ilk şemada ayrılanlar

- `beceriler` (126 kayıt) ve `beceri_kategorileri` (26 kayıt): yazılımın yanında yönetim, satış, finans, eğitim, sağlık, lojistik ve diğer alanları kapsayan beceri kataloğu ve gruplama. Katalog `20261103_expand_skill_catalog.sql` ile genişletildi.
- `beceri_iliskileri` (13 kayıt): haritada gösterilen katalog bağlantıları.
- `beceri_esanlamlilari` (22 kayıt): mevcut `beceri_ara` fonksiyonunun eşanlamlı araması; korunmalı.
- `aday_becerileri`: adayın seçtiği katalog becerileri. Aday ve beceri arasında tek ara tablo; silme işlemi `is_deleted` ile yapılır. Beceri haritası bu seçimleri ve son CV analizindeki katalogla eşleşen önerileri ayrı işaretlerle gösterir. CV önerileri aday onaylayana kadar bu tabloya yazılmaz.
- `meslekler` ve `meslek_becerileri` (ikisi de boş): ileride meslek eşleştirme için ayrılmış. Şu an ekranda kullanılmıyor; o modül tasarlanırken yeniden değerlendirilir.
- `proje_becerileri` (boştu): uygulama kodunda hiç kullanılmıyordu. Proje teknolojileri `projeler.teknolojiler` alanında tutuluyor. 3 Kasım 2026 tarihinde canlı veritabanından kaldırıldı; işlem öncesinde tablo boşluğu kontrol edildi.

## Şu an uygulama kodunda kullanılmayanlar

- `riza_metinleri`, `riza_kayitlari`, `guncel_riza_metinleri` görünümü: ilk teslim edilen SQL şemasından geliyor; canlı veritabanında iki tabloda da sıfır kayıt var. CV yükleme için rıza önkoşulu daha önce kaldırıldı. Bu nesneler mevcut akışın çalışması için gerekli değil, fakat gelecekteki onay kayıtları için tutulmuş olabilir. Silinmeleri görünüm, fonksiyon ve RLS bağımlılıklarını da etkiler; ayrı bir şema kararı ve geri dönüş planı olmadan düşürülmemelidir.

Bu incelemede yeni gereksiz tablo oluşturulmadı. `cv_analiz_istekleri`, `cv_analizleri` ve özel dosya geçmişi tablosunun her birinin somut görevi var. İlan, şirket ve eşleştirme tabloları henüz canlı şemada oluşturulmamış; ilgili modülde eklenecek.
