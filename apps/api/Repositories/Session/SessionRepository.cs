using CareerPath.Api.Infrastructure.Supabase;
using CareerPath.Api.Dtos;
using CareerPath.Api.Security;

namespace CareerPath.Api.Repositories.Session;

public class SessionRepository : ISessionRepository
{
    private readonly SupabaseAuthClient client;

    public SessionRepository(SupabaseAuthClient client)
    {
        this.client = client;
    }

    public async Task<AuthSession> RefreshAsync(string refreshToken, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "token?grant_type=refresh_token", new { refresh_token = refreshToken }, null, cancellationToken);
        return SupabaseSessionMapper.ReadSession(result.RootElement);
    }

    public async Task<AuthUser> GetUserAsync(string accessToken, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, "user", null, accessToken, cancellationToken);
        return SupabaseSessionMapper.ReadUser(result.RootElement);
    }
}
