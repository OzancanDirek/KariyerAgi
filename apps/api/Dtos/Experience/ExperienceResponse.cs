namespace CareerPath.Api.Dtos.Experience;

public class ExperienceResponse
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    public string Position { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string? EmploymentType { get; set; }
    public string? WorkModel { get; set; }
    public string? Location { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Description { get; set; }
}
