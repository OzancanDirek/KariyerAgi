using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Dtos.Cv;

namespace CareerPath.Api.Services.JobApplication;

public interface IJobApplicationService
{
    Task<List<ApplicationResponse>> GetOwnApplicationsAsync();
    Task<List<ApplicationResponse>> GetJobApplicationsAsync(Guid jobId);
    Task<ApplicantDetailResponse> GetApplicantDetailAsync(Guid id);
    Task<CvDocument> DownloadApplicantCvAsync(Guid id);
    Task<ApplicationResponse> ApplyAsync(Guid jobId, ApplicationRequest request);
    Task WithdrawAsync(Guid id);
    Task<ApplicationResponse> UpdateStatusAsync(Guid id, UpdateApplicationStatusRequest request);
}
