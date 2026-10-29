using CareerPath.Api.Dtos.Certificate;
using CareerPath.Api.Services.Certificate;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/certificates")]
public class CertificatesController : ControllerBase
{
    private readonly ICertificateService certificates;

    public CertificatesController(ICertificateService certificates)
    {
        this.certificates = certificates;
    }

    [HttpGet]
    public async Task<ActionResult<List<CertificateResponse>>> List()
    {
        return await certificates.ListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<CertificateResponse>> Create(CertificateRequest request)
    {
        var created = await certificates.CreateAsync(request);
        return StatusCode(201, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CertificateResponse>> Update(Guid id, CertificateRequest request)
    {
        return await certificates.UpdateAsync(id, request);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await certificates.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost("{id:guid}/document")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(11 * 1024 * 1024)]
    public async Task<ActionResult<CertificateResponse>> UploadDocument(Guid id, IFormFile? file)
    {
        return await certificates.UploadDocumentAsync(id, file);
    }

    [HttpGet("{id:guid}/document")]
    public async Task<IActionResult> DownloadDocument(Guid id)
    {
        var document = await certificates.DownloadDocumentAsync(id);
        return File(document.Bytes, document.ContentType, document.FileName);
    }

    [HttpDelete("{id:guid}/document")]
    public async Task<ActionResult<CertificateResponse>> DeleteDocument(Guid id)
    {
        return await certificates.DeleteDocumentAsync(id);
    }
}
