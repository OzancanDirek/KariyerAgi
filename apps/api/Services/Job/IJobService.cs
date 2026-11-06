using CareerPath.Api.Dtos.Recruitment;

namespace CareerPath.Api.Services.Job;

public interface IJobService
{
Task<List<JobResponse>> GetPublishedJobsAsync();
    Task<List<JobResponse>> GetOwnJobsAsync();
    Task<JobResponse> GetJobAsync(Guid id);
    Task<JobResponse> CreateJobAsync(JobRequest request);
    Task<JobResponse> UpdateJobAsync(Guid id, JobRequest request);
    Task ArchiveJobAsync(Guid id);
}
