namespace CareerPath.Api.Dtos.Profile;

public class ProfilePhoto
{
    public byte[] Bytes { get; set; } = [];
    public string ContentType { get; set; } = "application/octet-stream";
}
