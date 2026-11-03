using System.Text.Json.Serialization;
using CareerPath.Api.Infrastructure.Supabase;
using CareerPath.Api.Infrastructure.Gemini;

namespace CareerPath.Api.Repositories.Roadmap;

public class RoadmapTaskRepository
{
    private const string Columns = "id,beceri_id,hafta,son_tarih,baslik,aciklama,tur,oncelik,tahmini_saat,tamamlandi_mi";
    private readonly SupabaseRestClient client;

    public RoadmapTaskRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<List<RoadmapTaskRow>> ListAsync(Guid candidateId, Guid roleId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"aday_yol_haritasi_gorevleri?aday_id=eq.{candidateId:D}&meslek_id=eq.{roleId:D}&is_deleted=eq.false&select={Columns}&order=hafta.asc,son_tarih.asc,olusturma_tarihi.asc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<RoadmapTaskRow>(result.RootElement);
    }

    public async Task ReplacePlanAsync(Guid roleId, List<GeneratedRoadmapTask> plan, DateOnly firstMonday, string token, CancellationToken cancellationToken)
    {
        var values = plan.Select(task => new
        {
            beceri_id = task.SkillId,
            hafta = task.Week,
            son_tarih = firstMonday.AddDays(task.Week * 7 - 1),
            baslik = task.Title,
            aciklama = task.Description,
            tur = task.Type,
            oncelik = task.Priority,
            tahmini_saat = task.EstimatedHours
        }).ToList();
        using var result = await client.SendAsync(HttpMethod.Post, "rpc/aday_yol_haritasi_plani_kaydet", new { p_meslek_id = roleId, p_gorevler = values }, token, cancellationToken);
    }

    public async Task<bool> SetCompletedAsync(Guid candidateId, Guid roleId, Guid taskId, bool completed, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"aday_yol_haritasi_gorevleri?id=eq.{taskId:D}&aday_id=eq.{candidateId:D}&meslek_id=eq.{roleId:D}&is_deleted=eq.false&select=id", new { tamamlandi_mi = completed }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    public async Task<bool> DeleteAsync(Guid candidateId, Guid roleId, Guid taskId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"aday_yol_haritasi_gorevleri?id=eq.{taskId:D}&aday_id=eq.{candidateId:D}&meslek_id=eq.{roleId:D}&is_deleted=eq.false&select=id", new { is_deleted = true }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }
}

public class RoadmapTaskRow
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("beceri_id")] public Guid SkillId { get; set; }
    [JsonPropertyName("hafta")] public int Week { get; set; }
    [JsonPropertyName("son_tarih")] public DateOnly DueDate { get; set; }
    [JsonPropertyName("baslik")] public string Title { get; set; } = string.Empty;
    [JsonPropertyName("aciklama")] public string Description { get; set; } = string.Empty;
    [JsonPropertyName("tur")] public string Type { get; set; } = string.Empty;
    [JsonPropertyName("oncelik")] public string Priority { get; set; } = string.Empty;
    [JsonPropertyName("tahmini_saat")] public int EstimatedHours { get; set; }
    [JsonPropertyName("tamamlandi_mi")] public bool Completed { get; set; }
}
