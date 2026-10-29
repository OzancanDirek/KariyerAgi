using CareerPath.Api.Exceptions;
using CareerPath.Api.Services.Session;

namespace CareerPath.Api.Security;

public class CurrentUserContextProvider
{
    private readonly ISessionService session;
    private readonly HttpRequestContext requestContext;
    private Task<CurrentUserContext>? currentUserTask;

    public CurrentUserContextProvider(ISessionService session, HttpRequestContext requestContext)
    {
        this.session = session;
        this.requestContext = requestContext;
    }

    public CancellationToken CancellationToken
    {
        get
        {
            return requestContext.CancellationToken;
        }
    }

    public Task<CurrentUserContext> ResolveAsync()
    {
        currentUserTask ??= ResolveCurrentUserAsync();
        return currentUserTask;
    }

    private async Task<CurrentUserContext> ResolveCurrentUserAsync()
    {
        var accessToken = requestContext.AccessToken;
        var user = await session.GetCurrentUserAsync();
        if (!Guid.TryParse(user.Id, out var userId))
        {
            throw new ApiException(ErrorCodes.InvalidAuthResponse);
        }

        return new CurrentUserContext(userId, accessToken);
    }
}
