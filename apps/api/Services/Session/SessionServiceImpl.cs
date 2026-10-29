using CareerPath.Api.Dtos;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.Session;
using CareerPath.Api.Security;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Services.Session;

public class SessionServiceImpl : ISessionService
{
    private readonly ISessionRepository repository;
    private readonly HttpRequestContext requestContext;

    public SessionServiceImpl(ISessionRepository repository, HttpRequestContext requestContext)
    {
        this.repository = repository;
        this.requestContext = requestContext;
    }

    public Task<AuthSession> RefreshAsync(RefreshRequest request)
    {
        var refreshToken = StringUtils.TrimRequired(request.RefreshToken, ErrorCodes.RefreshTokenRequired);
        return repository.RefreshAsync(refreshToken, requestContext.CancellationToken);
    }

    public Task<AuthUser> GetCurrentUserAsync()
    {
        return repository.GetUserAsync(requestContext.AccessToken, requestContext.CancellationToken);
    }
}
