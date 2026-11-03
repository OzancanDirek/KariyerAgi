using CareerPath.Api.Dtos.CvAnalysis;

namespace CareerPath.Api.Services.CvAnalysis;

public interface ICvAnalysisService
{
    Task<CvAnalysisResponse?> GetLatestAnalysisAsync(Guid cvFileId);
    Task<CvAnalysisQuotaResponse> GetAnalysisQuotaAsync();
    Task<CvAnalysisResponse> AnalyzeCvAsync(Guid cvFileId);
}
