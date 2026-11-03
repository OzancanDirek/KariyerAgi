using CareerPath.Api.Dtos.CvDraft;
using CareerPath.Api.Services.CvDraft;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/cv-drafts")]
public class CvDraftsController : ControllerBase
{
    private readonly ICvDraftService drafts;

    public CvDraftsController(ICvDraftService drafts)
    {
        this.drafts = drafts;
    }

    [HttpGet]
    public async Task<ActionResult<List<CvDraftResponse>>> List()
    {
        return await drafts.GetDraftsAsync();
    }

    [HttpPost]
    public async Task<ActionResult<CvDraftResponse>> Create(CvDraftRequest request)
    {
        var created = await drafts.CreateDraftAsync(request);
        return StatusCode(201, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CvDraftResponse>> Update(Guid id, CvDraftRequest request)
    {
        return await drafts.UpdateDraftAsync(id, request);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await drafts.DeleteDraftAsync(id);
        return NoContent();
    }
}
