using CareerPath.Api.Enums;
using System.Net.Mail;
using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.Company;
using CareerPath.Api.Repositories.CompanyMembership;
using CareerPath.Api.Services.HiringAccess;
using CareerPath.Api.Security;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Services.CompanyMembership;

public class CompanyMembershipServiceImpl : ICompanyMembershipService
{
    private readonly CompanyMembershipRepository repository;
    private readonly CompanyRepository companies;
    private readonly CurrentUserContextProvider currentUser;
    private readonly HiringAccessService access;

    public CompanyMembershipServiceImpl(CompanyMembershipRepository repository, CompanyRepository companies, CurrentUserContextProvider currentUser, HiringAccessService access)
    {
        this.repository = repository;
        this.companies = companies;
        this.currentUser = currentUser;
        this.access = access;
    }

    public async Task<List<CompanyMembershipResponse>> GetMyMembershipsAsync()
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        var rows = await repository.ListForUserAsync(user.UserId, user.AccessToken, currentUser.CancellationToken);
        return rows.Select(row => row.ToResponse()).ToList();
    }

    public async Task<List<CompanyMembershipResponse>> GetCompanyMembersAsync(Guid companyId)
    {
        var user = await RequireOwnerAsync(companyId);
        var rows = await repository.ListForCompanyAsync(companyId, user.AccessToken, currentUser.CancellationToken);
        return rows.Select(row => row.ToResponse()).ToList();
    }

    public async Task InviteAsync(Guid companyId, InviteCompanyMemberRequest request)
    {
        var user = await RequireOwnerAsync(companyId);
        var email = StringUtils.TrimRequired(request.Email, ErrorCodes.InvalidEmail);
        if (!MailAddress.TryCreate(email, out var parsed) || parsed.Address != email)
        {
            throw new ApiException(ErrorCodes.InvalidEmail);
        }
        await repository.InviteAsync(companyId, email, user.AccessToken, currentUser.CancellationToken);
    }

    public async Task AcceptAsync(Guid membershipId)
    {
        await RespondAsync(membershipId, "aktif");
    }

    public async Task DeclineAsync(Guid membershipId)
    {
        await RespondAsync(membershipId, "reddedildi");
    }

    public async Task RemoveAsync(Guid companyId, Guid membershipId)
    {
        var user = await RequireOwnerAsync(companyId);
        if (!await repository.RemoveAsync(membershipId, companyId, user.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.CompanyMemberNotFound);
        }
    }

    private async Task RespondAsync(Guid membershipId, string status)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        if (!await repository.RespondAsync(membershipId, user.UserId, status, user.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.CompanyMemberNotFound);
        }
    }

    private async Task<CurrentUserContext> RequireOwnerAsync(Guid companyId)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        var company = await companies.GetCompanyAsync(companyId, user.AccessToken, currentUser.CancellationToken);
        if (company is null || company.OwnerId != user.UserId)
        {
            throw new ApiException(ErrorCodes.CompanyNotFound);
        }
        return user;
    }

}
