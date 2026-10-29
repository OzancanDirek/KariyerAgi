using CareerPath.Api.Dtos.Experience;
using CareerPath.Api.Entities;

namespace CareerPath.Api.Services.Experience;

public interface IExperienceService
{
    Task<List<ExperienceResponse>> ListAsync();
    Task<ExperienceResponse> CreateAsync(ExperienceRequest request);
    Task<ExperienceResponse> UpdateAsync(Guid id, ExperienceRequest request);
    Task DeleteAsync(Guid id);
}
