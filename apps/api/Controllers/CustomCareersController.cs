using CareerPath.Api.Dtos.CustomCareer;
using CareerPath.Api.Services.CustomCareer;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/custom-careers")]
public class CustomCareersController : ControllerBase
{
    private readonly ICustomCareerService careers;

    public CustomCareersController(ICustomCareerService careers)
    {
        this.careers = careers;
    }

    [HttpGet("latest")]
    public async Task<ActionResult<CustomCareerResponse?>> GetLatest()
    {
        return await careers.GetLatestAsync();
    }

    [HttpPost("draft")]
    public async Task<ActionResult<CustomCareerResponse>> CreateDraft(CreateCustomCareerRequest request)
    {
        return await careers.CreateDraftAsync(request);
    }

    [HttpPut("{id:guid}/confirm")]
    public async Task<ActionResult<CustomCareerResponse>> Confirm(Guid id, ConfirmCustomCareerRequest request)
    {
        return await careers.ConfirmAsync(id, request);
    }
}
