using System.Text.Json.Serialization;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.Roadmap;

public class RoadmapRepository
{
    private readonly SupabaseRestClient client;

    public RoadmapRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<List<RoadmapRole>> GetRolesAsync(string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, "meslekler?aktif_mi=eq.true&select=id,ad,aciklama&order=ad.asc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<RoleRow>(result.RootElement)
            .Select(row => new RoadmapRole { Id = row.Id, Name = row.Name, Description = row.Description }).ToList();
    }

    public async Task<List<RoadmapRequirement>> GetRequirementsAsync(Guid roleId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"meslek_becerileri?meslek_id=eq.{roleId:D}&select=beceri_id,onem,sira&order=sira.asc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<RequirementRow>(result.RootElement)
            .Select(row => new RoadmapRequirement { SkillId = row.SkillId, Required = row.Importance == "temel", Order = row.Order }).ToList();
    }

    private class RoleRow
    {
        [JsonPropertyName("id")] public Guid Id { get; set; }
        [JsonPropertyName("ad")] public string Name { get; set; } = string.Empty;
        [JsonPropertyName("aciklama")] public string? Description { get; set; }
    }

    private class RequirementRow
    {
        [JsonPropertyName("beceri_id")] public Guid SkillId { get; set; }
        [JsonPropertyName("onem")] public string Importance { get; set; } = string.Empty;
        [JsonPropertyName("sira")] public int Order { get; set; }
    }
}

public class RoadmapRole
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class RoadmapRequirement
{
    public Guid SkillId { get; set; }
    public bool Required { get; set; }
    public int Order { get; set; }
}
