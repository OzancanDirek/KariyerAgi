using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Services.JobApplication;
using CareerPath.Api.Services.Job;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/applications")]
public class ApplicationsController : ControllerBase
{
    private readonly IJobApplicationService applications;
    private readonly JobMatchService matches;

    public ApplicationsController(IJobApplicationService applications, JobMatchService matches)
    {
        this.applications = applications;
        this.matches = matches;
    }

    [HttpGet("mine")]
    public async Task<ActionResult<List<ApplicationResponse>>> ListOwn()
    {
        return await applications.GetOwnApplicationsAsync();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApplicantDetailResponse>> GetApplicantDetail(Guid id)
    {
        Response.Headers.CacheControl = "no-store";
        return await applications.GetApplicantDetailAsync(id);
    }

    [HttpGet("{id:guid}/cv")]
    public async Task<IActionResult> DownloadApplicantCv(Guid id)
    {
        var document = await applications.DownloadApplicantCvAsync(id);
        Response.Headers.ContentDisposition = $"inline; filename=\"{System.Net.WebUtility.UrlEncode(document.FileName)}\"";
        Response.Headers.CacheControl = "no-store";
        return File(document.Bytes, document.ContentType);
    }

    [HttpGet("{id:guid}/match")]
    public async Task<ActionResult<ApplicationMatchResponse?>> GetMatch(Guid id)
    {
        return await matches.GetMatchAsync(id);
    }

    [HttpPost("{id:guid}/match")]
    public async Task<ActionResult<ApplicationMatchResponse>> EvaluateMatch(Guid id)
    {
        return await matches.EvaluateAsync(id);
    }

    [HttpPatch("{id:guid}/withdraw")]
    public async Task<IActionResult> Withdraw(Guid id)
    {
        await applications.WithdrawAsync(id);
        return NoContent();
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ApplicationResponse>> UpdateStatus(Guid id, UpdateApplicationStatusRequest request)
    {
        return await applications.UpdateStatusAsync(id, request);
    }
}
