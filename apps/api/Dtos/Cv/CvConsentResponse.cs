namespace CareerPath.Api.Dtos.Cv;

public class CvConsentResponse
{
    public Guid? TextId { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public int? Version { get; set; }
    public bool Granted { get; set; }
}
