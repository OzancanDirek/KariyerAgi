using System.Text.Json.Serialization;

namespace CareerPath.Api.Entities;

public class CandidateProfile
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("unvan")]
    public string? Title { get; set; }

    [JsonPropertyName("ozet")]
    public string? Summary { get; set; }

    [JsonPropertyName("deneyim_seviyesi")]
    public string? ExperienceLevel { get; set; }

    [JsonPropertyName("linkedin_url")]
    public string? LinkedInUrl { get; set; }

    [JsonPropertyName("github_url")]
    public string? GitHubUrl { get; set; }

    [JsonPropertyName("portfolyo_url")]
    public string? PortfolioUrl { get; set; }

    [JsonPropertyName("hedef_unvan")]
    public string? TargetTitle { get; set; }

    [JsonPropertyName("hedef_sektor")]
    public string? TargetIndustry { get; set; }

    [JsonPropertyName("calisma_modelleri")]
    public List<string> WorkModels { get; set; } = new();

    [JsonPropertyName("tercih_edilen_konumlar")]
    public List<string> PreferredLocations { get; set; } = new();

    [JsonPropertyName("hedef_kidem")]
    public string? TargetSeniority { get; set; }

    [JsonPropertyName("kariyer_notlari")]
    public string? CareerNotes { get; set; }

    [JsonPropertyName("profil_gorunurlugu")]
    public string Visibility { get; set; } = "basvurulanlar";
}
