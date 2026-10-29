using CareerPath.Api.Dtos.Education;
using CareerPath.Api.Services.Education;
using Microsoft.AspNetCore.Mvc;
using EducationEntity = CareerPath.Api.Entities.Education;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/educations")]
public class EducationController : ControllerBase
{
    private readonly IEducationService education;

    public EducationController(IEducationService education)
    {
        this.education = education;
    }

    [HttpGet]
    public async Task<ActionResult<List<EducationResponse>>> List()
    {
        return await education.GetEducationsAsync();
    }

    [HttpPost]
    public async Task<ActionResult<EducationResponse>> Create(EducationRequest request)
    {
        var created = await education.CreateEducationAsync(request);
        return StatusCode(201, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<EducationResponse>> Update(Guid id, EducationRequest request)
    {
        return await education.UpdateEducationAsync(id, request);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await education.DeleteEducationAsync(id);
        return NoContent();
    }
}
