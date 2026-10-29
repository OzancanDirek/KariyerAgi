using CareerPath.Api.Dtos.Experience;
using CareerPath.Api.Entities;
using CareerPath.Api.Services.Experience;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/experiences")]
public class ExperiencesController : ControllerBase
{
    private readonly IExperienceService experiences;

    public ExperiencesController(IExperienceService experiences)
    {
        this.experiences = experiences;
    }

    [HttpGet]
    public async Task<ActionResult<List<ExperienceResponse>>> List()
    {
        return await experiences.ListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<ExperienceResponse>> Create(ExperienceRequest request)
    {
        var created = await experiences.CreateAsync(request);
        return StatusCode(201, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ExperienceResponse>> Update(Guid id, ExperienceRequest request)
    {
        return await experiences.UpdateAsync(id, request);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await experiences.DeleteAsync(id);
        return NoContent();
    }
}
