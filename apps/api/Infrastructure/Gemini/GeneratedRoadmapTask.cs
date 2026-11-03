namespace CareerPath.Api.Infrastructure.Gemini;

public class GeneratedRoadmapPlan
{
    public List<GeneratedRoadmapTask> Tasks { get; set; } = new();
}

public class GeneratedRoadmapTask
{
    public Guid SkillId { get; set; }
    public int Week { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int EstimatedHours { get; set; }
    public string Priority { get; set; } = string.Empty;
}
