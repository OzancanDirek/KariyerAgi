# Web ve API değişiklikleri (16 Kasım 2026)

- `POST /api/auth/password-reset` `{ "email": "..." }`: Supabase şifre yenileme e-postası gönderir. Güvenli kullanıcı mesajı için başarılı yanıt `204` olur.
- `PUT /api/auth/password` `{ "password": "..." }`: yenileme bağlantısındaki Bearer token ile yeni şifreyi kaydeder. Web bağlantıda `type=recovery` parametresini okur.
- `POST /api/cv/{cvFileId}/analysis` artık `{ "acknowledged": true }` gövdesini ister. Eksik veya `false` olduğunda `CV-011` döner. Web, her analiz için yeniden işaretlenen ayrı bir bilgilendirme kutusu gösterir. Mobil istemcinin de bu gövdeyi ve kullanıcı etkileşimini eklemesi gerekir.
- CV analiz kaydındaki `ai_islem_onayi_tarihi`, işlemi başlatmadan hemen önce kullanıcının verdiği onayın zamanını tutar. Bunun için `sql/migrations/20261116_cv_analysis_processing_acknowledgement.sql` önce uygulanmalıdır.
- Yönetici için `GET /api/learning-resources/manage/skills` eklendi. Mevcut kaynak listeleme, ekleme ve düzenleme API'leri ile yeni “Eğitim Kaynakları” yönetim ekranı kullanılır.
- Meslek tekrarını engelleyen `sql/migrations/20261116_custom_career_prevent_duplicates.sql` ayrıca uygulanmalıdır. Eski tekrarları silmez; yol haritası listesinde tek gösterir.

CV ekranındaki bilgilendirme, tamamlanmamış yasal aydınlatma ve rıza metinlerinin yerine geçmez. Yayımlanmadan önce `docs/CV_AYDINLATMA_VE_RIZA_TASLAGI.md` içindeki eksikler ayrıca sonuçlandırılmalıdır.
