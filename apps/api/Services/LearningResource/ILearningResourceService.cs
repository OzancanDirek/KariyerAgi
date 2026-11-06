using CareerPath.Api.Dtos.LearningResource;

namespace CareerPath.Api.Services.LearningResource;

public interface ILearningResourceService
{
    Task<List<LearningResourceResponse>> ListAsync();
    Task<List<LearningResourceResponse>> ListForManagementAsync();
    Task<LearningResourceResponse> CreateAsync(SaveLearningResourceRequest request);
    Task<LearningResourceResponse> UpdateAsync(Guid id, SaveLearningResourceRequest request);
}
