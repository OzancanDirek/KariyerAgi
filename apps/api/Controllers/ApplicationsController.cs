using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Services.JobApplication;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/applications")]
public class ApplicationsController : ControllerBase
{
    private readonly IJobApplicationService applications;

    public ApplicationsController(IJobApplicationService applications)
    {
        this.applications = applications;
    }

    [HttpGet("mine")]
    public async Task<ActionResult<List<ApplicationResponse>>> ListOwn()
    {
        return await applications.GetOwnApplicationsAsync();
    }

    [HttpPatch("{id:guid}/withdraw")]
    public async Task<IActionResult> Withdraw(Guid id)
    {
        await applications.WithdrawAsync(id);
        return NoContent();
    }
}
