namespace CareerPath.Api.Dtos.Skill;

public class SkillCategoryResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class SkillResponse
{
    public Guid Id { get; set; }
    public Guid? CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool Selected { get; set; }
    public bool SuggestedFromCv { get; set; }
    public bool Custom { get; set; }
    public Guid? SelectionId { get; set; }
}

public class SkillRelationResponse
{
    public Guid SourceSkillId { get; set; }
    public Guid TargetSkillId { get; set; }
    public string Type { get; set; } = string.Empty;
}

public class SkillMapResponse
{
    public List<SkillCategoryResponse> Categories { get; set; } = new();
    public List<SkillResponse> Skills { get; set; } = new();
    public List<SkillRelationResponse> Relations { get; set; } = new();
    public List<string> UnmatchedCvSkills { get; set; } = new();
}

public class SelectSkillRequest
{
    public Guid SkillId { get; set; }
}

public class CustomSkillRequest
{
    public string? Name { get; set; }
}

public class DismissSkillRequest
{
    public Guid? SkillId { get; set; }
    public string? Name { get; set; }
}
