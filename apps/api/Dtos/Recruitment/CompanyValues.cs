using System.Text.Json.Serialization;

namespace CareerPath.Api.Dtos.Recruitment;

public class CompanyValues
{
    [JsonPropertyName("sahip_kullanici_id")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Guid? OwnerId { get; set; }

    [JsonPropertyName("ad")] public string Name { get; set; } = string.Empty;
    [JsonPropertyName("aciklama")] public string? Description { get; set; }
    [JsonPropertyName("sektor")] public string? Sector { get; set; }
    [JsonPropertyName("konum")] public string? Location { get; set; }
    [JsonPropertyName("web_sitesi")] public string? Website { get; set; }
}
