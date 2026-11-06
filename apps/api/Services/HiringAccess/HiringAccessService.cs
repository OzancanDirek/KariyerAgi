using CareerPath.Api.Enums;
using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.Role;
using CareerPath.Api.Repositories.Company;
using CareerPath.Api.Repositories.Job;
using CareerPath.Api.Repositories.CompanyMembership;
using CareerPath.Api.Security;

namespace CareerPath.Api.Services.HiringAccess;

public class HiringAccessService
{
    private readonly RoleRepository roles;
    private readonly CompanyRepository companies;
    private readonly JobRepository jobs;
    private readonly CompanyMembershipRepository memberships;
    private readonly CurrentUserContextProvider currentUser;

    public HiringAccessService(RoleRepository roles, CompanyRepository companies, JobRepository jobs, CompanyMembershipRepository memberships, CurrentUserContextProvider currentUser)
    {
        this.roles = roles;
        this.companies = companies;
        this.jobs = jobs;
        this.memberships = memberships;
        this.currentUser = currentUser;
    }

    public async Task<CurrentUserContext> RequireRoleAsync(AccountRole role)
    {
        var user = await currentUser.ResolveAsync();
        if (!await roles.HasRoleAsync(user.UserId, role, user.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.RecruitmentForbidden);
        }
        return user;
    }

    public async Task<List<CompanyRow>> GetAccessibleCompaniesAsync(CurrentUserContext user)
    {
        var rows = await memberships.ListForUserAsync(user.UserId, user.AccessToken, currentUser.CancellationToken);
        var ids = rows.Where(row => row.Status == "aktif").Select(row => row.CompanyId).Distinct().ToList();
        return await companies.ListCompaniesByIdsAsync(ids, user.AccessToken, currentUser.CancellationToken);
    }

    public async Task<CompanyRow> GetAccessibleCompanyAsync(Guid id, CurrentUserContext user)
    {
        var companies = await GetAccessibleCompaniesAsync(user);
        return companies.FirstOrDefault(company => company.Id == id) ?? throw new ApiException(ErrorCodes.CompanyNotFound);
    }

    public async Task<JobRow> GetAccessibleJobAsync(Guid id, CurrentUserContext user)
    {
        var job = await jobs.GetJobAsync(id, user.AccessToken, currentUser.CancellationToken);
        if (job is null)
        {
            throw new ApiException(ErrorCodes.JobNotFound);
        }
        await GetAccessibleCompanyAsync(job.CompanyId, user);
        return job;
    }
}
