using CareerPath.Api.Dtos.Experience;
using CareerPath.Api.Infrastructure.Supabase;
using ExperienceEntity = CareerPath.Api.Entities.Experience;

namespace CareerPath.Api.Repositories.Experience;

public class ExperienceRepository : IExperienceRepository
{
    private const string Table = "deneyimler";
    private const string Columns = "id,aday_id,pozisyon,sirket_adi,calisma_tipi,calisma_modeli,konum,baslangic_tarihi,bitis_tarihi,aciklama";
    private readonly CandidateRecordStore<ExperienceEntity> store;

    public ExperienceRepository(CandidateRecordStore<ExperienceEntity> store)
    {
        this.store = store;
    }

    public async Task<List<ExperienceEntity>> ListAsync(Guid candidateId, string token, CancellationToken cancellationToken)
    {
        return await store.ListAsync(Table, Columns, candidateId, token, cancellationToken);
    }

    public async Task<ExperienceEntity?> CreateAsync(Guid candidateId, string token, ExperienceRequest request, CancellationToken cancellationToken)
    {
        return await store.CreateAsync(Table, Columns, candidateId, token, Values(request), cancellationToken);
    }

    public async Task<ExperienceEntity?> UpdateAsync(Guid candidateId, Guid id, string token, ExperienceRequest request, CancellationToken cancellationToken)
    {
        return await store.UpdateAsync(Table, Columns, candidateId, id, token, Values(request), cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken)
    {
        return await store.DeleteAsync(Table, Columns, candidateId, id, token, cancellationToken);
    }

    private static Dictionary<string, object?> Values(ExperienceRequest request)
    {
        return new Dictionary<string, object?>
        {
            ["pozisyon"] = request.Position,
            ["sirket_adi"] = request.Company,
            ["calisma_tipi"] = request.EmploymentType,
            ["calisma_modeli"] = request.WorkModel,
            ["konum"] = request.Location,
            ["baslangic_tarihi"] = request.StartDate,
            ["bitis_tarihi"] = request.EndDate,
            ["aciklama"] = request.Description
        };
    }
}
