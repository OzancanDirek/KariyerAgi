using CareerPath.Api.Entities;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.Cv;

public class CvRepository : ICvRepository
{
    private const string Columns = "id,aday_id,depolama_yolu,orijinal_dosya_adi,mime_tipi,boyut_bayt,birincil_mi,olusturma_tarihi";
    private readonly SupabaseRestClient client;

    public CvRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<List<CvFile>> ListAsync(Guid candidateId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"cv_dosyalari?aday_id=eq.{candidateId:D}&select={Columns}&order=olusturma_tarihi.desc,id.desc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<CvFile>(result.RootElement);
    }

    public async Task<CvFile?> GetAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"cv_dosyalari?id=eq.{id:D}&aday_id=eq.{candidateId:D}&select={Columns}", null, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CvFile>(result.RootElement);
    }

    public async Task<CvFile?> CreateAsync(Guid candidateId, string path, string fileName, string token, CancellationToken cancellationToken)
    {
        var body = new Dictionary<string, object?> { ["aday_id"] = candidateId, ["depolama_yolu"] = path, ["orijinal_dosya_adi"] = fileName };
        using var result = await client.SendAsync(HttpMethod.Post, $"cv_dosyalari?select={Columns}", body, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CvFile>(result.RootElement);
    }

    public async Task<bool> DeleteAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Delete, $"cv_dosyalari?id=eq.{id:D}&aday_id=eq.{candidateId:D}&select=id", null, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    public async Task<bool> SetPrimaryAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"cv_dosyalari?id=eq.{id:D}&aday_id=eq.{candidateId:D}&select=id", new { birincil_mi = true }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    public async Task<ConsentText?> GetCurrentConsentTextAsync(string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, "guncel_riza_metinleri?tur=eq.acik_riza_yurt_disi_aktarim&select=id,baslik,icerik,surum", null, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<ConsentText>(result.RootElement);
    }

    public async Task<bool> HasConsentAsync(Guid userId, Guid textId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"riza_kayitlari?kullanici_id=eq.{userId:D}&riza_metni_id=eq.{textId:D}&geri_alinma_tarihi=is.null&select=id", null, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    public async Task GrantConsentAsync(Guid textId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "rpc/riza_ver", new { p_riza_metni_id = textId }, token, cancellationToken);
    }
}
