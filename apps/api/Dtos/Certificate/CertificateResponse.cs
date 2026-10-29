namespace CareerPath.Api.Dtos.Certificate;

public class CertificateResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public DateOnly? IssueDate { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public string? CredentialId { get; set; }
    public string? VerificationUrl { get; set; }
    public string? DocumentFileName { get; set; }
    public bool HasDocument { get; set; }
}
