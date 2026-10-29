using CareerPath.Api.Dtos.Certificate;
using CertificateEntity = CareerPath.Api.Entities.Certificate;

namespace CareerPath.Api.Repositories.Certificate;

public interface ICertificateRepository
{
    Task<List<CertificateEntity>> ListAsync(Guid candidateId, string token, CancellationToken cancellationToken);
    Task<CertificateEntity?> GetAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken);
    Task<CertificateEntity?> CreateAsync(Guid candidateId, string token, CertificateRequest request, CancellationToken cancellationToken);
    Task<CertificateEntity?> UpdateAsync(Guid candidateId, Guid id, string token, CertificateRequest request, CancellationToken cancellationToken);
    Task<CertificateEntity?> UpdateDocumentAsync(Guid candidateId, Guid id, string token, string? path, string? fileName, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid candidateId, Guid id, string token, CancellationToken cancellationToken);
}
