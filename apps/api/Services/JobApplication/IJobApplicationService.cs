using CareerPath.Api.Dtos.Recruitment;

namespace CareerPath.Api.Services.JobApplication;

public interface IJobApplicationService
{
    Task<List<ApplicationResponse>> GetOwnApplicationsAsync();
    Task<List<ApplicationResponse>> GetJobApplicationsAsync(Guid jobId);
    Task<ApplicationResponse> ApplyAsync(Guid jobId, ApplicationRequest request);
    Task WithdrawAsync(Guid id);
}
