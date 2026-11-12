using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.JobApplication;

public class JobApplicationRepository
{
 private const string ApplicationColumns = "id,ilan_id,aday_id,cv_dosyasi_id,on_yazi,durum,olusturma_tarihi,guncelleme_tarihi";
    private readonly SupabaseRestClient client;

    public JobApplicationRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

public async Task<List<ApplicationRow>> ListCandidateApplicationsAsync(Guid candidateId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"is_basvurulari?aday_id=eq.{candidateId:D}&is_deleted=eq.false&select={ApplicationColumns}&order=olusturma_tarihi.desc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<ApplicationRow>(result.RootElement);
    }

    public async Task<List<ApplicationRow>> ListJobApplicationsAsync(Guid jobId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "rpc/is_ilani_basvurulari", new { p_ilan_id = jobId }, token, cancellationToken);
        return SupabaseResponseReader.ReadList<ApplicationRow>(result.RootElement);
    }

    public async Task<ApplicantDetailRow?> GetApplicantDetailAsync(Guid applicationId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "rpc/is_basvurusu_aday_detayi", new { p_basvuru_id = applicationId }, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<ApplicantDetailRow>(result.RootElement);
    }

    public async Task<bool> HasActiveApplicationAsync(Guid jobId, Guid candidateId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"is_basvurulari?ilan_id=eq.{jobId:D}&aday_id=eq.{candidateId:D}&durum=not.eq.geri_cekildi&is_deleted=eq.false&select=id&limit=1", null, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    public async Task<ApplicationRow?> CreateApplicationAsync(Guid jobId, Guid candidateId, Guid? cvFileId, string? coverLetter, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, $"is_basvurulari?select={ApplicationColumns}", new { ilan_id = jobId, aday_id = candidateId, cv_dosyasi_id = cvFileId, on_yazi = coverLetter }, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<ApplicationRow>(result.RootElement);
    }

    public async Task<bool> WithdrawApplicationAsync(Guid id, Guid candidateId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"is_basvurulari?id=eq.{id:D}&aday_id=eq.{candidateId:D}&durum=not.eq.geri_cekildi&is_deleted=eq.false&select=id", new { durum = "geri_cekildi" }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    public async Task<ApplicationRow?> UpdateStatusAsync(Guid id, string status, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "rpc/is_basvurusu_asamasini_guncelle", new { p_basvuru_id = id, p_durum = status }, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<ApplicationRow>(result.RootElement);
    }
}
