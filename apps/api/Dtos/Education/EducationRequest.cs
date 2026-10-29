namespace CareerPath.Api.Dtos.Education;

public class EducationRequest
{
    public string? Institution { get; set; }
    public string? Degree { get; set; }
    public string? FieldOfStudy { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal? GradeAverage { get; set; }
    public short? GradeScale { get; set; }
    public string? Description { get; set; }
}
