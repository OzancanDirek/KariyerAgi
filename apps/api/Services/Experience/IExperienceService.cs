using CareerPath.Api.Dtos.Experience;
using CareerPath.Api.Entities;

namespace CareerPath.Api.Services.Experience;

public interface IExperienceService
{
    Task<List<ExperienceResponse>> GetExperiencesAsync();
    Task<ExperienceResponse> CreateExperienceAsync(ExperienceRequest request);
    Task<ExperienceResponse> UpdateExperienceAsync(Guid id, ExperienceRequest request);
    Task DeleteExperienceAsync(Guid id);
}
