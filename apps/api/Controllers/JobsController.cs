using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Services.Job;
using CareerPath.Api.Services.JobApplication;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController : ControllerBase
{
    private readonly IJobService jobs;
    private readonly IJobApplicationService applications;

    public JobsController(IJobService jobs, IJobApplicationService applications)
    {
        this.jobs = jobs;
        this.applications = applications;
    }

    [HttpGet]
    public async Task<ActionResult<List<JobResponse>>> ListPublished()
    {
        return await jobs.GetPublishedJobsAsync();
    }

    [HttpGet("mine")]
    public async Task<ActionResult<List<JobResponse>>> ListOwn()
    {
        return await jobs.GetOwnJobsAsync();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<JobResponse>> Get(Guid id)
    {
        return await jobs.GetJobAsync(id);
    }

    [HttpPost]
    public async Task<ActionResult<JobResponse>> Create(JobRequest request)
    {
        return StatusCode(201, await jobs.CreateJobAsync(request));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<JobResponse>> Update(Guid id, JobRequest request)
    {
        return await jobs.UpdateJobAsync(id, request);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Archive(Guid id)
    {
        await jobs.ArchiveJobAsync(id);
        return NoContent();
    }

    [HttpGet("{id:guid}/applications")]
    public async Task<ActionResult<List<ApplicationResponse>>> ListApplications(Guid id)
    {
        return await applications.GetJobApplicationsAsync(id);
    }

    [HttpPost("{id:guid}/applications")]
    public async Task<ActionResult<ApplicationResponse>> Apply(Guid id, ApplicationRequest request)
    {
        return StatusCode(201, await applications.ApplyAsync(id, request));
    }
}
