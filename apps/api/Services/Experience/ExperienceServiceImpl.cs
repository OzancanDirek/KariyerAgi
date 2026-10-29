using CareerPath.Api.Dtos.Experience;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.Experience;
using CareerPath.Api.Security;
using CareerPath.Api.Validation;
using CareerPath.Api.Mappers;

namespace CareerPath.Api.Services.Experience;

public class ExperienceServiceImpl : IExperienceService
{
    private readonly IExperienceRepository repository;
    private readonly CurrentUserContextProvider currentUser;

    public ExperienceServiceImpl(IExperienceRepository repository, CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.currentUser = currentUser;
    }

    public async Task<List<ExperienceResponse>> GetExperiencesAsync()
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var records = await repository.ListAsync(identity.UserId, identity.AccessToken, cancellationToken);
        return records.Select(ExperienceMapper.ToResponse).ToList();
    }

    public async Task<ExperienceResponse> CreateExperienceAsync(ExperienceRequest request)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var created = await repository.CreateAsync(identity.UserId, identity.AccessToken, ExperienceValidator.Normalize(request), cancellationToken);
        if (created is null)
        {
            throw new ApiException(ErrorCodes.ExperienceOperationFailed);
        }
        return ExperienceMapper.ToResponse(created);
    }

    public async Task<ExperienceResponse> UpdateExperienceAsync(Guid id, ExperienceRequest request)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var updated = await repository.UpdateAsync(identity.UserId, id, identity.AccessToken, ExperienceValidator.Normalize(request), cancellationToken);
        if (updated is null)
        {
            throw new ApiException(ErrorCodes.ExperienceNotFound);
        }
        return ExperienceMapper.ToResponse(updated);
    }

    public async Task DeleteExperienceAsync(Guid id)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        if (!await repository.DeleteAsync(identity.UserId, id, identity.AccessToken, cancellationToken))
        {
            throw new ApiException(ErrorCodes.ExperienceNotFound);
        }
    }
}
