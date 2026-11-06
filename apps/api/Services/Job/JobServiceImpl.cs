using CareerPath.Api.Enums;
using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.Job;
using CareerPath.Api.Repositories.Company;
using CareerPath.Api.Security;
using CareerPath.Api.Services.HiringAccess;
using CareerPath.Api.Mappers;
using CareerPath.Api.Validation;

namespace CareerPath.Api.Services.Job;

public class JobServiceImpl : IJobService
{
    private readonly JobRepository repository;
    private readonly HiringAccessService access;
    private readonly CurrentUserContextProvider currentUser;

    public JobServiceImpl(JobRepository repository, HiringAccessService access, CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.access = access;
        this.currentUser = currentUser;
    }

    public async Task<List<JobResponse>> GetPublishedJobsAsync()
    {
        var user = await currentUser.ResolveAsync();
        var jobs = await repository.ListPublishedJobsAsync(user.AccessToken, currentUser.CancellationToken);
        return jobs.Where(job => job.ApplicationDeadline is null || job.ApplicationDeadline > DateTimeOffset.UtcNow)
            .Select(RecruitmentMapper.ToResponse).ToList();
    }

    public async Task<List<JobResponse>> GetOwnJobsAsync()
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        var companies = await access.GetAccessibleCompaniesAsync(user);
        var jobs = await repository.ListOwnedJobsAsync(companies.Select(company => company.Id).ToList(), user.AccessToken, currentUser.CancellationToken);
        return jobs.Select(RecruitmentMapper.ToResponse).ToList();
    }

    public async Task<JobResponse> GetJobAsync(Guid id)
    {
        var user = await currentUser.ResolveAsync();
        var job = await repository.GetJobAsync(id, user.AccessToken, currentUser.CancellationToken);
        return job is null ? throw new ApiException(ErrorCodes.JobNotFound) : RecruitmentMapper.ToResponse(job);
    }

    public async Task<JobResponse> CreateJobAsync(JobRequest request)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        var company = await access.GetAccessibleCompanyAsync(request.CompanyId, user);
        var values = JobValidator.Normalize(request);
        RequireApprovedCompanyForPublish(company, values.Status);
        var created = await repository.CreateJobAsync(values, user.AccessToken, currentUser.CancellationToken);
        return created is null ? throw new ApiException(ErrorCodes.JobOperationFailed) : RecruitmentMapper.ToResponse(created);
    }

    public async Task<JobResponse> UpdateJobAsync(Guid id, JobRequest request)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        var job = await access.GetAccessibleJobAsync(id, user);
        var company = await access.GetAccessibleCompanyAsync(job.CompanyId, user);
        var values = JobValidator.Normalize(request);
        RequireApprovedCompanyForPublish(company, values.Status);
        if (values.CompanyId != job.CompanyId)
        {
            throw new ApiException(ErrorCodes.Validation);
        }
        var updated = await repository.UpdateJobAsync(id, values, user.AccessToken, currentUser.CancellationToken);
        return updated is null ? throw new ApiException(ErrorCodes.JobNotFound) : RecruitmentMapper.ToResponse(updated);
    }

    public async Task ArchiveJobAsync(Guid id)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        await access.GetAccessibleJobAsync(id, user);
        if (!await repository.ArchiveJobAsync(id, user.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.JobNotFound);
        }
    }

    private static void RequireApprovedCompanyForPublish(CompanyRow company, string status)
    {
        if (JobStatusExtensions.TryFromDatabaseCode(status, out var parsed)
            && parsed == JobStatus.Yayinda
            && company.VerificationStatus != CompanyVerificationStatus.Onaylandi.ToDatabaseCode())
        {
            throw new ApiException(ErrorCodes.CompanyNotVerified);
        }
    }
}
