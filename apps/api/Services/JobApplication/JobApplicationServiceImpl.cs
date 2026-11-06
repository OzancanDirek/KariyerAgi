using CareerPath.Api.Enums;
using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Mappers;
using CareerPath.Api.Repositories.JobApplication;
using CareerPath.Api.Repositories.Job;
using CareerPath.Api.Repositories.Cv;
using CareerPath.Api.Security;
using CareerPath.Api.Services.HiringAccess;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Services.JobApplication;

public class JobApplicationServiceImpl : IJobApplicationService
{
    private readonly JobApplicationRepository repository;
    private readonly JobRepository jobs;
    private readonly CvRepository cvs;
    private readonly HiringAccessService access;
    private readonly CurrentUserContextProvider currentUser;

    public JobApplicationServiceImpl(JobApplicationRepository repository, JobRepository jobs, CvRepository cvs, HiringAccessService access, CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.jobs = jobs;
        this.cvs = cvs;
        this.access = access;
        this.currentUser = currentUser;
    }

    public async Task<List<ApplicationResponse>> GetOwnApplicationsAsync()
    {
        var user = await access.RequireRoleAsync(AccountRole.Aday);
        var rows = await repository.ListCandidateApplicationsAsync(user.UserId, user.AccessToken, currentUser.CancellationToken);
        return rows.Select(RecruitmentMapper.ToResponse).ToList();
    }

    public async Task<List<ApplicationResponse>> GetJobApplicationsAsync(Guid jobId)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        await access.GetAccessibleJobAsync(jobId, user);
        var rows = await repository.ListJobApplicationsAsync(jobId, user.AccessToken, currentUser.CancellationToken);
        return rows.Select(RecruitmentMapper.ToResponse).ToList();
    }

    public async Task<ApplicationResponse> ApplyAsync(Guid jobId, ApplicationRequest request)
    {
        var user = await access.RequireRoleAsync(AccountRole.Aday);
        var job = await jobs.GetJobAsync(jobId, user.AccessToken, currentUser.CancellationToken);

        if (job is null || job.Status != JobStatus.Yayinda.ToDatabaseCode() || (job.ApplicationDeadline.HasValue && job.ApplicationDeadline.Value <= DateTimeOffset.UtcNow))
        {
            throw new ApiException(ErrorCodes.JobNotAcceptingApplications);
        }

        if (request.CvFileId.HasValue && await cvs.GetAsync(user.UserId, request.CvFileId.Value, user.AccessToken, currentUser.CancellationToken) is null)
        {
            throw new ApiException(ErrorCodes.CvNotFound);
        }

        var coverLetter = StringUtils.TrimToNull(request.CoverLetter);

        if (coverLetter?.Length > 3000)
        {
            throw new ApiException(ErrorCodes.Validation);
        }

        if (await repository.HasActiveApplicationAsync(jobId, user.UserId, user.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.ApplicationAlreadyExists);
        }

        var created = await repository.CreateApplicationAsync(jobId, user.UserId, request.CvFileId, coverLetter, user.AccessToken, currentUser.CancellationToken);
        return created is null ? throw new ApiException(ErrorCodes.ApplicationOperationFailed) : RecruitmentMapper.ToResponse(created);
    }

    public async Task WithdrawAsync(Guid id)
    {
        var user = await access.RequireRoleAsync(AccountRole.Aday);
        if (!await repository.WithdrawApplicationAsync(id, user.UserId, user.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.ApplicationNotFound);
        }
    }

}
