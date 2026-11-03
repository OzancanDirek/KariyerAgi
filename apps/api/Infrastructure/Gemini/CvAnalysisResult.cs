using CareerPath.Api.Dtos.CvAnalysis;
using CareerPath.Api.Services.CvAnalysis.Scoring;

namespace CareerPath.Api.Infrastructure.Gemini;

public class CvAnalysisResult
{
    public required CvAnalysisContent Content { get; init; }
    public required CvScoreReport Scores { get; init; }
    public int InputTokens { get; init; }
    public int OutputTokens { get; init; }
    public int TotalTokens { get; init; }
    public int ImageTokens { get; init; }
    public required string InputMethod { get; init; }
}
