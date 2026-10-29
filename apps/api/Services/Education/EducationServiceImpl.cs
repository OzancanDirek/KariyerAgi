using CareerPath.Api.Dtos.Education;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.Education;
using CareerPath.Api.Security;
using CareerPath.Api.Validation;
using CareerPath.Api.Mappers;
using EducationEntity = CareerPath.Api.Entities.Education;

namespace CareerPath.Api.Services.Education;

public class EducationServiceImpl : IEducationService
{
    private readonly IEducationRepository repository;
    private readonly CurrentUserContextProvider currentUser;

    public EducationServiceImpl(IEducationRepository repository, CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.currentUser = currentUser;
    }

    public async Task<List<EducationResponse>> ListAsync()
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var records = await repository.ListAsync(identity.UserId, identity.AccessToken, cancellationToken);
        return records.Select(EducationMapper.ToResponse).ToList();
    }

    public async Task<EducationResponse> CreateAsync(EducationRequest request)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var created = await repository.CreateAsync(identity.UserId, identity.AccessToken, EducationValidator.Normalize(request), cancellationToken);
        if (created is null)
        {
            throw new ApiException(ErrorCodes.EducationOperationFailed);
        }
        return EducationMapper.ToResponse(created);
    }

    public async Task<EducationResponse> UpdateAsync(Guid id, EducationRequest request)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var updated = await repository.UpdateAsync(identity.UserId, id, identity.AccessToken, EducationValidator.Normalize(request), cancellationToken);
        if (updated is null)
        {
            throw new ApiException(ErrorCodes.EducationNotFound);
        }
        return EducationMapper.ToResponse(updated);
    }

    public async Task DeleteAsync(Guid id)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        if (!await repository.DeleteAsync(identity.UserId, id, identity.AccessToken, cancellationToken))
        {
            throw new ApiException(ErrorCodes.EducationNotFound);
        }
    }
}
