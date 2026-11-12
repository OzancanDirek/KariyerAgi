using System.Text.Json.Serialization;
using CareerPath.Api.Dtos.CustomCareer;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.CustomCareer;

public class CustomCareerRepository
{
    private const string Columns = "id,meslek_adi,durum,oneriler,onaylananlar";
    private readonly SupabaseRestClient client;

    public CustomCareerRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<int> CountTodayAsync(Guid candidateId, string token, CancellationToken cancellationToken)
    {
        var today = DateTimeOffset.UtcNow.Date.ToString("yyyy-MM-dd");
        using var result = await client.SendAsync(HttpMethod.Get, $"aday_ozel_meslek_taslaklari?aday_id=eq.{candidateId:D}&olusturma_tarihi=gte.{today}T00:00:00Z&select=id", null, token, cancellationToken);
        return result.RootElement.GetArrayLength();
    }

    public async Task<CustomCareerRow?> GetLatestAsync(Guid candidateId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"aday_ozel_meslek_taslaklari?aday_id=eq.{candidateId:D}&durum=in.(draft,confirmed)&select={Columns}&order=olusturma_tarihi.desc&limit=1", null, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CustomCareerRow>(result.RootElement);
    }

    public async Task<List<CustomCareerRow>> GetConfirmedAsync(Guid candidateId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"aday_ozel_meslek_taslaklari?aday_id=eq.{candidateId:D}&durum=eq.confirmed&select={Columns}&order=olusturma_tarihi.desc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<CustomCareerRow>(result.RootElement);
    }

    public async Task<CustomCareerRow?> GetAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"aday_ozel_meslek_taslaklari?aday_id=eq.{candidateId:D}&id=eq.{id:D}&select={Columns}", null, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CustomCareerRow>(result.RootElement);
    }

    public async Task<CustomCareerRow?> CreateAsync(Guid candidateId, string title, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, $"aday_ozel_meslek_taslaklari?select={Columns}", new { aday_id = candidateId, meslek_adi = title }, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CustomCareerRow>(result.RootElement);
    }

    public async Task<CustomCareerRow?> UpdateAsync(Guid candidateId, Guid id, CustomCareerUpdateValues values, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"aday_ozel_meslek_taslaklari?aday_id=eq.{candidateId:D}&id=eq.{id:D}&select={Columns}", values, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CustomCareerRow>(result.RootElement);
    }
}

public class CustomCareerRow
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("meslek_adi")] public string Title { get; set; } = string.Empty;
    [JsonPropertyName("durum")] public string Status { get; set; } = string.Empty;
    [JsonPropertyName("oneriler")] public List<CustomCareerSkill> SuggestedSkills { get; set; } = new();
    [JsonPropertyName("onaylananlar")] public List<CustomCareerSkill> ConfirmedSkills { get; set; } = new();
}
