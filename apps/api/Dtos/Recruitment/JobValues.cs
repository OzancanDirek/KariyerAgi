using System.Text.Json.Serialization;

namespace CareerPath.Api.Dtos.Recruitment;

public class JobValues
{
    [JsonPropertyName("sirket_id")] public Guid CompanyId { get; set; }
    [JsonPropertyName("baslik")] public string Title { get; set; } = string.Empty;
    [JsonPropertyName("aciklama")] public string Description { get; set; } = string.Empty;
    [JsonPropertyName("konum")] public string? Location { get; set; }
    [JsonPropertyName("calisma_modeli")] public string WorkModel { get; set; } = string.Empty;
    [JsonPropertyName("istihdam_turu")] public string EmploymentType { get; set; } = string.Empty;
    [JsonPropertyName("durum")] public string Status { get; set; } = string.Empty;
    [JsonPropertyName("son_basvuru_tarihi")] public DateTimeOffset? ApplicationDeadline { get; set; }
}
