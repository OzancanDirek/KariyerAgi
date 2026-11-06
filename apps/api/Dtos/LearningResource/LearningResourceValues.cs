using System.Text.Json.Serialization;

namespace CareerPath.Api.Dtos.LearningResource;

public class LearningResourceValues
{
    [JsonPropertyName("beceri_id")] public Guid SkillId { get; set; }
    [JsonPropertyName("baslik")] public string Title { get; set; } = string.Empty;
    [JsonPropertyName("url")] public string Url { get; set; } = string.Empty;
    [JsonPropertyName("saglayici")] public string Provider { get; set; } = string.Empty;
    [JsonPropertyName("tur")] public string Type { get; set; } = string.Empty;
    [JsonPropertyName("dil")] public string Language { get; set; } = string.Empty;
    [JsonPropertyName("seviye")] public string Level { get; set; } = string.Empty;
    [JsonPropertyName("ucretli_mi")] public bool Paid { get; set; }
    [JsonPropertyName("aktif_mi")] public bool Active { get; set; }
    [JsonPropertyName("son_kontrol_tarihi")] public DateOnly CheckedOn { get; set; }
}
