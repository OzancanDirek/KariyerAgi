# Dış ilan araması

Adayın İş İlanları ekranındaki araması, CareerPath ilanlarının yanında Careerjet sonuçlarını da sorgular. Dış ilanlar CareerPath veritabanına kopyalanmaz. “Kaynak sitede başvur” bağlantısı Careerjet'in sağladığı takip URL'sini yeni sekmede açar; dış başvuru CareerPath başvurusu olarak kaydedilmez.

## Etkinleştirme

1. Careerjet yayıncı hesabında CareerPath web sitesi için API anahtarı alın: https://www.careerjet.com.tr/partners/api
2. Yalnızca API sunucusunun gizli ortam değişkeni `Careerjet__ApiKey` içine anahtarı koyun. Web istemcisine veya Git'e koymayın.
3. `Careerjet__PublisherUrl` değerini yayıncı hesabında tanımlanan web sitesinin adresiyle aynı tutun.
4. API'yi yeniden yayımlayıp aday hesabıyla en az iki karakterlik aramayı test edin. Anahtar yokken API `EXT-001`, kaynak hatasında `EXT-002` döndürür; CareerPath ilanları gösterilmeye devam eder.

Arama, adayın eylemiyle yapılır. Careerjet API'si `user_ip` ve `user_agent` istediğinden günlük toplu veri toplama görevi kullanılmaz. API yalnızca arama terimi, IP adresi ve tarayıcı bilgisini Careerjet'e gönderir; CV ve profil verisi göndermez. Careerjet yanıtı kaynak platformu belirtmediğinden tek tek ilanları LinkedIn veya Kariyer.net olarak etiketlemeyin. Gerçek Türkiye kapsaması ve yayıncı koşulları anahtar alınıp örnek aramalar yapıldıktan sonra doğrulanmalıdır.
