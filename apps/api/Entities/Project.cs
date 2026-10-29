using System.Text.Json.Serialization;

namespace CareerPath.Api.Entities;

public class Project
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("aday_id")] public Guid CandidateId { get; set; }
    [JsonPropertyName("ad")] public string Name { get; set; } = string.Empty;
    [JsonPropertyName("aciklama")] public string? Description { get; set; }
    [JsonPropertyName("rol")] public string? Role { get; set; }
    [JsonPropertyName("teknolojiler")] public List<string> Technologies { get; set; } = new();
    [JsonPropertyName("proje_url")] public string? ProjectUrl { get; set; }
    [JsonPropertyName("kod_url")] public string? CodeUrl { get; set; }
    [JsonPropertyName("baslangic_tarihi")] public DateOnly? StartDate { get; set; }
    [JsonPropertyName("bitis_tarihi")] public DateOnly? EndDate { get; set; }
}
