namespace CareerPath.Api.Dtos.Certificate;

public class CertificateRequest
{
    public string? Name { get; set; }
    public string? Issuer { get; set; }
    public DateOnly? IssueDate { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public string? CredentialId { get; set; }
    public string? VerificationUrl { get; set; }
}
