using CareerPath.Api.Dtos.Project;
using ProjectEntity = CareerPath.Api.Entities.Project;

namespace CareerPath.Api.Repositories.Project;

public interface IProjectRepository
{
    Task<List<ProjectEntity>> ListAsync(Guid candidateId, string token, CancellationToken cancellationToken);
    Task<ProjectEntity?> CreateAsync(Guid candidateId, string token, ProjectRequest request, CancellationToken cancellationToken);
    Task<ProjectEntity?> UpdateAsync(Guid candidateId, Guid id, string token, ProjectRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken);
}
