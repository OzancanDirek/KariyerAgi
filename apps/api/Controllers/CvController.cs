using CareerPath.Api.Dtos.Cv;
using CareerPath.Api.Services.Cv;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/cv")]
public class CvController : ControllerBase
{
    private readonly ICvService cv;

    public CvController(ICvService cv)
    {
        this.cv = cv;
    }

    [HttpGet]
    public async Task<ActionResult<List<CvFileResponse>>> List()
    {
        return await cv.GetMyCvsAsync();
    }

    [HttpGet("consent")]
    public async Task<ActionResult<CvConsentResponse>> GetConsent()
    {
        return await cv.GetCurrentConsentAsync();
    }

    [HttpPost("consent/{textId:guid}")]
    public async Task<ActionResult<CvConsentResponse>> GrantConsent(Guid textId)
    {
        return await cv.AcceptCurrentConsentAsync(textId);
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(11 * 1024 * 1024)]
    public async Task<ActionResult<CvFileResponse>> Upload(IFormFile? file)
    {
        var created = await cv.UploadCvAsync(file);
        return StatusCode(201, created);
    }

    [HttpGet("{id:guid}/document")]
    public async Task<IActionResult> Download(Guid id)
    {
        var document = await cv.DownloadCvAsync(id);
        return File(document.Bytes, document.ContentType, document.FileName);
    }

    [HttpPut("{id:guid}/primary")]
    public async Task<ActionResult<List<CvFileResponse>>> SetPrimary(Guid id)
    {
        return await cv.SetPrimaryCvAsync(id);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await cv.DeleteCvAsync(id);
        return NoContent();
    }
}
