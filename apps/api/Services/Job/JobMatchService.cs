using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Enums;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Infrastructure.Gemini;
using CareerPath.Api.Infrastructure.Supabase;
using CareerPath.Api.Repositories;
using CareerPath.Api.Repositories.JobApplication;
using CareerPath.Api.Security;
using CareerPath.Api.Services.HiringAccess;
using CareerPath.Api.Services.Job.Scoring;

namespace CareerPath.Api.Services.Job;

public class JobMatchService
{
    private readonly HiringAccessService access;
    private readonly JobMatchRepository repository;
    private readonly JobApplicationRepository applications;
    private readonly GeminiJobMatcher gemini;
    private readonly SupabasePrivateStorageClient storage;
    private readonly CurrentUserContextProvider currentUser;

    public JobMatchService(HiringAccessService access, JobMatchRepository repository, JobApplicationRepository applications,
        GeminiJobMatcher gemini, SupabasePrivateStorageClient storage, CurrentUserContextProvider currentUser)
    {
        this.access = access;
        this.repository = repository;
        this.applications = applications;
        this.gemini = gemini;
        this.storage = storage;
        this.currentUser = currentUser;
    }

    public async Task<MatchCriteriaResponse?> GetCriteriaAsync(Guid jobId)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        await access.GetAccessibleJobAsync(jobId, user);
        var row = await repository.GetCriteriaAsync(jobId, user.AccessToken, currentUser.CancellationToken);
        return row is null ? null : ToResponse(row);
    }

    public async Task<MatchCriteriaResponse> DraftCriteriaAsync(Guid jobId)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        var job = await access.GetAccessibleJobAsync(jobId, user);
        var criteria = await gemini.DraftAsync(job.Title, job.Description, currentUser.CancellationToken);
        Validate(criteria);
        return new MatchCriteriaResponse { JobId = jobId, Version = 0, Criteria = criteria };
    }

    public async Task<MatchCriteriaResponse> SaveCriteriaAsync(Guid jobId, MatchCriteriaRequest request)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        await access.GetAccessibleJobAsync(jobId, user);
        Validate(request.Criteria);
        var row = await repository.SaveCriteriaAsync(jobId, request.Criteria, user.AccessToken, currentUser.CancellationToken);
        return row is null ? throw new ApiException(ErrorCodes.JobMatchFailed) : ToResponse(row);
    }

    public async Task<ApplicationMatchResponse?> GetMatchAsync(Guid applicationId)
    {
        var (user, detail) = await GetApplicantAsync(applicationId);
        var criteria = await repository.GetCriteriaAsync(detail.JobId, user.AccessToken, currentUser.CancellationToken);
        if (criteria is null)
        {
            return null;
        }
        var row = await repository.GetMatchAsync(applicationId, user.AccessToken, currentUser.CancellationToken);
        return row is null || row.CriteriaVersion != criteria.Version ? null : ToResponse(row);
    }

    public async Task<List<ApplicationMatchResponse>> ListMatchesAsync(Guid jobId)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        await access.GetAccessibleJobAsync(jobId, user);
        var criteria = await repository.GetCriteriaAsync(jobId, user.AccessToken, currentUser.CancellationToken);
        if (criteria is null)
        {
            return [];
        }
        var rows = await repository.ListMatchesAsync(jobId, user.AccessToken, currentUser.CancellationToken);
        return rows.Where(row => row.CriteriaVersion == criteria.Version).Select(ToResponse).ToList();
    }

    public async Task<ApplicationMatchResponse> EvaluateAsync(Guid applicationId)
    {
        var (user, detail) = await GetApplicantAsync(applicationId);
        if (detail.Status == "geri_cekildi" || string.IsNullOrWhiteSpace(detail.CvStoragePath) || detail.CvContentType != "application/pdf")
        {
            throw new ApiException(ErrorCodes.JobMatchNoCv);
        }
        var criteria = await repository.GetCriteriaAsync(detail.JobId, user.AccessToken, currentUser.CancellationToken);
        if (criteria is null)
        {
            throw new ApiException(ErrorCodes.JobMatchNoCriteria);
        }
        var existing = await repository.GetMatchAsync(applicationId, user.AccessToken, currentUser.CancellationToken);
        if (existing is not null && existing.CriteriaVersion == criteria.Version)
        {
            return ToResponse(existing);
        }
        var cvFile = await storage.DownloadAsync("cv-dosyalari", detail.CvStoragePath, user.AccessToken, currentUser.CancellationToken);
        var verdicts = await gemini.EvaluateAsync(criteria.Criteria, cvFile.Bytes, currentUser.CancellationToken);
        if (verdicts.Count != criteria.Criteria.Count)
        {
            throw new ApiException(ErrorCodes.JobMatchFailed);
        }
        var evidence = criteria.Criteria.Select((criterion, index) => new MatchEvidence
        {
            Title = criterion.Title,
            Weight = criterion.Weight,
            Required = criterion.Required,
            Verdict = verdicts[index].Verdict,
            Evidence = LimitEvidence(verdicts[index].Evidence)
        }).ToList();
        if (evidence.All(item => item.Verdict == MatchVerdictStatus.CannotDetermine))
        {
            throw new ApiException(ErrorCodes.JobMatchNoCv);
        }
        var score = JobMatchScoreCalculator.Calculate(evidence);
        var saved = await repository.SaveMatchAsync(applicationId, criteria.Version, score, evidence, currentUser.CancellationToken);
        return saved is null ? throw new ApiException(ErrorCodes.JobMatchFailed) : ToResponse(saved);
    }

    private async Task<(CurrentUserContext User, ApplicantDetailRow Detail)> GetApplicantAsync(Guid id)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        var detail = await applications.GetApplicantDetailAsync(id, user.AccessToken, currentUser.CancellationToken);
        if (detail is null)
        {
            throw new ApiException(ErrorCodes.ApplicationNotFound);
        }
        await access.GetAccessibleJobAsync(detail.JobId, user);
        return (user, detail);
    }

    private static void Validate(List<MatchCriterion>? criteria)
    {
        if (criteria is null || criteria.Count is < 4 or > 8 || criteria.Sum(item => item.Weight) != 100
            || criteria.Any(item => string.IsNullOrWhiteSpace(item.Title) || item.Title.Length > 100
                || string.IsNullOrWhiteSpace(item.Description) || item.Description.Length > 500 || item.Weight is < 1 or > 100))
        {
            throw new ApiException(ErrorCodes.JobMatchCriteriaInvalid);
        }
    }

    private static string? LimitEvidence(string? value)
    {
        var text = value?.Trim();
        if (string.IsNullOrWhiteSpace(text))
        {
            return null;
        }
        return text[..Math.Min(text.Length, 500)];
    }

    private static MatchCriteriaResponse ToResponse(MatchCriteriaRow row)
    {
        return new MatchCriteriaResponse { JobId = row.JobId, Version = row.Version, Criteria = row.Criteria };
    }

    private static ApplicationMatchResponse ToResponse(ApplicationMatchRow row)
    {
        return new ApplicationMatchResponse { ApplicationId = row.ApplicationId, JobId = row.JobId, CriteriaVersion = row.CriteriaVersion,
            Score = row.Score, Evidence = row.Evidence, CreatedAt = row.CreatedAt };
    }
}
