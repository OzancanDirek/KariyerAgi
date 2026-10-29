using CareerPath.Api.Dtos.Education;
using EducationEntity = CareerPath.Api.Entities.Education;

namespace CareerPath.Api.Repositories.Education;

public interface IEducationRepository
{
    Task<List<EducationEntity>> ListAsync(Guid candidateId, string token, CancellationToken cancellationToken);
    Task<EducationEntity?> CreateAsync(Guid candidateId, string token, EducationRequest request, CancellationToken cancellationToken);
    Task<EducationEntity?> UpdateAsync(Guid candidateId, Guid id, string token, EducationRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken);
}
