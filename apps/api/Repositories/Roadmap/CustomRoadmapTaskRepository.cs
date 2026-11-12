using CareerPath.Api.Infrastructure.Gemini;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.Roadmap;

public class CustomRoadmapTaskRepository
{
    private const string Columns = "id,beceri_id,hafta,son_tarih,baslik,aciklama,tur,oncelik,tahmini_saat,tamamlandi_mi";
    private readonly SupabaseRestClient client;

    public CustomRoadmapTaskRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<List<RoadmapTaskRow>> ListAsync(Guid candidateId, Guid careerId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"aday_ozel_meslek_gorevleri?aday_id=eq.{candidateId:D}&taslak_id=eq.{careerId:D}&is_deleted=eq.false&select={Columns}&order=hafta.asc,son_tarih.asc,olusturma_tarihi.asc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<RoadmapTaskRow>(result.RootElement);
    }

    public async Task ReplacePlanAsync(Guid careerId, List<GeneratedRoadmapTask> plan, IReadOnlyDictionary<Guid, string> skillNames, DateOnly firstMonday, string token, CancellationToken cancellationToken)
    {
        var values = plan.Select(task => new
        {
            beceri_id = task.SkillId,
            beceri_adi = skillNames[task.SkillId],
            hafta = task.Week,
            son_tarih = firstMonday.AddDays(task.Week * 7 - 1),
            baslik = task.Title,
            aciklama = task.Description,
            tur = task.Type,
            oncelik = task.Priority,
            tahmini_saat = task.EstimatedHours
        }).ToList();
        using var result = await client.SendAsync(HttpMethod.Post, "rpc/aday_ozel_meslek_plani_kaydet", new { p_taslak_id = careerId, p_gorevler = values }, token, cancellationToken);
    }

    public async Task<bool> SetCompletedAsync(Guid candidateId, Guid careerId, Guid taskId, bool completed, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"aday_ozel_meslek_gorevleri?id=eq.{taskId:D}&aday_id=eq.{candidateId:D}&taslak_id=eq.{careerId:D}&is_deleted=eq.false&select=id", new { tamamlandi_mi = completed }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    public async Task<bool> DeleteAsync(Guid candidateId, Guid careerId, Guid taskId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"aday_ozel_meslek_gorevleri?id=eq.{taskId:D}&aday_id=eq.{candidateId:D}&taslak_id=eq.{careerId:D}&is_deleted=eq.false&select=id", new { is_deleted = true }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }
}
