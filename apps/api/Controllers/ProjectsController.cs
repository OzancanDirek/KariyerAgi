using CareerPath.Api.Dtos.Project;
using CareerPath.Api.Services.Project;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService projects;

    public ProjectsController(IProjectService projects)
    {
        this.projects = projects;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProjectResponse>>> List()
    {
        return await projects.ListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<ProjectResponse>> Create(ProjectRequest request)
    {
        var created = await projects.CreateAsync(request);
        return StatusCode(201, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProjectResponse>> Update(Guid id, ProjectRequest request)
    {
        return await projects.UpdateAsync(id, request);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await projects.DeleteAsync(id);
        return NoContent();
    }
}
