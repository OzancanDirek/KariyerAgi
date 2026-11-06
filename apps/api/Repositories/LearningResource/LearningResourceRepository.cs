using System.Text.Json.Serialization;
using CareerPath.Api.Dtos.LearningResource;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.LearningResource;

public class LearningResourceRepository
{
    private readonly SupabaseRestClient client;

    public LearningResourceRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<List<LearningResourceRow>> ListAsync(bool includeInactive, string token, CancellationToken cancellationToken)
    {
        var filter = includeInactive ? "" : "&aktif_mi=eq.true";
        using var result = await client.SendAsync(HttpMethod.Get, $"egitim_kaynaklari?select=id,beceri_id,baslik,url,saglayici,tur,dil,seviye,ucretli_mi,aktif_mi,son_kontrol_tarihi{filter}&order=baslik.asc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<LearningResourceRow>(result.RootElement);
    }

    public async Task<bool> IsAdministratorAsync(Guid userId, string token, CancellationToken cancellationToken)
    {
        using var roles = await client.SendAsync(HttpMethod.Get, "roller?kod=eq.yonetici&select=id", null, token, cancellationToken);
        var role = SupabaseResponseReader.ReadList<RoleRow>(roles.RootElement).FirstOrDefault();
        if (role is null)
        {
            return false;
        }
        using var assignments = await client.SendAsync(HttpMethod.Get, $"kullanici_roller?kullanici_id=eq.{userId:D}&rol_id=eq.{role.Id:D}&select=rol_id", null, token, cancellationToken);
        return assignments.RootElement.GetArrayLength() > 0;
    }

    public async Task<LearningResourceRow?> SaveAsync(Guid? id, LearningResourceValues values, string token, CancellationToken cancellationToken)
    {
        var method = id.HasValue ? HttpMethod.Patch : HttpMethod.Post;
        var path = id.HasValue ? $"egitim_kaynaklari?id=eq.{id.Value:D}&select=id,beceri_id,baslik,url,saglayici,tur,dil,seviye,ucretli_mi,aktif_mi,son_kontrol_tarihi" : "egitim_kaynaklari?select=id,beceri_id,baslik,url,saglayici,tur,dil,seviye,ucretli_mi,aktif_mi,son_kontrol_tarihi";
        using var result = await client.SendAsync(method, path, values, token, cancellationToken);
        return SupabaseResponseReader.ReadList<LearningResourceRow>(result.RootElement).FirstOrDefault();
    }

    private class RoleRow
    {
        [JsonPropertyName("id")] public Guid Id { get; set; }
    }

    public class LearningResourceRow
    {
        [JsonPropertyName("id")] public Guid Id { get; set; }
        [JsonPropertyName("beceri_id")] public Guid SkillId { get; set; }
        [JsonPropertyName("baslik")] public string Title { get; set; } = string.Empty;
        [JsonPropertyName("url")] public string Url { get; set; } = string.Empty;
        [JsonPropertyName("saglayici")] public string Provider { get; set; } = string.Empty;
        [JsonPropertyName("tur")] public string Type { get; set; } = string.Empty;
        [JsonPropertyName("dil")] public string Language { get; set; } = string.Empty;
        [JsonPropertyName("seviye")] public string Level { get; set; } = string.Empty;
        [JsonPropertyName("ucretli_mi")] public bool Paid { get; set; }
        [JsonPropertyName("aktif_mi")] public bool Active { get; set; }
        [JsonPropertyName("son_kontrol_tarihi")] public DateOnly? CheckedOn { get; set; }
    }
}
