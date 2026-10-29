using CareerPath.Api.Dtos;
using CareerPath.Api.Services.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthenticationController : ControllerBase
{
    private readonly IAuthenticationService authentication;

    public AuthenticationController(IAuthenticationService authentication)
    {
        this.authentication = authentication;
    }

    [HttpPost("register")]
    public async Task<ActionResult<RegisterResponse>> Register(RegisterRequest request)
    {
        return await authentication.RegisterAsync(request);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthSession>> Login(LoginRequest request)
    {
        return await authentication.LoginAsync(request);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await authentication.LogoutAsync();
        return NoContent();
    }
}
