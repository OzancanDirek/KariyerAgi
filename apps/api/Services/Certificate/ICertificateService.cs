using CareerPath.Api.Dtos.Certificate;

namespace CareerPath.Api.Services.Certificate;

public interface ICertificateService
{
    Task<List<CertificateResponse>> ListAsync();
    Task<CertificateResponse> CreateAsync(CertificateRequest request);
    Task<CertificateResponse> UpdateAsync(Guid id, CertificateRequest request);
    Task DeleteAsync(Guid id);
    Task<CertificateResponse> UploadDocumentAsync(Guid id, IFormFile? file);
    Task<CertificateDocument> DownloadDocumentAsync(Guid id);
    Task<CertificateResponse> DeleteDocumentAsync(Guid id);
}
