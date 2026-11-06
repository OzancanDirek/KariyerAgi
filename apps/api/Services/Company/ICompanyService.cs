using CareerPath.Api.Dtos.Recruitment;

namespace CareerPath.Api.Services.Company;

public interface ICompanyService
{
Task<List<CompanyResponse>> GetCompaniesAsync();
    Task<CompanyResponse> CreateCompanyAsync(CompanyRequest request);
    Task<CompanyResponse> UpdateCompanyAsync(Guid id, CompanyRequest request);
    Task ArchiveCompanyAsync(Guid id);
    Task<List<CompanyResponse>> GetPendingCompaniesAsync();
    Task<CompanyResponse> ReviewCompanyAsync(Guid id, bool approved);
}
