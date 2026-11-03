using CareerPath.Api.Dtos.Roadmap;
using CareerPath.Api.Services.Roadmap;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/roadmap")]
public class RoadmapController : ControllerBase
{
    private readonly IRoadmapService roadmap;

    public RoadmapController(IRoadmapService roadmap)
    {
        this.roadmap = roadmap;
    }

    [HttpGet]
    public async Task<ActionResult<RoadmapResponse>> Get([FromQuery] Guid? roleId)
    {
        return await roadmap.GetRoadmapAsync(roleId);
    }
}
