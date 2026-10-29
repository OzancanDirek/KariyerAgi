using System.Text.Json.Serialization;

namespace CareerPath.Api.Entities;

public class Certificate
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("aday_id")] public Guid CandidateId { get; set; }
    [JsonPropertyName("ad")] public string Name { get; set; } = string.Empty;
    [JsonPropertyName("veren_kurum")] public string Issuer { get; set; } = string.Empty;
    [JsonPropertyName("verilis_tarihi")] public DateOnly? IssueDate { get; set; }
    [JsonPropertyName("gecerlilik_bitis_tarihi")] public DateOnly? ExpiryDate { get; set; }
    [JsonPropertyName("sertifika_no")] public string? CredentialId { get; set; }
    [JsonPropertyName("dogrulama_url")] public string? VerificationUrl { get; set; }
    [JsonPropertyName("belge_yolu")] public string? DocumentPath { get; set; }
    [JsonPropertyName("belge_dosya_adi")] public string? DocumentFileName { get; set; }
}
