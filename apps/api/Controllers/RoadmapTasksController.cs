using CareerPath.Api.Dtos.Roadmap;
using CareerPath.Api.Services.Roadmap;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/roadmap/{roleId:guid}/tasks")]
public class RoadmapTasksController : ControllerBase
{
    private readonly IRoadmapTaskService service;

    public RoadmapTasksController(IRoadmapTaskService service)
    {
        this.service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<RoadmapTaskResponse>>> Get(Guid roleId)
    {
        return await service.GetTasksAsync(roleId);
    }

    [HttpPost("plan")]
    public async Task<ActionResult<List<RoadmapTaskResponse>>> CreatePlan(Guid roleId, [FromBody] CreateRoadmapPlanRequest request)
    {
        return await service.CreatePlanAsync(roleId, request);
    }

    [HttpPatch("{taskId:guid}/completion")]
    public async Task<IActionResult> SetCompleted(Guid roleId, Guid taskId, [FromBody] SetRoadmapTaskCompletionRequest request)
    {
        await service.SetCompletedAsync(roleId, taskId, request.Completed);
        return NoContent();
    }

    [HttpDelete("{taskId:guid}")]
    public async Task<IActionResult> Delete(Guid roleId, Guid taskId)
    {
        await service.DeleteTaskAsync(roleId, taskId);
        return NoContent();
    }
}

public class SetRoadmapTaskCompletionRequest
{
    public bool Completed { get; set; }
}
