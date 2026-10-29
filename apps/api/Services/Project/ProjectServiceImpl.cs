using CareerPath.Api.Dtos.Project;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Mappers;
using CareerPath.Api.Repositories.Project;
using CareerPath.Api.Security;
using CareerPath.Api.Validation;

namespace CareerPath.Api.Services.Project;

public class ProjectServiceImpl : IProjectService
{
    private readonly IProjectRepository repository;
    private readonly CurrentUserContextProvider currentUser;

    public ProjectServiceImpl(IProjectRepository repository, CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.currentUser = currentUser;
    }

    public async Task<List<ProjectResponse>> ListAsync()
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var records = await repository.ListAsync(identity.UserId, identity.AccessToken, cancellationToken);
        return records.Select(ProjectMapper.ToResponse).ToList();
    }

    public async Task<ProjectResponse> CreateAsync(ProjectRequest request)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var created = await repository.CreateAsync(identity.UserId, identity.AccessToken, ProjectValidator.Normalize(request), cancellationToken);
        if (created is null)
        {
            throw new ApiException(ErrorCodes.ProjectOperationFailed);
        }
        return ProjectMapper.ToResponse(created);
    }

    public async Task<ProjectResponse> UpdateAsync(Guid id, ProjectRequest request)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var updated = await repository.UpdateAsync(identity.UserId, id, identity.AccessToken, ProjectValidator.Normalize(request), cancellationToken);
        if (updated is null)
        {
            throw new ApiException(ErrorCodes.ProjectNotFound);
        }
        return ProjectMapper.ToResponse(updated);
    }

    public async Task DeleteAsync(Guid id)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        if (!await repository.DeleteAsync(identity.UserId, id, identity.AccessToken, cancellationToken))
        {
            throw new ApiException(ErrorCodes.ProjectNotFound);
        }
    }
}
