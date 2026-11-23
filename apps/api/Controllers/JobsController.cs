using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Services.Job;
using CareerPath.Api.Services.JobApplication;
using CareerPath.Api.Security;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController : ControllerBase
{
    private readonly IJobService jobs;
    private readonly IJobApplicationService applications;
    private readonly JobMatchService matches;
    private readonly ExternalJobSearchService externalJobs;
    private readonly CurrentUserContextProvider currentUser;

    public JobsController(IJobService jobs, IJobApplicationService applications, JobMatchService matches, ExternalJobSearchService externalJobs, CurrentUserContextProvider currentUser)
    {
        this.jobs = jobs;
        this.applications = applications;
        this.matches = matches;
        this.externalJobs = externalJobs;
        this.currentUser = currentUser;
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

    [HttpGet("external")]
    public async Task<ActionResult<ExternalJobSearchResponse>> SearchExternal([FromQuery] string? keywords, [FromQuery] string? location, [FromQuery] int page = 1, CancellationToken cancellationToken = default)
    {
        if (!externalJobs.IsConfigured) return StatusCode(503, new { code = "EXT-001", message = "Dış ilan araması henüz etkin değil." });
        if (string.IsNullOrWhiteSpace(keywords) || keywords.Trim().Length is < 2 or > 100 || location?.Length > 100 || page is < 1 or > 10)
            return BadRequest(new { code = "VAL-001", message = "Arama terimi, konum veya sayfa geçersiz." });
        await currentUser.ResolveAsync();
        var forwardedIp = Environment.GetEnvironmentVariable("RENDER") == "true"
            ? Request.Headers["X-Forwarded-For"].ToString().Split(',')[0].Trim() : null;
        var ip = System.Net.IPAddress.TryParse(forwardedIp, out var clientIp)
            ? clientIp.ToString() : HttpContext.Connection.RemoteIpAddress?.ToString();
        var agent = Request.Headers.UserAgent.ToString();
        if (string.IsNullOrWhiteSpace(ip) || string.IsNullOrWhiteSpace(agent))
            return BadRequest(new { code = "VAL-001", message = "Arama için istemci bilgileri eksik." });
        try
        {
            return await externalJobs.SearchAsync(keywords.Trim(), location?.Trim(), page, ip, agent, cancellationToken);
        }
        catch (HttpRequestException)
        {
            return StatusCode(502, new { code = "EXT-002", message = "Dış ilan kaynağına ulaşılamadı." });
        }
        catch (TaskCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            return StatusCode(504, new { code = "EXT-002", message = "Dış ilan araması zaman aşımına uğradı." });
        }
        catch (System.Text.Json.JsonException)
        {
            return StatusCode(502, new { code = "EXT-002", message = "Dış ilan kaynağı geçersiz yanıt verdi." });
        }
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
