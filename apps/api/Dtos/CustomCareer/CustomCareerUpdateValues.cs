using System.Text.Json.Serialization;

namespace CareerPath.Api.Dtos.CustomCareer;

public class CustomCareerUpdateValues
{
    [JsonPropertyName("durum")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("oneriler")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<CustomCareerSkill>? SuggestedSkills { get; set; }

    [JsonPropertyName("onaylananlar")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<CustomCareerSkill>? ConfirmedSkills { get; set; }

    [JsonPropertyName("guncelleme_tarihi")]
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
