using CareerPath.Api.Dtos.Project;
using CareerPath.Api.Infrastructure.Supabase;
using ProjectEntity = CareerPath.Api.Entities.Project;

namespace CareerPath.Api.Repositories.Project;

public class ProjectRepository : IProjectRepository
{
    private const string Table = "projeler";
    private const string Columns = "id,aday_id,ad,aciklama,rol,teknolojiler,proje_url,kod_url,baslangic_tarihi,bitis_tarihi";
    private readonly CandidateRecordStore<ProjectEntity> store;

    public ProjectRepository(CandidateRecordStore<ProjectEntity> store)
    {
        this.store = store;
    }

    public async Task<List<ProjectEntity>> ListAsync(Guid candidateId, string token, CancellationToken cancellationToken)
    {
        return await store.ListAsync(Table, Columns, candidateId, token, cancellationToken);
    }

    public async Task<ProjectEntity?> CreateAsync(Guid candidateId, string token, ProjectRequest request, CancellationToken cancellationToken)
    {
        return await store.CreateAsync(Table, Columns, candidateId, token, Values(request), cancellationToken);
    }

    public async Task<ProjectEntity?> UpdateAsync(Guid candidateId, Guid id, string token, ProjectRequest request, CancellationToken cancellationToken)
    {
        return await store.UpdateAsync(Table, Columns, candidateId, id, token, Values(request), cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken)
    {
        return await store.DeleteAsync(Table, Columns, candidateId, id, token, cancellationToken);
    }

    private static Dictionary<string, object?> Values(ProjectRequest request)
    {
        return new Dictionary<string, object?>
        {
            ["ad"] = request.Name,
            ["aciklama"] = request.Description,
            ["rol"] = request.Role,
            ["teknolojiler"] = request.Technologies,
            ["proje_url"] = request.ProjectUrl,
            ["kod_url"] = request.CodeUrl,
            ["baslangic_tarihi"] = request.StartDate,
            ["bitis_tarihi"] = request.EndDate
        };
    }
}
