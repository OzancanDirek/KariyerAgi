using System.Text.Json.Serialization;

namespace CareerPath.Api.Dtos.CustomCareer;

public class CustomCareerSkill
{
    [JsonPropertyName("name")] public string Name { get; set; } = string.Empty;
    [JsonPropertyName("reason")] public string Reason { get; set; } = string.Empty;
    [JsonPropertyName("exercise")] public string Exercise { get; set; } = string.Empty;
    [JsonPropertyName("catalogSkillId")] public Guid? CatalogSkillId { get; set; }
}
