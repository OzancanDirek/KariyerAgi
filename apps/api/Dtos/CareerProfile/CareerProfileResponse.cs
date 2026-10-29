namespace CareerPath.Api.Dtos.CareerProfile;

public class CareerProfileResponse
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Summary { get; set; }
    public string? ExperienceLevel { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? PortfolioUrl { get; set; }
    public string? TargetTitle { get; set; }
    public string? TargetIndustry { get; set; }
    public List<string> WorkModels { get; set; } = new();
    public List<string> PreferredLocations { get; set; } = new();
    public string? TargetSeniority { get; set; }
    public string? CareerNotes { get; set; }
    public string Visibility { get; set; } = "basvurulanlar";
}
