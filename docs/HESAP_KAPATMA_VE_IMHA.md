# Hesap kapatma ve kalıcı imha

## Kullanıcı akışı

Web: üst menü veya sol menü → **Hesabımı kapat** → `HESABIMI KAPAT` yaz.
Mobil istemci aynı işlemi `POST /api/account/closure` ve
`{"confirmation":"HESABIMI KAPAT"}` ile çağırabilir. Bearer oturumu gerekir.
Yanıt `requestId` ve `scheduledDeletionAt` içerir. Kapatma anında aktif
başvurular görünümden kaldırılır, şirket üyeliği silinir ve hesapla yapılan
uygulama veri erişimi kesilir. Şirket sahibi önce sahipliği devretmelidir
(`ACC-003`, 409). Kapanmış hesapla giriş ve oturum yenileme `ACC-001` (403)
döner. İstemci bu kodu alınca kayıtlı oturumu temizlemelidir.

## İmha

`private.hesap_kapatma_talepleri` talep ve işlem durumunu tutar. Tarih talebin
alınmasından **iki takvim ayı** sonradır. Günlük `account-purge` görevi yalnızca
süresi dolmuş talepleri alır. Önce Supabase Storage API aracılığıyla kullanıcı
dosyalarını kaldırır; depoda dosya kaldıysa veritabanı silmesini reddeder.
Ardından aday/üyelik/başvuru ve bağlı kayıtları, son olarak Supabase Auth hesabını
siler. Başarısız adımlar bir sonraki çalışmada yeniden denenir. Audit satırında
kimlik ve e-posta tutulmaz; silme tamamlanınca Auth kullanıcı FK'si boşalır.

Storage dosyaları SQL ile doğrudan silinmez. Storage'daki nesne silinmesi ve
Auth kullanıcı silinmesi yedeklerin veya dış hizmetlerdeki kopyaların aynı anda
yok olduğu anlamına gelmez. Tek tek CV dosyasını arayüzden kaldırma, mevcut
soft-delete kuralıyla çalışmaya devam eder; iki aylık fiziksel imha kuralı
**hesap kapatma** içindir.

## Kurulum ve kontrol

1. `sql/migrations/20261116_account_closure_retention.sql` uygulanır.
2. `supabase/functions/account-purge` yayımlanır. `verify_jwt` kapalıysa
   güçlü `PURGE_CRON_SECRET` zorunludur; işlev ayrıca gelen `x-cron-secret`
   başlığını doğrular. Gizli değer kodda veya Git'te tutulmaz.
3. Supabase Cron/pg_net, görevi her gün çağıracak şekilde kurulur. Çağrı
   Supabase Vault'ta saklanan gizli değeri kullanır. Render'ın boşta uyuması
   bu görevi etkilemez.
4. `select * from public.hesap_imha_kuyrugu()` yalnızca `service_role` ile
   erişilebilir. İşlev yanıtı `completed` ve `failed` listelerini gösterir.
   Başarısız kayıtlar ve `private.hesap_kapatma_talepleri` durumu izlenir.
5. Canlı testte gerçek kullanıcı yerine yalnızca bu amaçla açılmış test hesabı
   kullanılır; kalıcı silme için test hesabının süresini öne almak üretim
   verilerinde yapılmamalıdır.

Not: Şirket sahibi hesabı için sahiplik devri ekranı henüz yoktur. Bu hesaplar
`ACC-003` alır; yöneticinin güvenli devri tamamlaması gerekir.
