namespace CareerPath.Api.Dtos.Profile;

public class UpdateProfileRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Phone { get; set; }
    public string? Location { get; set; }
    public string? PhotoUrl { get; set; }
}
