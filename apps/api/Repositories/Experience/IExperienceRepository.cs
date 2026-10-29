using CareerPath.Api.Entities;
using CareerPath.Api.Dtos.Experience;

namespace CareerPath.Api.Repositories.Experience;

public interface IExperienceRepository
{
    Task<List<Entities.Experience>> ListAsync(Guid candidateId, string token, CancellationToken cancellationToken);
    Task<Entities.Experience?> CreateAsync(Guid candidateId, string token, ExperienceRequest request, CancellationToken cancellationToken);
    Task<Entities.Experience?> UpdateAsync(Guid candidateId, Guid id, string token, ExperienceRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken);
}
