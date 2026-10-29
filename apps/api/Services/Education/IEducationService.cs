using CareerPath.Api.Dtos.Education;
using EducationEntity = CareerPath.Api.Entities.Education;

namespace CareerPath.Api.Services.Education;

public interface IEducationService
{
    Task<List<EducationResponse>> GetEducationsAsync();
    Task<EducationResponse> CreateEducationAsync(EducationRequest request);
    Task<EducationResponse> UpdateEducationAsync(Guid id, EducationRequest request);
    Task DeleteEducationAsync(Guid id);
}
