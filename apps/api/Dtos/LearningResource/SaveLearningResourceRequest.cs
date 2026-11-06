namespace CareerPath.Api.Dtos.LearningResource;

public class SaveLearningResourceRequest
{
    public Guid SkillId { get; set; }
    public string? Title { get; set; }
    public string? Url { get; set; }
    public string? Provider { get; set; }
    public string? Type { get; set; }
    public string? Language { get; set; }
    public string? Level { get; set; }
    public bool Paid { get; set; }
    public bool Active { get; set; } = true;
}
