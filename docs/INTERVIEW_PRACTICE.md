# Mülakat provası

Aday, herhangi bir kaynaktan aldığı ilan metnini `/interview-practice` ekranına yapıştırır.
Bu özellik dış sitelerden ilan toplamaz. İlan metni ve yanıtlar CareerPath veritabanına
yazılmaz; web ekranında yalnızca bileşen açıkken bellekte tutulur. Sunum için test ilanı
oluşturmak gerekmez.

Oturum Bearer token'ı ile iki API çağrısı yapılır:

- `POST /api/interview/questions`: `{ "jobText": "...", "language": "tr" }`.
  100-10000 karakterlik metinden beş soru döner: `{ "questions": ["..."] }`.
- `POST /api/interview/review`: `{ "jobText": "...", "language": "tr", "answers":
  [{ "question": "...", "answer": "..." }] }`. Beş yanıt gerekir. Sonuç:
  `{ "feedback": [{ "strength": "...", "improvement": "...", "suggestion": "..." }],
  "summary": "..." }`.

`language` `tr` veya `en` olabilir. Hatalar `INT-001` (geçersiz girdi) ve
`INT-002` (yapay zekâ işlemi başarısız) kodlarını döndürür. İlan metni ve yanıtlar
her iki çağrıda Gemini'ye aktarılır; kullanıcı ekranda bunu onaylar. Sunucuda
girdi veya çıktı için kayıt tablosu oluşturulmadı.
