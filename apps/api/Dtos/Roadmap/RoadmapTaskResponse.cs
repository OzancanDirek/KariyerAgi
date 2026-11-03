using System.Text.Json.Serialization;

namespace CareerPath.Api.Dtos.Roadmap;

public class RoadmapTaskResponse
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("skillId")] public Guid SkillId { get; set; }
    [JsonPropertyName("skillName")] public string SkillName { get; set; } = string.Empty;
    [JsonPropertyName("week")] public int Week { get; set; }
    [JsonPropertyName("dueDate")] public DateOnly DueDate { get; set; }
    [JsonPropertyName("title")] public string Title { get; set; } = string.Empty;
    [JsonPropertyName("description")] public string Description { get; set; } = string.Empty;
    [JsonPropertyName("type")] public string Type { get; set; } = string.Empty;
    [JsonPropertyName("priority")] public string Priority { get; set; } = string.Empty;
    [JsonPropertyName("estimatedHours")] public int EstimatedHours { get; set; }
    [JsonPropertyName("completed")] public bool Completed { get; set; }
}
