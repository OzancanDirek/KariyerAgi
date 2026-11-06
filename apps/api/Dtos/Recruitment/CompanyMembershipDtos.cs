using System.Text.Json.Serialization;

namespace CareerPath.Api.Dtos.Recruitment;

public class InviteCompanyMemberRequest
{
    public string Email { get; set; } = string.Empty;
}

public class CompanyMembershipResponse
{
    public Guid Id { get; set; }
    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class CompanyMembershipRow
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("sirket_id")] public Guid CompanyId { get; set; }
    [JsonPropertyName("kullanici_id")] public Guid UserId { get; set; }
    [JsonPropertyName("gorev")] public string Role { get; set; } = string.Empty;
    [JsonPropertyName("durum")] public string Status { get; set; } = string.Empty;
    [JsonPropertyName("sirketler")] public JobCompanyRow? Company { get; set; }

    public CompanyMembershipResponse ToResponse()
    {
        return new CompanyMembershipResponse
        {
            Id = Id,
            CompanyId = CompanyId,
            CompanyName = Company?.Name ?? string.Empty,
            Role = Role,
            Status = Status
        };
    }
}
