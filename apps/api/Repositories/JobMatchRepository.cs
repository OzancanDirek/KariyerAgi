using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories;

public class JobMatchRepository
{
    private readonly SupabaseRestClient client;

    public JobMatchRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<MatchCriteriaRow?> GetCriteriaAsync(Guid jobId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"is_ilani_eslestirme_olcutleri?ilan_id=eq.{jobId:D}&is_deleted=eq.false&select=ilan_id,surum,olcutler&limit=1", null, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<MatchCriteriaRow>(result.RootElement);
    }

    public async Task<MatchCriteriaRow?> SaveCriteriaAsync(Guid jobId, List<MatchCriterion> criteria, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "rpc/is_ilani_olcutlerini_kaydet", new { p_ilan_id = jobId, p_olcutler = criteria }, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<MatchCriteriaRow>(result.RootElement);
    }

    public async Task<ApplicationMatchRow?> GetMatchAsync(Guid applicationId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"is_basvuru_eslestirmeleri?basvuru_id=eq.{applicationId:D}&is_deleted=eq.false&select=basvuru_id,ilan_id,olcut_surumu,puan,dayanaklar,olusturma_tarihi&limit=1", null, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<ApplicationMatchRow>(result.RootElement);
    }

    public async Task<List<ApplicationMatchRow>> ListMatchesAsync(Guid jobId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"is_basvuru_eslestirmeleri?ilan_id=eq.{jobId:D}&is_deleted=eq.false&select=basvuru_id,ilan_id,olcut_surumu,puan,dayanaklar,olusturma_tarihi", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<ApplicationMatchRow>(result.RootElement);
    }

    public async Task<ApplicationMatchRow?> SaveMatchAsync(Guid applicationId, int version, int score, List<MatchEvidence> evidence, CancellationToken cancellationToken)
    {
        using var result = await client.SendServerRequestAsync(HttpMethod.Post, "rpc/is_basvurusu_eslestirmesini_kaydet", new { p_basvuru_id = applicationId, p_olcut_surumu = version, p_puan = score, p_dayanaklar = evidence }, cancellationToken);
        return SupabaseResponseReader.ReadSingle<ApplicationMatchRow>(result.RootElement);
    }
}
