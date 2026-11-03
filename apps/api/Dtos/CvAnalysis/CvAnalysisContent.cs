namespace CareerPath.Api.Dtos.CvAnalysis;

public class CvAnalysisContent
{
    public string Summary { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = [];
    public string EducationSummary { get; set; } = string.Empty;
    public string ExperienceSummary { get; set; } = string.Empty;
    public List<string> Strengths { get; set; } = [];
    public List<string> Suggestions { get; set; } = [];
    public CvContentEvidence? ContentEvidence { get; set; }
}

public class CvContentEvidence
{
    public bool HasMeasurableImpact { get; set; }
    public bool HasProjectDetails { get; set; }
    public bool HasActionOrientedDescriptions { get; set; }
}
