using System.Text.Json.Serialization;

namespace CareerPath.Api.Entities;

public class ConsentText
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("baslik")] public string Title { get; set; } = string.Empty;
    [JsonPropertyName("icerik")] public string Content { get; set; } = string.Empty;
    [JsonPropertyName("surum")] public int Version { get; set; }
}
