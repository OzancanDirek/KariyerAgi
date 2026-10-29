using CareerPath.Api.Dtos.Certificate;
using CareerPath.Api.Entities;

namespace CareerPath.Api.Mappers;

public static class CertificateMapper
{
    public static CertificateResponse ToResponse(Certificate certificate)
    {
        return new CertificateResponse
        {
            Id = certificate.Id,
            Name = certificate.Name,
            Issuer = certificate.Issuer,
            IssueDate = certificate.IssueDate,
            ExpiryDate = certificate.ExpiryDate,
            CredentialId = certificate.CredentialId,
            VerificationUrl = certificate.VerificationUrl,
            DocumentFileName = certificate.DocumentFileName,
            HasDocument = certificate.DocumentPath is not null
        };
    }
}
