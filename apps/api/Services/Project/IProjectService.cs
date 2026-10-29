using CareerPath.Api.Dtos.Project;

namespace CareerPath.Api.Services.Project;

public interface IProjectService
{
    Task<List<ProjectResponse>> ListAsync();
    Task<ProjectResponse> CreateAsync(ProjectRequest request);
    Task<ProjectResponse> UpdateAsync(Guid id, ProjectRequest request);
    Task DeleteAsync(Guid id);
}
