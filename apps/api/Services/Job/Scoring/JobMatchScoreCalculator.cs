using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Enums;

namespace CareerPath.Api.Services.Job.Scoring;

public static class JobMatchScoreCalculator
{
    public static int Calculate(IReadOnlyList<MatchEvidence> evidence)
    {
        var weighted = evidence.Sum(item => item.Weight * (item.Verdict switch
        {
            MatchVerdictStatus.Matched => 1.0,
            MatchVerdictStatus.Partial => 0.5,
            _ => 0.0
        }));
        return (int)Math.Round(weighted, MidpointRounding.AwayFromZero);
    }
}
