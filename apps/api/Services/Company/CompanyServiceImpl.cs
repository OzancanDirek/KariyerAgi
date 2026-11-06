using CareerPath.Api.Enums;
using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.Company;
using CareerPath.Api.Security;
using CareerPath.Api.Services.HiringAccess;
using CareerPath.Api.Validation;
using CareerPath.Api.Mappers;

namespace CareerPath.Api.Services.Company;

public class CompanyServiceImpl : ICompanyService
{
    private readonly CompanyRepository repository;
    private readonly HiringAccessService access;
    private readonly CurrentUserContextProvider currentUser;

    public CompanyServiceImpl(CompanyRepository repository, HiringAccessService access, CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.access = access;
        this.currentUser = currentUser;
    }

    public async Task<List<CompanyResponse>> GetCompaniesAsync()
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        var rows = await access.GetAccessibleCompaniesAsync(user);
        return rows.Select(RecruitmentMapper.ToResponse).ToList();
    }

    public async Task<CompanyResponse> CreateCompanyAsync(CompanyRequest request)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        var values = CompanyValidator.Normalize(request);
        var created = await repository.CreateCompanyAsync(user.UserId, values, user.AccessToken, currentUser.CancellationToken);
        return created is null ? throw new ApiException(ErrorCodes.CompanyOperationFailed) : RecruitmentMapper.ToResponse(created);
    }

    public async Task<CompanyResponse> UpdateCompanyAsync(Guid id, CompanyRequest request)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        await GetOwnedCompanyAsync(id, user);
        var updated = await repository.UpdateCompanyAsync(id, user.UserId, CompanyValidator.Normalize(request), user.AccessToken, currentUser.CancellationToken);
        return updated is null ? throw new ApiException(ErrorCodes.CompanyNotFound) : RecruitmentMapper.ToResponse(updated);
    }

    public async Task ArchiveCompanyAsync(Guid id)
    {
        var user = await access.RequireRoleAsync(AccountRole.Isveren);
        await GetOwnedCompanyAsync(id, user);
        if (!await repository.ArchiveCompanyAsync(id, user.UserId, user.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.CompanyNotFound);
        }
    }

    public async Task<List<CompanyResponse>> GetPendingCompaniesAsync()
    {
        var user = await access.RequireRoleAsync(AccountRole.Yonetici);
        var companies = await repository.ListPendingCompaniesAsync(user.AccessToken, currentUser.CancellationToken);
        return companies.Select(RecruitmentMapper.ToResponse).ToList();
    }

    public async Task<CompanyResponse> ReviewCompanyAsync(Guid id, bool approved)
    {
        var user = await access.RequireRoleAsync(AccountRole.Yonetici);
        var company = await repository.GetCompanyAsync(id, user.AccessToken, currentUser.CancellationToken);
        if (company is null || company.VerificationStatus != CompanyVerificationStatus.Beklemede.ToDatabaseCode())
        {
            throw new ApiException(ErrorCodes.CompanyNotFound);
        }
        var status = approved ? CompanyVerificationStatus.Onaylandi : CompanyVerificationStatus.Reddedildi;
        var updated = await repository.ReviewCompanyAsync(id, status, user.AccessToken, currentUser.CancellationToken);
        return updated is null ? throw new ApiException(ErrorCodes.CompanyOperationFailed) : RecruitmentMapper.ToResponse(updated);
    }

    private async Task<CompanyRow> GetOwnedCompanyAsync(Guid id, CurrentUserContext user)
    {
        var company = await repository.GetCompanyAsync(id, user.AccessToken, currentUser.CancellationToken);
        if (company is null || company.OwnerId != user.UserId)
        {
            throw new ApiException(ErrorCodes.CompanyNotFound);
        }
        return company;
    }

}
