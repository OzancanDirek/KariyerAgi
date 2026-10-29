using CareerPath.Api.Dtos;

namespace CareerPath.Api.Repositories.Session;

public interface ISessionRepository
{
    Task<AuthSession> RefreshAsync(string refreshToken, CancellationToken cancellationToken);
    Task<AuthUser> GetUserAsync(string accessToken, CancellationToken cancellationToken);
}
