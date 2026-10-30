using System.Text.Json.Serialization;

namespace CareerPath.Api.Entities;

public class SystemUser
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("ad")]
    public string FirstName { get; set; } = string.Empty;

    [JsonPropertyName("soyad")]
    public string LastName { get; set; } = string.Empty;

    [JsonPropertyName("eposta")]
    public string? Email { get; set; }

    [JsonPropertyName("telefon")]
    public string? Phone { get; set; }

    [JsonPropertyName("konum")]
    public string? Location { get; set; }

    [JsonPropertyName("profil_fotografi_url")]
    public string? PhotoUrl { get; set; }

    [JsonPropertyName("profil_fotografi_yolu")]
    public string? PhotoPath { get; set; }
}
