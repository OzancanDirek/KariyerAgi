using CareerPath.Api.Dtos.CvAnalysis;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Infrastructure.Gemini;
using CareerPath.Api.Infrastructure.Supabase;
using CareerPath.Api.Repositories.Cv;
using CareerPath.Api.Repositories.CvAnalysis;
using CareerPath.Api.Security;

namespace CareerPath.Api.Services.CvAnalysis;

public class CvAnalysisServiceImpl : ICvAnalysisService
{
    private const string Bucket = "cv-dosyalari";
    private readonly CvRepository cvRepository;
    private readonly CvAnalysisRepository analysisRepository;
    private readonly CurrentUserContextProvider currentUser;
    private readonly SupabasePrivateStorageClient storage;
    private readonly GeminiCvAnalyzer analyzer;

    public CvAnalysisServiceImpl(CvRepository cvRepository, CvAnalysisRepository analysisRepository, CurrentUserContextProvider currentUser, SupabasePrivateStorageClient storage, GeminiCvAnalyzer analyzer)
    {
        this.cvRepository = cvRepository;
        this.analysisRepository = analysisRepository;
        this.currentUser = currentUser;
        this.storage = storage;
        this.analyzer = analyzer;
    }

    public async Task<CvAnalysisResponse?> GetLatestAnalysisAsync(Guid cvFileId)
    {
        var identity = await currentUser.ResolveAsync();
        await GetOwnedCvAsync(identity.UserId, cvFileId, identity.AccessToken, currentUser.CancellationToken);
        return await analysisRepository.GetLatestAsync(identity.UserId, cvFileId, identity.AccessToken, currentUser.CancellationToken);
    }

    public async Task<CvAnalysisQuotaResponse> GetAnalysisQuotaAsync()
    {
        var identity = await currentUser.ResolveAsync();
        return await analysisRepository.GetQuotaAsync(identity.AccessToken, currentUser.CancellationToken);
    }

    public async Task<CvAnalysisResponse> AnalyzeCvAsync(Guid cvFileId)
    {
        var identity = await currentUser.ResolveAsync();
        var cv = await GetOwnedCvAsync(identity.UserId, cvFileId, identity.AccessToken, currentUser.CancellationToken);
        var (bytes, _) = await storage.DownloadAsync(Bucket, cv.StoragePath, identity.AccessToken, currentUser.CancellationToken);
        analyzer.EnsureConfigured();
        var quotaRequestId = await analysisRepository.ReserveAnalysisAsync(identity.AccessToken, currentUser.CancellationToken);
        if (quotaRequestId is null)
        {
            throw new ApiException(ErrorCodes.CvDailyLimitReached);
        }
        var result = await analyzer.AnalyzeAsync(bytes, cv.ContentType, currentUser.CancellationToken);
        var created = await analysisRepository.CreateAsync(identity.UserId, cvFileId, quotaRequestId.Value, GeminiCvAnalyzer.Model, result, identity.AccessToken, currentUser.CancellationToken);
        if (created is null)
        {
            throw new ApiException(ErrorCodes.CvAnalysisFailed);
        }
        return created;
    }

    private async Task<CareerPath.Api.Entities.CvFile> GetOwnedCvAsync(Guid candidateId, Guid cvFileId, string token, CancellationToken cancellationToken)
    {
        var cv = await cvRepository.GetAsync(candidateId, cvFileId, token, cancellationToken);
        if (cv is null)
        {
            throw new ApiException(ErrorCodes.CvNotFound);
        }
        return cv;
    }
}
