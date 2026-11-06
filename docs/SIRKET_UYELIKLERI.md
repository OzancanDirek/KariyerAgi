# Şirket üyelikleri

Şirketin sahibi `sirketler.sahip_kullanici_id` alanında kalır. `sirket_uyelikleri`
şirket ile işveren hesabı arasındaki ilişkiyi tutar. Mevcut şirket sahipleri migrasyonla
`sahip/aktif` üye olur; yeni şirketlerde bu üyelik otomatik oluşturulur.

İşveren hesabı açmak, bir şirkete erişim vermez. Şirket sahibi mevcut işveren hesabını
e-posta ile davet eder. Üyelik `beklemede` başlar. Davet edilen kişi kendi hesabıyla
giriş yapıp kabul edince `aktif` olur; reddedebilir. Sahip çalışan üyeliğini soft delete
ile kaldırabilir. Şirket düzenleme ve üye yönetimi yalnızca sahibindedir. Aktif `ise_alim`
üyesi şirket ilanlarını ve bunlara gelen başvuruları yönetebilir. Aday rolü bu akışa
katılamaz.

API uçları:

- `GET /api/company-members/mine`: kendi üyelikleri ve davetleri
- `GET /api/company-members/company/{companyId}`: sahibin ekip listesi
- `POST /api/company-members/company/{companyId}/invite`: `{ "email": "..." }`
- `POST /api/company-members/{membershipId}/accept` ve `/decline`
- `DELETE /api/company-members/company/{companyId}/{membershipId}`: erişimi kaldırır

Web ve mobil aynı Supabase hesabını ve tabloları kullanır. Giriş ortak bir ekrandır;
hesap türü kayıt sırasında seçilir ve girişten sonra sunucu rolünden okunur.

Kayıtta web artık `ad`, `soyad`, `rol` yanında `telefon` metadata alanını da gönderir.
Telefon Türkiye cep numarası olarak on haneye normalize edilir (`5xxxxxxxxx`).
`sistem_kullanicilari.telefon` ve büyük/küçük harften bağımsız `eposta` tekildir.
Eski hesapların boş telefonları değiştirilmez; mobil kayıt ekranına da telefon alanı
eklenmelidir. Profil güncellemesi aynı numarayı başka bir hesap için kullanamaz.

Son başvuru tarihi dolan yayımlanmış ilanlar Supabase Cron ile dakikada bir `kapali`
durumuna geçirilir. API, zamanlayıcının iki çalışması arasındaki sürede de süresi
dolan ilanı aday listesinde göstermez ve başvuru kabul etmez. Mobil istemci doğrudan
Supabase sorgusu yapıyorsa `son_basvuru_tarihi > now()` koşulunu da uygulamalıdır.
