using CareerPath.Api.Dtos.Education;
using EducationEntity = CareerPath.Api.Entities.Education;

namespace CareerPath.Api.Services.Education;

public interface IEducationService
{
    Task<List<EducationResponse>> ListAsync();
    Task<EducationResponse> CreateAsync(EducationRequest request);
    Task<EducationResponse> UpdateAsync(Guid id, EducationRequest request);
    Task DeleteAsync(Guid id);
}
