using CareerPath.Api.Dtos.Recruitment;

namespace CareerPath.Api.Services.CompanyMembership;

public interface ICompanyMembershipService
{
    Task<List<CompanyMembershipResponse>> GetMyMembershipsAsync();
    Task<List<CompanyMembershipResponse>> GetCompanyMembersAsync(Guid companyId);
    Task InviteAsync(Guid companyId, InviteCompanyMemberRequest request);
    Task AcceptAsync(Guid membershipId);
    Task DeclineAsync(Guid membershipId);
    Task RemoveAsync(Guid companyId, Guid membershipId);
}
