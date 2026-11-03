using CareerPath.Api.Dtos.CvDraft;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.CvDraft;

public class CvDraftRepository
{
    private const string Table = "cv_taslaklari";
    private const string Columns = "id,aday_id,ad,sablon,icerik,guncelleme_tarihi";
    private readonly CandidateRecordStore<Entities.CvDraft> store;

    public CvDraftRepository(CandidateRecordStore<Entities.CvDraft> store)
    {
        this.store = store;
    }

    public async Task<List<Entities.CvDraft>> ListAsync(Guid candidateId, string token, CancellationToken cancellationToken)
    {
        return await store.ListAsync(Table, Columns, candidateId, token, cancellationToken, "guncelleme_tarihi");
    }

    public async Task<Entities.CvDraft?> CreateAsync(Guid candidateId, string token, CvDraftRequest request, CancellationToken cancellationToken)
    {
        return await store.CreateAsync(Table, Columns, candidateId, token, Values(request), cancellationToken);
    }

    public async Task<Entities.CvDraft?> UpdateAsync(Guid candidateId, Guid id, string token, CvDraftRequest request, CancellationToken cancellationToken)
    {
        return await store.UpdateAsync(Table, Columns, candidateId, id, token, Values(request), cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken)
    {
        return await store.DeleteAsync(Table, Columns, candidateId, id, token, cancellationToken);
    }

    private static Dictionary<string, object?> Values(CvDraftRequest request)
    {
        return new Dictionary<string, object?>
        {
            ["ad"] = request.Name,
            ["sablon"] = request.Template,
            ["icerik"] = request.Content,
            ["guncelleme_tarihi"] = DateTimeOffset.UtcNow
        };
    }
}
