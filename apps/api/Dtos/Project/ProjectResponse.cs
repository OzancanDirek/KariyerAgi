namespace CareerPath.Api.Dtos.Project;

public class ProjectResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Role { get; set; }
    public List<string> Technologies { get; set; } = new();
    public string? ProjectUrl { get; set; }
    public string? CodeUrl { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}
