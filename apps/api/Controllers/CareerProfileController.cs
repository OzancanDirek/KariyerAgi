using CareerPath.Api.Dtos.CareerProfile;
using CareerPath.Api.Services.CareerProfile;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/career-profile")]
public class CareerProfileController : ControllerBase
{
    private readonly ICareerProfileService profile;

    public CareerProfileController(ICareerProfileService profile)
    {
        this.profile = profile;
    }

    [HttpGet("me")]
    public async Task<ActionResult<CareerProfileResponse>> Me()
    {
        return await profile.GetMineAsync();
    }

    [HttpPut("me")]
    public async Task<ActionResult<CareerProfileResponse>> Update(UpdateCareerProfileRequest request)
    {
        return await profile.UpdateMineAsync(request);
    }
}
