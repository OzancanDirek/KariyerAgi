using CareerPath.Api.Dtos.Project;
using CareerPath.Api.Entities;

namespace CareerPath.Api.Mappers;

public static class ProjectMapper
{
    public static ProjectResponse ToResponse(Project project)
    {
        return new ProjectResponse
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            Role = project.Role,
            Technologies = project.Technologies,
            ProjectUrl = project.ProjectUrl,
            CodeUrl = project.CodeUrl,
            StartDate = project.StartDate,
            EndDate = project.EndDate
        };
    }
}
