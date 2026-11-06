using System.Text.Json.Serialization;

namespace CareerPath.Api.Dtos.Recruitment;

public class CompanyRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Sector { get; set; }
    public string? Location { get; set; }
    public string? Website { get; set; }
}

public class CompanyReviewRequest
{
    public bool? Approved { get; set; }
}

public class CompanyResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Sector { get; set; }
    public string? Location { get; set; }
    public string? Website { get; set; }
    public string VerificationStatus { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class JobRequest
{
    public Guid CompanyId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Location { get; set; }
    public string? WorkModel { get; set; }
    public string? EmploymentType { get; set; }
    public string? Status { get; set; }
    public DateTimeOffset? ApplicationDeadline { get; set; }
}

public class JobResponse
{
    public Guid Id { get; set; }
    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string WorkModel { get; set; } = string.Empty;
    public string EmploymentType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTimeOffset? PublishedAt { get; set; }
    public DateTimeOffset? ApplicationDeadline { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class ApplicationRequest
{
    public Guid? CvFileId { get; set; }
    public string? CoverLetter { get; set; }
}

public class ApplicationResponse
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public Guid CandidateId { get; set; }
    public string? CandidateName { get; set; }
    public Guid? CvFileId { get; set; }
    public string? CoverLetter { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class CompanyRow
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("sahip_kullanici_id")] public Guid OwnerId { get; set; }
    [JsonPropertyName("ad")] public string Name { get; set; } = string.Empty;
    [JsonPropertyName("aciklama")] public string? Description { get; set; }
    [JsonPropertyName("sektor")] public string? Sector { get; set; }
    [JsonPropertyName("konum")] public string? Location { get; set; }
    [JsonPropertyName("web_sitesi")] public string? Website { get; set; }
    [JsonPropertyName("dogrulama_durumu")] public string VerificationStatus { get; set; } = string.Empty;
    [JsonPropertyName("olusturma_tarihi")] public DateTimeOffset CreatedAt { get; set; }
    [JsonPropertyName("guncelleme_tarihi")] public DateTimeOffset UpdatedAt { get; set; }
}

public class JobRow
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("sirket_id")] public Guid CompanyId { get; set; }
    [JsonPropertyName("baslik")] public string Title { get; set; } = string.Empty;
    [JsonPropertyName("aciklama")] public string Description { get; set; } = string.Empty;
    [JsonPropertyName("konum")] public string? Location { get; set; }
    [JsonPropertyName("calisma_modeli")] public string WorkModel { get; set; } = string.Empty;
    [JsonPropertyName("istihdam_turu")] public string EmploymentType { get; set; } = string.Empty;
    [JsonPropertyName("durum")] public string Status { get; set; } = string.Empty;
    [JsonPropertyName("yayin_tarihi")] public DateTimeOffset? PublishedAt { get; set; }
    [JsonPropertyName("son_basvuru_tarihi")] public DateTimeOffset? ApplicationDeadline { get; set; }
    [JsonPropertyName("olusturma_tarihi")] public DateTimeOffset CreatedAt { get; set; }
    [JsonPropertyName("guncelleme_tarihi")] public DateTimeOffset UpdatedAt { get; set; }
    [JsonPropertyName("sirketler")] public JobCompanyRow? Company { get; set; }
}

public class JobCompanyRow
{
    [JsonPropertyName("ad")] public string Name { get; set; } = string.Empty;
}

public class ApplicationRow
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("ilan_id")] public Guid JobId { get; set; }
    [JsonPropertyName("aday_id")] public Guid CandidateId { get; set; }
    [JsonPropertyName("aday_adi")] public string? CandidateName { get; set; }
    [JsonPropertyName("cv_dosyasi_id")] public Guid? CvFileId { get; set; }
    [JsonPropertyName("on_yazi")] public string? CoverLetter { get; set; }
    [JsonPropertyName("durum")] public string Status { get; set; } = string.Empty;
    [JsonPropertyName("olusturma_tarihi")] public DateTimeOffset CreatedAt { get; set; }
    [JsonPropertyName("guncelleme_tarihi")] public DateTimeOffset UpdatedAt { get; set; }
}
