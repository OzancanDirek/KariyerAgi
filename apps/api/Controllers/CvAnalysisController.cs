using CareerPath.Api.Dtos.CvAnalysis;
using CareerPath.Api.Services.CvAnalysis;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/cv/{cvFileId:guid}/analysis")]
public class CvAnalysisController : ControllerBase
{
    private readonly ICvAnalysisService analysis;

    public CvAnalysisController(ICvAnalysisService analysis)
    {
        this.analysis = analysis;
    }

    [HttpGet]
    public async Task<ActionResult<CvAnalysisResponse>> GetLatest(Guid cvFileId)
    {
        var result = await analysis.GetLatestAnalysisAsync(cvFileId);
        if (result is null)
        {
            return NoContent();
        }
        return result;
    }

    [HttpGet("~/api/cv/analysis/quota")]
    public async Task<ActionResult<CvAnalysisQuotaResponse>> GetQuota()
    {
        return await analysis.GetAnalysisQuotaAsync();
    }

    [HttpPost]
    public async Task<ActionResult<CvAnalysisResponse>> Analyze(Guid cvFileId)
    {
        var created = await analysis.AnalyzeCvAsync(cvFileId);
        return StatusCode(201, created);
    }
}
