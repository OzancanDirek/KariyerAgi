using CareerPath.Api.Dtos.Project;

namespace CareerPath.Api.Services.Project;

public interface IProjectService
{
    Task<List<ProjectResponse>> GetProjectsAsync();
    Task<ProjectResponse> CreateProjectAsync(ProjectRequest request);
    Task<ProjectResponse> UpdateProjectAsync(Guid id, ProjectRequest request);
    Task DeleteProjectAsync(Guid id);
}
