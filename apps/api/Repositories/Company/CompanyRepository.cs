using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Enums;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.Company;

public class CompanyRepository
{
    private const string CompanyColumns = "id,sahip_kullanici_id,ad,aciklama,sektor,konum,web_sitesi,dogrulama_durumu,olusturma_tarihi,guncelleme_tarihi";
    private readonly SupabaseRestClient client;

    public CompanyRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<List<CompanyRow>> ListCompaniesAsync(Guid ownerId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"sirketler?sahip_kullanici_id=eq.{ownerId:D}&is_deleted=eq.false&select={CompanyColumns}&order=olusturma_tarihi.desc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<CompanyRow>(result.RootElement);
    }

    public async Task<List<CompanyRow>> ListCompaniesByIdsAsync(IReadOnlyList<Guid> companyIds, string token, CancellationToken cancellationToken)
    {
        if (companyIds.Count == 0)
        {
            return new();
        }
        var ids = string.Join(',', companyIds.Select(id => id.ToString("D")));
        using var result = await client.SendAsync(HttpMethod.Get, $"sirketler?id=in.({ids})&is_deleted=eq.false&select={CompanyColumns}&order=olusturma_tarihi.desc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<CompanyRow>(result.RootElement);
    }

    public async Task<CompanyRow?> GetCompanyAsync(Guid id, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"sirketler?id=eq.{id:D}&is_deleted=eq.false&select={CompanyColumns}&limit=1", null, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CompanyRow>(result.RootElement);
    }

    public async Task<List<CompanyRow>> ListPendingCompaniesAsync(string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"sirketler?dogrulama_durumu=eq.{CompanyVerificationStatus.Beklemede.ToDatabaseCode()}&is_deleted=eq.false&select={CompanyColumns}&order=olusturma_tarihi.asc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<CompanyRow>(result.RootElement);
    }

    public async Task<CompanyRow?> ReviewCompanyAsync(Guid id, CompanyVerificationStatus status, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"sirketler?id=eq.{id:D}&is_deleted=eq.false&select={CompanyColumns}", new { dogrulama_durumu = status.ToDatabaseCode() }, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CompanyRow>(result.RootElement);
    }

    public async Task<CompanyRow?> CreateCompanyAsync(Guid ownerId, CompanyValues values, string token, CancellationToken cancellationToken)
    {
        values.OwnerId = ownerId;
        using var result = await client.SendAsync(HttpMethod.Post, $"sirketler?select={CompanyColumns}", values, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CompanyRow>(result.RootElement);
    }

    public async Task<CompanyRow?> UpdateCompanyAsync(Guid id, Guid ownerId, CompanyValues values, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"sirketler?id=eq.{id:D}&sahip_kullanici_id=eq.{ownerId:D}&is_deleted=eq.false&select={CompanyColumns}", values, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CompanyRow>(result.RootElement);
    }

    public async Task<bool> ArchiveCompanyAsync(Guid id, Guid ownerId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"sirketler?id=eq.{id:D}&sahip_kullanici_id=eq.{ownerId:D}&is_deleted=eq.false&select=id", new { is_deleted = true }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }
}
