using CareerPath.Api.Entities;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.Profile;

public class ProfileRepository : IProfileRepository
{
    private const string Columns = "id,ad,soyad,eposta,telefon,konum,profil_fotografi_url";
    private readonly SupabaseRestClient client;

    public ProfileRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<SystemUser?> GetByIdAsync(Guid userId, string accessToken, CancellationToken cancellationToken)
    {
        var path = BuildPath(userId);
        using var result = await client.SendAsync(HttpMethod.Get, path, null, accessToken, cancellationToken);
        return SupabaseResponseReader.ReadSingle<SystemUser>(result.RootElement);
    }

    public async Task<SystemUser?> UpdateAsync(Guid userId, string accessToken, SystemUser profile, CancellationToken cancellationToken)
    {
        var values = new Dictionary<string, object?>
        {
            ["ad"] = profile.FirstName,
            ["soyad"] = profile.LastName,
            ["telefon"] = profile.Phone,
            ["konum"] = profile.Location,
            ["profil_fotografi_url"] = profile.PhotoUrl
        };
        using var result = await client.SendAsync(HttpMethod.Patch, BuildPath(userId), values, accessToken, cancellationToken);
        return SupabaseResponseReader.ReadSingle<SystemUser>(result.RootElement);
    }

    private static string BuildPath(Guid userId)
    {
        return $"sistem_kullanicilari?id=eq.{userId:D}&select={Columns}";
    }

}
