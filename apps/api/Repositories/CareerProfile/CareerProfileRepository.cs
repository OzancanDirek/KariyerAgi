using CareerPath.Api.Entities;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.CareerProfile;

public class CareerProfileRepository : ICareerProfileRepository
{
    private const string Columns = "id,unvan,ozet,deneyim_seviyesi,linkedin_url,github_url,portfolyo_url,hedef_unvan,hedef_sektor,calisma_modelleri,tercih_edilen_konumlar,hedef_kidem,kariyer_notlari,profil_gorunurlugu";
    private readonly SupabaseRestClient client;

    public CareerProfileRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<CandidateProfile?> GetByIdAsync(Guid userId, string accessToken, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, BuildPath(userId), null, accessToken, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CandidateProfile>(result.RootElement);
    }

    public async Task<CandidateProfile?> UpdateAsync(Guid userId, string accessToken, CandidateProfile profile, CancellationToken cancellationToken)
    {
        var values = new Dictionary<string, object?>
        {
            ["unvan"] = profile.Title,
            ["ozet"] = profile.Summary,
            ["deneyim_seviyesi"] = profile.ExperienceLevel,
            ["linkedin_url"] = profile.LinkedInUrl,
            ["github_url"] = profile.GitHubUrl,
            ["portfolyo_url"] = profile.PortfolioUrl,
            ["hedef_unvan"] = profile.TargetTitle,
            ["hedef_sektor"] = profile.TargetIndustry,
            ["calisma_modelleri"] = profile.WorkModels,
            ["tercih_edilen_konumlar"] = profile.PreferredLocations,
            ["hedef_kidem"] = profile.TargetSeniority,
            ["kariyer_notlari"] = profile.CareerNotes,
            ["profil_gorunurlugu"] = profile.Visibility
        };
        using var result = await client.SendAsync(HttpMethod.Patch, BuildPath(userId), values, accessToken, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CandidateProfile>(result.RootElement);
    }

    private static string BuildPath(Guid userId)
    {
        return $"aday_profilleri?id=eq.{userId:D}&select={Columns}";
    }
}
