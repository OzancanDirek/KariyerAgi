using CareerPath.Api.Enums;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.Role;

public class RoleRepository
{
private readonly SupabaseRestClient client;
    public RoleRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<bool> HasRoleAsync(Guid userId, AccountRole role, string token, CancellationToken cancellationToken)
    {
        using var roleResult = await client.SendAsync(HttpMethod.Get, $"roller?kod=eq.{role.ToDatabaseCode()}&select=id&limit=1", null, token, cancellationToken);
        var id = SupabaseResponseReader.ReadSingle<RoleRow>(roleResult.RootElement)?.Id;
        if (id is null)
        {
            return false;
        }
        using var assignment = await client.SendAsync(HttpMethod.Get, $"kullanici_roller?kullanici_id=eq.{userId:D}&rol_id=eq.{id:D}&select=id&limit=1", null, token, cancellationToken);
        return assignment.RootElement.GetArrayLength() > 0;
    }

    private class RoleRow
    {
        [System.Text.Json.Serialization.JsonPropertyName("id")] public Guid Id { get; set; }
    }
}
