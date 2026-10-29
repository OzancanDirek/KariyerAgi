namespace CareerPath.Api.Dtos.Experience;

public class ExperienceRequest
{
    public string? Position { get; set; }
    public string? Company { get; set; }
    public string? EmploymentType { get; set; }
    public string? WorkModel { get; set; }
    public string? Location { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Description { get; set; }
}
