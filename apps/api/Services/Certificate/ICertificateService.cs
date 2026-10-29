using CareerPath.Api.Dtos.Certificate;

namespace CareerPath.Api.Services.Certificate;

public interface ICertificateService
{
    Task<List<CertificateResponse>> GetCertificatesAsync();
    Task<CertificateResponse> CreateCertificateAsync(CertificateRequest request);
    Task<CertificateResponse> UpdateCertificateAsync(Guid id, CertificateRequest request);
    Task DeleteCertificateAsync(Guid id);
    Task<CertificateResponse> UploadCertificateDocumentAsync(Guid id, IFormFile? file);
    Task<CertificateDocument> DownloadCertificateDocumentAsync(Guid id);
    Task<CertificateResponse> DeleteCertificateDocumentAsync(Guid id);
}
