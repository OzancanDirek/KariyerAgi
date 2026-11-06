using CareerPath.Api.Dtos.LearningResource;
using CareerPath.Api.Services.LearningResource;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/learning-resources")]
public class LearningResourcesController : ControllerBase
{
    private readonly ILearningResourceService resources;

    public LearningResourcesController(ILearningResourceService resources)
    {
        this.resources = resources;
    }

    [HttpGet]
    public async Task<ActionResult<List<LearningResourceResponse>>> List()
    {
        return await resources.ListAsync();
    }

    [HttpGet("manage")]
    public async Task<ActionResult<List<LearningResourceResponse>>> ListForManagement()
    {
        return await resources.ListForManagementAsync();
    }

    [HttpPost]
    public async Task<ActionResult<LearningResourceResponse>> Create(SaveLearningResourceRequest request)
    {
        return await resources.CreateAsync(request);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<LearningResourceResponse>> Update(Guid id, SaveLearningResourceRequest request)
    {
        return await resources.UpdateAsync(id, request);
    }
}
