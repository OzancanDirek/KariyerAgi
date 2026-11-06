using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Services.Company;
using CareerPath.Api.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/companies")]
public class CompaniesController : ControllerBase
{
    private readonly ICompanyService companies;

    public CompaniesController(ICompanyService companies)
    {
        this.companies = companies;
    }

    [HttpGet("mine")]
    public async Task<ActionResult<List<CompanyResponse>>> ListOwn()
    {
        return await companies.GetCompaniesAsync();
    }

    [HttpGet("pending")]
    public async Task<ActionResult<List<CompanyResponse>>> ListPending()
    {
        return await companies.GetPendingCompaniesAsync();
    }

    [HttpPatch("{id:guid}/review")]
    public async Task<ActionResult<CompanyResponse>> Review(Guid id, CompanyReviewRequest request)
    {
        if (!request.Approved.HasValue)
        {
            throw new ApiException(ErrorCodes.Validation);
        }
        return await companies.ReviewCompanyAsync(id, request.Approved.Value);
    }

    [HttpPost]
    public async Task<ActionResult<CompanyResponse>> Create(CompanyRequest request)
    {
        return StatusCode(201, await companies.CreateCompanyAsync(request));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CompanyResponse>> Update(Guid id, CompanyRequest request)
    {
        return await companies.UpdateCompanyAsync(id, request);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Archive(Guid id)
    {
        await companies.ArchiveCompanyAsync(id);
        return NoContent();
    }
}
