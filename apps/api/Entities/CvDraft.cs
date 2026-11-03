using System.Text.Json;
using System.Text.Json.Serialization;

namespace CareerPath.Api.Entities;

public class CvDraft
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("aday_id")] public Guid CandidateId { get; set; }
    [JsonPropertyName("ad")] public string Name { get; set; } = string.Empty;
    [JsonPropertyName("sablon")] public string Template { get; set; } = string.Empty;
    [JsonPropertyName("icerik")] public JsonElement Content { get; set; }
    [JsonPropertyName("guncelleme_tarihi")] public DateTimeOffset UpdatedAt { get; set; }
}
