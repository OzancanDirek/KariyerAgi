namespace CareerPath.Api.Dtos.Education;

public class EducationResponse
{
    public Guid Id { get; set; }
    public Guid CandidateId { get; set; }
    public string Institution { get; set; } = string.Empty;
    public string? Degree { get; set; }
    public string? FieldOfStudy { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal? GradeAverage { get; set; }
    public short? GradeScale { get; set; }
    public string? Description { get; set; }
}
