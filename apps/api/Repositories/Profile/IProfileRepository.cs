using CareerPath.Api.Entities;

namespace CareerPath.Api.Repositories.Profile;

public interface IProfileRepository
{
    Task<SystemUser?> GetByIdAsync(Guid userId, string accessToken, CancellationToken cancellationToken);
    Task<SystemUser?> UpdateAsync(Guid userId, string accessToken, SystemUser profile, CancellationToken cancellationToken);
    Task<SystemUser?> UpdatePhotoAsync(Guid userId, string accessToken, string? path, CancellationToken cancellationToken);
}
