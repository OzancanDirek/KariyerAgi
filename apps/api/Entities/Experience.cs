using System.Text.Json.Serialization;

namespace CareerPath.Api.Entities;

public class Experience
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("aday_id")] public Guid CandidateId { get; set; }
    [JsonPropertyName("pozisyon")] public string Position { get; set; } = string.Empty;
    [JsonPropertyName("sirket_adi")] public string Company { get; set; } = string.Empty;
    [JsonPropertyName("calisma_tipi")] public string? EmploymentType { get; set; }
    [JsonPropertyName("calisma_modeli")] public string? WorkModel { get; set; }
    [JsonPropertyName("konum")] public string? Location { get; set; }
    [JsonPropertyName("baslangic_tarihi")] public DateOnly StartDate { get; set; }
    [JsonPropertyName("bitis_tarihi")] public DateOnly? EndDate { get; set; }
    [JsonPropertyName("aciklama")] public string? Description { get; set; }
}
