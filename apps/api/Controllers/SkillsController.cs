using CareerPath.Api.Dtos.Skill;
using CareerPath.Api.Services.Skill;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/skills")]
public class SkillsController : ControllerBase
{
    private readonly ISkillService skills;

    public SkillsController(ISkillService skills)
    {
        this.skills = skills;
    }

    [HttpGet]
    public async Task<ActionResult<SkillMapResponse>> GetMap()
    {
        return await skills.GetSkillMapAsync();
    }

    [HttpPost]
    public async Task<IActionResult> Add(SelectSkillRequest request)
    {
        await skills.AddSkillAsync(request.SkillId);
        return NoContent();
    }

    [HttpDelete("{skillId:guid}")]
    public async Task<IActionResult> Remove(Guid skillId)
    {
        await skills.RemoveSkillAsync(skillId);
        return NoContent();
    }

    [HttpPost("custom")]
    public async Task<IActionResult> AddCustom(CustomSkillRequest request)
    {
        await skills.AddCustomSkillAsync(request.Name, request.CategoryId);
        return NoContent();
    }

    [HttpPost("dismiss")]
    public async Task<IActionResult> Dismiss(DismissSkillRequest request)
    {
        await skills.DismissSkillAsync(request);
        return NoContent();
    }
}
