using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.Job;

public class JobRepository
{
private const string JobColumns = "id,sirket_id,baslik,aciklama,konum,calisma_modeli,istihdam_turu,durum,yayin_tarihi,son_basvuru_tarihi,olusturma_tarihi,guncelleme_tarihi,sirketler(ad)";
    private readonly SupabaseRestClient client;

    public JobRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

public async Task<List<JobRow>> ListPublishedJobsAsync(string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"is_ilanlari?is_deleted=eq.false&durum=eq.yayinda&select={JobColumns}&order=yayin_tarihi.desc&limit=100", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<JobRow>(result.RootElement);
    }

    public async Task<List<JobRow>> ListOwnedJobsAsync(IReadOnlyList<Guid> companyIds, string token, CancellationToken cancellationToken)
    {
        if (companyIds.Count == 0)
        {
            return new();
        }
        var ids = string.Join(',', companyIds.Select(id => id.ToString("D")));
        using var result = await client.SendAsync(HttpMethod.Get, $"is_ilanlari?sirket_id=in.({ids})&is_deleted=eq.false&select={JobColumns}&order=olusturma_tarihi.desc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<JobRow>(result.RootElement);
    }

    public async Task<JobRow?> GetJobAsync(Guid id, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"is_ilanlari?id=eq.{id:D}&is_deleted=eq.false&select={JobColumns}&limit=1", null, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<JobRow>(result.RootElement);
    }

    public async Task<JobRow?> CreateJobAsync(JobValues values, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, $"is_ilanlari?select={JobColumns}", values, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<JobRow>(result.RootElement);
    }

    public async Task<JobRow?> UpdateJobAsync(Guid id, JobValues values, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"is_ilanlari?id=eq.{id:D}&is_deleted=eq.false&select={JobColumns}", values, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<JobRow>(result.RootElement);
    }

    public async Task<bool> ArchiveJobAsync(Guid id, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"is_ilanlari?id=eq.{id:D}&is_deleted=eq.false&select=id", new { is_deleted = true }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }
}
