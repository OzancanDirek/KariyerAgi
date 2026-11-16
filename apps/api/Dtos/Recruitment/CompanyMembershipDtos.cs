using System.Text.Json.Serialization;

namespace CareerPath.Api.Dtos.Recruitment;

public class InviteCompanyMemberRequest
{
    public string Email { get; set; } = string.Empty;
}

public sealed record TransferCompanyOwnershipRequest(Guid MembershipId);

public class CompanyMembershipResponse
{
    public Guid Id { get; set; }
    public Guid CompanyId { get; set; }
    public Guid UserId { get; set; }
    public string? MemberName { get; set; }
    public string? MemberEmail { get; set; }
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
    [JsonPropertyName("uye_adi")] public string? MemberName { get; set; }
    [JsonPropertyName("uye_eposta")] public string? MemberEmail { get; set; }
    [JsonPropertyName("sirketler")] public JobCompanyRow? Company { get; set; }

    public CompanyMembershipResponse ToResponse()
    {
        return new CompanyMembershipResponse
        {
            Id = Id,
            CompanyId = CompanyId,
            UserId = UserId,
            MemberName = MemberName,
            MemberEmail = MemberEmail,
            CompanyName = Company?.Name ?? string.Empty,
            Role = Role,
            Status = Status
        };
    }
}
