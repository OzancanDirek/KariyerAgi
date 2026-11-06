using CareerPath.Api.Infrastructure.Supabase;
using CareerPath.Api.Dtos;
using CareerPath.Api.Security;
using CareerPath.Api.Repositories.Profile;

namespace CareerPath.Api.Repositories.Session;

public class SessionRepository
{
    private readonly SupabaseAuthClient client;
    private readonly SupabaseRestClient restClient;
    private readonly ProfileRepository profiles;

    public SessionRepository(SupabaseAuthClient client, SupabaseRestClient restClient, ProfileRepository profiles)
    {
        this.client = client;
        this.restClient = restClient;
        this.profiles = profiles;
    }

    public async Task<AuthSession> RefreshAsync(string refreshToken, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "token?grant_type=refresh_token", new { refresh_token = refreshToken }, null, cancellationToken);
        return SupabaseSessionMapper.ReadSession(result.RootElement);
    }

    public async Task<AuthUser> GetUserAsync(string accessToken, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, "user", null, accessToken, cancellationToken);
        var user = SupabaseSessionMapper.ReadUser(result.RootElement);
        using var roles = await restClient.SendAsync(HttpMethod.Get, $"kullanici_roller?kullanici_id=eq.{user.Id}&select=roller(kod)&limit=1", null, accessToken, cancellationToken);
        var assignment = SupabaseResponseReader.ReadSingle<UserRoleRow>(roles.RootElement);
        user.Role = assignment?.Role?.Code;
        if (Guid.TryParse(user.Id, out var userId))
        {
            var profile = await profiles.GetByIdAsync(userId, accessToken, cancellationToken);
            user.FirstName = profile?.FirstName;
            user.LastName = profile?.LastName;
        }
        return user;
    }

    private class UserRoleRow
    {
        [System.Text.Json.Serialization.JsonPropertyName("roller")] public RoleRow? Role { get; set; }
    }

    private class RoleRow
    {
        [System.Text.Json.Serialization.JsonPropertyName("kod")] public string? Code { get; set; }
    }
}
