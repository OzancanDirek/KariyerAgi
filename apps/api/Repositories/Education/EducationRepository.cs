using CareerPath.Api.Dtos.Education;
using CareerPath.Api.Infrastructure.Supabase;
using EducationEntity = CareerPath.Api.Entities.Education;

namespace CareerPath.Api.Repositories.Education;

public class EducationRepository : IEducationRepository
{
    private const string Table = "egitimler";
    private const string Columns = "id,aday_id,kurum,derece,bolum,baslangic_tarihi,bitis_tarihi,not_ortalamasi,not_olcegi,aciklama";
    private readonly CandidateRecordStore<EducationEntity> store;

    public EducationRepository(CandidateRecordStore<EducationEntity> store)
    {
        this.store = store;
    }

    public async Task<List<EducationEntity>> ListAsync(Guid candidateId, string token, CancellationToken cancellationToken)
    {
        return await store.ListAsync(Table, Columns, candidateId, token, cancellationToken);
    }

    public async Task<EducationEntity?> CreateAsync(Guid candidateId, string token, EducationRequest request, CancellationToken cancellationToken)
    {
        return await store.CreateAsync(Table, Columns, candidateId, token, Values(request), cancellationToken);
    }

    public async Task<EducationEntity?> UpdateAsync(Guid candidateId, Guid id, string token, EducationRequest request, CancellationToken cancellationToken)
    {
        return await store.UpdateAsync(Table, Columns, candidateId, id, token, Values(request), cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken)
    {
        return await store.DeleteAsync(Table, Columns, candidateId, id, token, cancellationToken);
    }

    private static Dictionary<string, object?> Values(EducationRequest request)
    {
        return new Dictionary<string, object?>
        {
            ["kurum"] = request.Institution,
            ["derece"] = request.Degree,
            ["bolum"] = request.FieldOfStudy,
            ["baslangic_tarihi"] = request.StartDate,
            ["bitis_tarihi"] = request.EndDate,
            ["not_ortalamasi"] = request.GradeAverage,
            ["not_olcegi"] = request.GradeScale,
            ["aciklama"] = request.Description
        };
    }
}
