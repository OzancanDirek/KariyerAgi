namespace CareerPath.Api.Dtos.CustomCareer;

public class CustomCareerResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<CustomCareerSkill> SuggestedSkills { get; set; } = new();
    public List<CustomCareerSkill> ConfirmedSkills { get; set; } = new();
}

public class CreateCustomCareerRequest
{
    public string? Title { get; set; }
}

public class ConfirmCustomCareerRequest
{
    public List<int> SelectedIndexes { get; set; } = new();
}
