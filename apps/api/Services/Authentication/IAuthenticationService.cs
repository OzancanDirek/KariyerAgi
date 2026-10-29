using CareerPath.Api.Dtos;
using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Services.Authentication;

public interface IAuthenticationService
{
    Task<RegisterResponse> RegisterAsync(RegisterRequest request);
    Task<AuthSession> LoginAsync(LoginRequest request);
    Task LogoutAsync();
}
