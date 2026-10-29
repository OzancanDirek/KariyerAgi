namespace CareerPath.Api.Dtos.Project;

public class ProjectRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Role { get; set; }
    public List<string>? Technologies { get; set; }
    public string? ProjectUrl { get; set; }
    public string? CodeUrl { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}
