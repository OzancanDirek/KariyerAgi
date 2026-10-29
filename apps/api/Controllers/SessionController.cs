using CareerPath.Api.Dtos;
using CareerPath.Api.Services.Session;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/session")]
public class SessionController : ControllerBase
{
    private readonly ISessionService session;

    public SessionController(ISessionService session)
    {
        this.session = session;
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthSession>> Refresh(RefreshRequest request)
    {
        return await session.RefreshAsync(request);
    }

    [HttpGet("me")]
    public async Task<ActionResult<AuthUser>> Me()
    {
        return await session.GetCurrentUserAsync();
    }
}
