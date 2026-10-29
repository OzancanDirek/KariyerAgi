using CareerPath.Api.Dtos.Certificate;
using CareerPath.Api.Infrastructure.Supabase;
using CertificateEntity = CareerPath.Api.Entities.Certificate;

namespace CareerPath.Api.Repositories.Certificate;

public class CertificateRepository : ICertificateRepository
{
    private const string Table = "sertifikalar";
    private const string Columns = "id,aday_id,ad,veren_kurum,verilis_tarihi,gecerlilik_bitis_tarihi,sertifika_no,dogrulama_url,belge_yolu,belge_dosya_adi";
    private readonly CandidateRecordStore<CertificateEntity> store;

    public CertificateRepository(CandidateRecordStore<CertificateEntity> store)
    {
        this.store = store;
    }

    public async Task<List<CertificateEntity>> ListAsync(Guid candidateId, string token, CancellationToken cancellationToken)
    {
        return await store.ListAsync(Table, Columns, candidateId, token, cancellationToken);
    }

    public async Task<CertificateEntity?> GetAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken)
    {
        return await store.GetAsync(Table, Columns, candidateId, id, token, cancellationToken);
    }

    public async Task<CertificateEntity?> CreateAsync(Guid candidateId, string token, CertificateRequest request, CancellationToken cancellationToken)
    {
        return await store.CreateAsync(Table, Columns, candidateId, token, Values(request), cancellationToken);
    }

    public async Task<CertificateEntity?> UpdateAsync(Guid candidateId, Guid id, string token, CertificateRequest request, CancellationToken cancellationToken)
    {
        return await store.UpdateAsync(Table, Columns, candidateId, id, token, Values(request), cancellationToken);
    }

    public async Task<CertificateEntity?> UpdateDocumentAsync(Guid candidateId, Guid id, string token, string? path, string? fileName, CancellationToken cancellationToken)
    {
        var values = new Dictionary<string, object?> { ["belge_yolu"] = path, ["belge_dosya_adi"] = fileName };
        return await store.UpdateAsync(Table, Columns, candidateId, id, token, values, cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken)
    {
        return await store.DeleteAsync(Table, Columns, candidateId, id, token, cancellationToken);
    }

    private static Dictionary<string, object?> Values(CertificateRequest request)
    {
        return new Dictionary<string, object?>
        {
            ["ad"] = request.Name,
            ["veren_kurum"] = request.Issuer,
            ["verilis_tarihi"] = request.IssueDate,
            ["gecerlilik_bitis_tarihi"] = request.ExpiryDate,
            ["sertifika_no"] = request.CredentialId,
            ["dogrulama_url"] = request.VerificationUrl
        };
    }
}
