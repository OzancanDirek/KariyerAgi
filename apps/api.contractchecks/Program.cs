using System.Text.Json;
using CareerPath.Api.Entities;
using CareerPath.Api.Mappers;

var options = new JsonSerializerOptions(JsonSerializerDefaults.Web);

Check<SystemUser>(
    """{"id":"067063ea-449d-407e-866b-df8193ed8396","ad":"Ozan","soyad":"Direk","eposta":"ozan@example.com","telefon":"5551234567","konum":"İstanbul","profil_fotografi_url":null}""",
    user => ProfileMapper.ToResponse(user),
    new Dictionary<string, string> { ["firstName"] = "Ozan", ["lastName"] = "Direk", ["email"] = "ozan@example.com", ["phone"] = "5551234567", ["location"] = "İstanbul" });

Check<CandidateProfile>(
    """{"id":"067063ea-449d-407e-866b-df8193ed8396","unvan":"Yazılım Geliştirici","ozet":"Özet","deneyim_seviyesi":"orta","linkedin_url":null,"github_url":null,"portfolyo_url":null,"hedef_unvan":"Full Stack Developer","hedef_sektor":"Sigorta","calisma_modelleri":["hibrit"],"tercih_edilen_konumlar":["İstanbul"],"hedef_kidem":"orta","kariyer_notlari":null,"profil_gorunurlugu":"basvurulanlar"}""",
    profile => CareerProfileMapper.ToResponse(profile),
    new Dictionary<string, string> { ["title"] = "Yazılım Geliştirici", ["summary"] = "Özet", ["targetTitle"] = "Full Stack Developer", ["targetIndustry"] = "Sigorta" });

Check<Experience>(
    """{"id":"067063ea-449d-407e-866b-df8193ed8396","aday_id":"067063ea-449d-407e-866b-df8193ed8396","pozisyon":"Geliştirici","sirket_adi":"Örnek Şirket","calisma_tipi":"staj","calisma_modeli":"hibrit","konum":"İstanbul","baslangic_tarihi":"2024-01-01","bitis_tarihi":null,"aciklama":"Açıklama"}""",
    experience => ExperienceMapper.ToResponse(experience),
    new Dictionary<string, string> { ["position"] = "Geliştirici", ["company"] = "Örnek Şirket", ["employmentType"] = "staj", ["workModel"] = "hibrit", ["location"] = "İstanbul", ["startDate"] = "2024-01-01" });

Check<Education>(
    """{"id":"067063ea-449d-407e-866b-df8193ed8396","aday_id":"067063ea-449d-407e-866b-df8193ed8396","kurum":"Işık Üniversitesi","derece":"lisans","bolum":"Yönetim Bilişim Sistemleri","baslangic_tarihi":"2022-01-01","bitis_tarihi":"2027-08-10","not_ortalamasi":3.24,"not_olcegi":4,"aciklama":"Açıklama"}""",
    education => EducationMapper.ToResponse(education),
    new Dictionary<string, string> { ["institution"] = "Işık Üniversitesi", ["degree"] = "lisans", ["fieldOfStudy"] = "Yönetim Bilişim Sistemleri", ["startDate"] = "2022-01-01", ["endDate"] = "2027-08-10", ["gradeAverage"] = "3.24", ["gradeScale"] = "4" });

Check<Certificate>(
    """{"id":"067063ea-449d-407e-866b-df8193ed8396","aday_id":"067063ea-449d-407e-866b-df8193ed8396","ad":"AWS Cloud Practitioner","veren_kurum":"Amazon Web Services","verilis_tarihi":"2024-01-01","gecerlilik_bitis_tarihi":"2027-01-01","sertifika_no":"ABC-123","dogrulama_url":"https://example.com/verify","belge_yolu":"067063ea-449d-407e-866b-df8193ed8396/cert/file.pdf","belge_dosya_adi":"sertifika.pdf"}""",
    certificate => CertificateMapper.ToResponse(certificate),
    new Dictionary<string, string> { ["name"] = "AWS Cloud Practitioner", ["issuer"] = "Amazon Web Services", ["issueDate"] = "2024-01-01", ["expiryDate"] = "2027-01-01", ["credentialId"] = "ABC-123", ["verificationUrl"] = "https://example.com/verify", ["documentFileName"] = "sertifika.pdf", ["hasDocument"] = "True" });

Check<Project>(
    """{"id":"067063ea-449d-407e-866b-df8193ed8396","aday_id":"067063ea-449d-407e-866b-df8193ed8396","ad":"CareerPath","aciklama":"Kariyer platformu","rol":"Geliştirici","teknolojiler":["React",".NET"],"proje_url":"https://example.com","kod_url":null,"baslangic_tarihi":"2026-01-01","bitis_tarihi":null}""",
    project => ProjectMapper.ToResponse(project),
    new Dictionary<string, string> { ["name"] = "CareerPath", ["description"] = "Kariyer platformu", ["role"] = "Geliştirici", ["projectUrl"] = "https://example.com", ["startDate"] = "2026-01-01" });

Check<CvFile>(
    """{"id":"067063ea-449d-407e-866b-df8193ed8396","aday_id":"067063ea-449d-407e-866b-df8193ed8396","depolama_yolu":"067063ea-449d-407e-866b-df8193ed8396/cv.pdf","orijinal_dosya_adi":"cv.pdf","mime_tipi":"application/pdf","boyut_bayt":12345,"birincil_mi":true,"olusturma_tarihi":"2026-01-01T00:00:00Z"}""",
    file => CvMapper.ToResponse(file),
    new Dictionary<string, string> { ["fileName"] = "cv.pdf", ["contentType"] = "application/pdf", ["sizeBytes"] = "12345", ["isPrimary"] = "True" });

Console.WriteLine("Profil, kariyer, deneyim, eğitim, sertifika, proje ve CV veri sözleşmeleri doğrulandı.");

void Check<TEntity>(string databaseJson, Func<TEntity, object> map, Dictionary<string, string> expected)
{
    var entity = JsonSerializer.Deserialize<TEntity>(databaseJson, options)
        ?? throw new Exception($"{typeof(TEntity).Name} veritabanı yanıtı okunamadı.");
    var responseJson = JsonSerializer.Serialize(map(entity), options);
    using var response = JsonDocument.Parse(responseJson);
    foreach (var (property, value) in expected)
    {
        if (response.RootElement.GetProperty(property).ToString() != value)
        {
            throw new Exception($"{typeof(TEntity).Name} için {property} alanı yanlış eşleştirildi.");
        }
    }
}
