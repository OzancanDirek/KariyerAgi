namespace CareerPath.Api.Dtos.Roadmap;

public class RoadmapRoleResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class RoadmapSkillResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool Required { get; set; }
    public bool Selected { get; set; }
    public bool SuggestedFromCv { get; set; }
}

public class RoadmapResponse
{
    public string? TargetTitle { get; set; }
    public List<RoadmapRoleResponse> Roles { get; set; } = new();
    public Guid? RoleId { get; set; }
    public List<RoadmapSkillResponse> Skills { get; set; } = new();
}
