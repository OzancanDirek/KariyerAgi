namespace CareerPath.Api.Dtos.LearningResource;

public class LearningResourceResponse
{
    public Guid Id { get; set; }
    public Guid SkillId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public bool Paid { get; set; }
    public bool Active { get; set; }
    public DateOnly? CheckedOn { get; set; }
}
