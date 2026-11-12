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
    private readonly JobMatchService matches;

    public JobsController(IJobService jobs, IJobApplicationService applications, JobMatchService matches)
    {
        this.jobs = jobs;
        this.applications = applications;
        this.matches = matches;
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

    [HttpGet("{id:guid}/match-criteria")]
    public async Task<ActionResult<MatchCriteriaResponse?>> GetMatchCriteria(Guid id)
    {
        return await matches.GetCriteriaAsync(id);
    }

    [HttpPost("{id:guid}/match-criteria/draft")]
    public async Task<ActionResult<MatchCriteriaResponse>> DraftMatchCriteria(Guid id)
    {
        return await matches.DraftCriteriaAsync(id);
    }

    [HttpPut("{id:guid}/match-criteria")]
    public async Task<ActionResult<MatchCriteriaResponse>> SaveMatchCriteria(Guid id, MatchCriteriaRequest request)
    {
        return await matches.SaveCriteriaAsync(id, request);
    }

    [HttpGet("{id:guid}/matches")]
    public async Task<ActionResult<List<ApplicationMatchResponse>>> ListMatches(Guid id)
    {
        return await matches.ListMatchesAsync(id);
    }

    [HttpPost("{id:guid}/applications")]
    public async Task<ActionResult<ApplicationResponse>> Apply(Guid id, ApplicationRequest request)
    {
        return StatusCode(201, await applications.ApplyAsync(id, request));
    }
}
