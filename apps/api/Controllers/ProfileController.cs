using CareerPath.Api.Dtos.Profile;
using CareerPath.Api.Services.Profile;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly IProfileService profile;

    public ProfileController(IProfileService profile)
    {
        this.profile = profile;
    }

    [HttpGet("me")]
    public async Task<ActionResult<ProfileResponse>> Me()
    {
        return await profile.GetProfileAsync();
    }

    [HttpPut("me")]
    public async Task<ActionResult<ProfileResponse>> Update(UpdateProfileRequest request)
    {
        return await profile.UpdateProfileAsync(request);
    }
}
