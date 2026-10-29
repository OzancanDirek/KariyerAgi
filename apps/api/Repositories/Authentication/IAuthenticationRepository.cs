using CareerPath.Api.Dtos;
using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Repositories.Authentication;

public interface IAuthenticationRepository
{
    Task<RegisterResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken);
    Task<AuthSession> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
    Task LogoutAsync(string accessToken, CancellationToken cancellationToken);
}
