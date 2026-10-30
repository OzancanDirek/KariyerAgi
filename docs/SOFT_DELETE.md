# Soft delete kuralı

Kullanıcının sildiği deneyim, eğitim, proje, sertifika ve CV kayıtları `is_deleted = true` olarak işaretlenir. Listeleme, tek kayıt okuma, güncelleme ve birincil CV seçimi yalnızca `is_deleted = false` kayıtları kullanır. Aynı kaydı ikinci kez silmek bulunamadı sonucunu verir.

Profil fotoğrafı veya sertifika belgesi kaldırıldığında aktif dosya yolu temizlenir; önceki yol `private.saklanan_dosya_gecmisi` tablosuna yazılır ve dosya depoda tutulur. Değiştirme işlemleri de eski dosyayı korur. Başarısız yeni yüklemelerin geçici dosyaları ise temizlenir.

Yeni silme özelliği için önce `sql/migrations/20261030_soft_delete.sql` geçişi uygulanmalı, sonra API yeniden başlatılmalıdır. Geçiş uygulanmadan API'nin yeni sürümü çalıştırılmamalıdır.

Sonraki modüllerde yeni bir kullanıcı silme işlemi eklenirse aynı kural uygulanmalı: kayıt işaretlenmeli, bütün normal okuma ve güncelleme yolları silinmiş kaydı dışlamalı, bağlı dosyalar korunmalı. Geri yükleme ve kalıcı temizleme ayrı ve yetkili yönetim akışları olarak tasarlanmalıdır.
