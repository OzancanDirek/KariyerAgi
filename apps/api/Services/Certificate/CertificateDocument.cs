namespace CareerPath.Api.Services.Certificate;

public class CertificateDocument
{
    public byte[] Bytes { get; set; } = Array.Empty<byte>();
    public string ContentType { get; set; } = "application/octet-stream";
    public string FileName { get; set; } = "sertifika";
}
