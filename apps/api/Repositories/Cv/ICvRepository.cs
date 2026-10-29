using CareerPath.Api.Entities;

namespace CareerPath.Api.Repositories.Cv;

public interface ICvRepository
{
    Task<List<CvFile>> ListAsync(Guid candidateId, string token, CancellationToken cancellationToken);
    Task<CvFile?> GetAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken);
    Task<CvFile?> CreateAsync(Guid candidateId, string path, string fileName, string token, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken);
    Task<bool> SetPrimaryAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken);
    Task<ConsentText?> GetCurrentConsentTextAsync(string token, CancellationToken cancellationToken);
    Task<bool> HasConsentAsync(Guid userId, Guid textId, string token, CancellationToken cancellationToken);
    Task GrantConsentAsync(Guid textId, string token, CancellationToken cancellationToken);
}
