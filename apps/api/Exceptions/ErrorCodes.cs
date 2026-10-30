namespace CareerPath.Api.Exceptions;

public class ErrorDefinition
{
    public string Code { get; }
    public string Message { get; }
    public int Status { get; }

    public ErrorDefinition(string code, string message, int status)
    {
        Code = code;
        Message = message;
        Status = status;
    }
}

public static class ErrorCodes
{
    public static readonly ErrorDefinition Validation = new("VAL-001", "Gönderilen bilgiler geçersiz.", 400);
    public static readonly ErrorDefinition FullNameRequired = new("AUTH-001", "Ad ve soyad gereklidir.", 400);
    public static readonly ErrorDefinition InvalidRole = new("AUTH-002", "Hesap türü aday veya isveren olmalıdır.", 400);
    public static readonly ErrorDefinition InvalidEmail = new("AUTH-003", "Geçerli bir e-posta adresi girin.", 400);
    public static readonly ErrorDefinition PasswordTooShort = new("AUTH-004", "Şifre en az 6 karakter olmalıdır.", 400);
    public static readonly ErrorDefinition RefreshTokenRequired = new("AUTH-005", "Yenileme tokenı gereklidir.", 400);
    public static readonly ErrorDefinition InvalidCredentials = new("AUTH-006", "E-posta, şifre veya oturum bilgisi geçersiz.", 401);
    public static readonly ErrorDefinition EmailNotConfirmed = new("AUTH-007", "Giriş yapmak için e-postanızı doğrulayın.", 403);
    public static readonly ErrorDefinition EmailAlreadyRegistered = new("AUTH-008", "Bu e-posta adresiyle kayıtlı bir hesap var.", 409);
    public static readonly ErrorDefinition MissingToken = new("AUTH-009", "Geçerli bir oturum tokenı gereklidir.", 401);
    public static readonly ErrorDefinition TooManyRequests = new("AUTH-010", "Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.", 429);
    public static readonly ErrorDefinition AuthConfigurationMissing = new("AUTH-011", "Supabase bağlantı ayarları eksik.", 503);
    public static readonly ErrorDefinition AuthServiceUnavailable = new("AUTH-012", "Kimlik servisine ulaşılamıyor.", 503);
    public static readonly ErrorDefinition InvalidAuthResponse = new("AUTH-013", "Kimlik servisinden geçerli oturum bilgisi gelmedi.", 502);
    public static readonly ErrorDefinition AuthServiceFailed = new("AUTH-014", "Kimlik servisi işlemi tamamlayamadı.", 502);
    public static readonly ErrorDefinition Unexpected = new("SYS-001", "Beklenmeyen bir sistem hatası oluştu.", 500);
    public static readonly ErrorDefinition ProfileNotFound = new("PRO-001", "Profil bulunamadı.", 404);
    public static readonly ErrorDefinition ProfileNameTooLong = new("PRO-002", "Ad ve soyad en fazla 100 karakter olabilir.", 400);
    public static readonly ErrorDefinition ProfilePhoneTooLong = new("PRO-003", "Telefon en fazla 30 karakter olabilir.", 400);
    public static readonly ErrorDefinition ProfileLocationTooLong = new("PRO-004", "Konum en fazla 150 karakter olabilir.", 400);
    public static readonly ErrorDefinition ProfilePhotoUrlInvalid = new("PRO-005", "Geçerli bir HTTPS profil fotoğrafı adresi girin.", 400);
    public static readonly ErrorDefinition ProfileAccessDenied = new("PRO-006", "Bu profile erişim izniniz yok.", 403);
    public static readonly ErrorDefinition ProfileServiceUnavailable = new("PRO-007", "Profil servisine ulaşılamıyor.", 503);
    public static readonly ErrorDefinition ProfileServiceFailed = new("PRO-008", "Profil bilgileri işlenemedi.", 502);
    public static readonly ErrorDefinition ProfilePhotoInvalid = new("PRO-009", "JPG veya PNG biçiminde en fazla 3 MB fotoğraf yükleyin.", 400);
    public static readonly ErrorDefinition ProfilePhotoNotFound = new("PRO-010", "Profil fotoğrafı bulunamadı.", 404);
    public static readonly ErrorDefinition CareerProfileNotFound = new("CAR-001", "Aday kariyer profili bulunamadı.", 404);
    public static readonly ErrorDefinition CareerProfileTextTooLong = new("CAR-002", "Kariyer profili metni izin verilen uzunluğu aşıyor.", 400);
    public static readonly ErrorDefinition CareerProfileUrlInvalid = new("CAR-003", "Geçerli bir HTTPS bağlantısı girin.", 400);
    public static readonly ErrorDefinition CareerProfileLevelInvalid = new("CAR-004", "Geçersiz deneyim veya hedef kıdem seviyesi.", 400);
    public static readonly ErrorDefinition CareerProfileWorkModelInvalid = new("CAR-005", "Geçersiz çalışma modeli seçimi.", 400);
    public static readonly ErrorDefinition CareerProfileLocationInvalid = new("CAR-006", "En fazla 10 konum girilebilir; her biri 150 karakteri geçemez.", 400);
    public static readonly ErrorDefinition CareerProfileVisibilityInvalid = new("CAR-007", "Geçersiz profil görünürlüğü seçimi.", 400);
    public static readonly ErrorDefinition ExperienceRequiredFields = new("EXP-001", "Pozisyon ve şirket adı 1-150 karakter olmalıdır.", 400);
    public static readonly ErrorDefinition ExperienceInvalidDates = new("EXP-002", "Başlangıç tarihi gereklidir ve bitiş tarihi başlangıçtan önce olamaz.", 400);
    public static readonly ErrorDefinition ExperienceInvalidType = new("EXP-003", "Geçersiz çalışma tipi veya modeli.", 400);
    public static readonly ErrorDefinition ExperienceTextTooLong = new("EXP-004", "Konum veya açıklama izin verilen uzunluğu aşıyor.", 400);
    public static readonly ErrorDefinition ExperienceNotFound = new("EXP-005", "Deneyim kaydı bulunamadı.", 404);
    public static readonly ErrorDefinition ExperienceOperationFailed = new("EXP-006", "Deneyim kaydı tamamlanamadı.", 502);
    public static readonly ErrorDefinition EducationInstitutionRequired = new("EDU-001", "Kurum adı gereklidir.", 400);
    public static readonly ErrorDefinition EducationTextTooLong = new("EDU-002", "Eğitim bilgisi izin verilen uzunluğu aşıyor.", 400);
    public static readonly ErrorDefinition EducationInvalidDegree = new("EDU-003", "Geçersiz eğitim derecesi.", 400);
    public static readonly ErrorDefinition EducationInvalidDates = new("EDU-004", "Bitiş tarihi başlangıç tarihinden önce olamaz.", 400);
    public static readonly ErrorDefinition EducationInvalidGrade = new("EDU-005", "Not ortalaması veya not ölçeği geçersiz.", 400);
    public static readonly ErrorDefinition EducationNotFound = new("EDU-006", "Eğitim kaydı bulunamadı.", 404);
    public static readonly ErrorDefinition EducationOperationFailed = new("EDU-007", "Eğitim kaydı tamamlanamadı.", 502);
    public static readonly ErrorDefinition CertificateNameRequired = new("CER-001", "Sertifika adı gereklidir.", 400);
    public static readonly ErrorDefinition CertificateIssuerRequired = new("CER-002", "Veren kurum gereklidir.", 400);
    public static readonly ErrorDefinition CertificateTextTooLong = new("CER-003", "Sertifika bilgisi izin verilen uzunluğu aşıyor.", 400);
    public static readonly ErrorDefinition CertificateUrlInvalid = new("CER-004", "Geçerli bir HTTPS doğrulama bağlantısı girin.", 400);
    public static readonly ErrorDefinition CertificateInvalidDates = new("CER-005", "Geçerlilik bitiş tarihi veriliş tarihinden önce olamaz.", 400);
    public static readonly ErrorDefinition CertificateNotFound = new("CER-006", "Sertifika bulunamadı.", 404);
    public static readonly ErrorDefinition CertificateOperationFailed = new("CER-007", "Sertifika işlemi tamamlanamadı.", 502);
    public static readonly ErrorDefinition CertificateFileInvalid = new("CER-008", "PDF, JPG veya PNG biçiminde en fazla 10 MB dosya yükleyin.", 400);
    public static readonly ErrorDefinition CertificateStorageFailed = new("CER-009", "Sertifika belgesi işlenemedi.", 502);
    public static readonly ErrorDefinition CertificateDocumentNotFound = new("CER-010", "Sertifika belgesi bulunamadı.", 404);
    public static readonly ErrorDefinition PrivateStorageFailed = new("STO-001", "Özel dosya alanı işlemi tamamlanamadı.", 502);
    public static readonly ErrorDefinition ProjectNameRequired = new("PRJ-001", "Proje adı gereklidir.", 400);
    public static readonly ErrorDefinition ProjectTextTooLong = new("PRJ-002", "Proje bilgisi izin verilen uzunluğu aşıyor.", 400);
    public static readonly ErrorDefinition ProjectUrlInvalid = new("PRJ-003", "Geçerli bir HTTPS bağlantısı girin.", 400);
    public static readonly ErrorDefinition ProjectTechnologiesInvalid = new("PRJ-004", "En fazla 20 teknoloji eklenebilir; her biri 80 karakteri geçemez.", 400);
    public static readonly ErrorDefinition ProjectInvalidDates = new("PRJ-005", "Bitiş tarihi başlangıç tarihinden önce olamaz.", 400);
    public static readonly ErrorDefinition ProjectNotFound = new("PRJ-006", "Proje bulunamadı.", 404);
    public static readonly ErrorDefinition ProjectOperationFailed = new("PRJ-007", "Proje işlemi tamamlanamadı.", 502);
    public static readonly ErrorDefinition CvNotFound = new("CV-001", "CV dosyası bulunamadı.", 404);
    public static readonly ErrorDefinition CvFileInvalid = new("CV-002", "PDF veya DOCX biçiminde en fazla 10 MB dosya yükleyin.", 400);
    public static readonly ErrorDefinition CvConsentRequired = new("CV-003", "CV yüklemek için güncel açık rıza metnini onaylamanız gerekiyor.", 403);
    public static readonly ErrorDefinition CvConsentUnavailable = new("CV-004", "CV yükleme için veri aktarımı ve bilgilendirme koşulları henüz tamamlanmadı.", 503);
    public static readonly ErrorDefinition CvOperationFailed = new("CV-005", "CV işlemi tamamlanamadı.", 502);
}
