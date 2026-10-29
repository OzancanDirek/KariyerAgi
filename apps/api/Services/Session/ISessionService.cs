using CareerPath.Api.Dtos;

namespace CareerPath.Api.Services.Session;

public interface ISessionService
{
    Task<AuthSession> RefreshAsync(RefreshRequest request);
    Task<AuthUser> GetCurrentUserAsync();
}
