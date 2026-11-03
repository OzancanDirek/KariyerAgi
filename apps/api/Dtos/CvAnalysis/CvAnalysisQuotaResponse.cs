namespace CareerPath.Api.Dtos.CvAnalysis;

public class CvAnalysisQuotaResponse
{
    public int DailyLimit { get; set; }
    public int Used { get; set; }
    public int Remaining { get; set; }
    public DateTimeOffset ResetsAt { get; set; }
}
