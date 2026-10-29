using CareerPath.Api.Entities;

namespace CareerPath.Api.Repositories.CareerProfile;

public interface ICareerProfileRepository
{
    Task<CandidateProfile?> GetByIdAsync(Guid userId, string accessToken, CancellationToken cancellationToken);
    Task<CandidateProfile?> UpdateAsync(Guid userId, string accessToken, CandidateProfile profile, CancellationToken cancellationToken);
}
