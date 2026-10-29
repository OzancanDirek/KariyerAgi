using CareerPath.Api.Dtos.CareerProfile;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.CareerProfile;
using CareerPath.Api.Security;
using CareerPath.Api.Mappers;
using CareerPath.Api.Validation;

namespace CareerPath.Api.Services.CareerProfile;

public class CareerProfileServiceImpl : ICareerProfileService
{
    private readonly ICareerProfileRepository repository;
    private readonly CurrentUserContextProvider currentUser;

    public CareerProfileServiceImpl(ICareerProfileRepository repository, CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.currentUser = currentUser;
    }

    public async Task<CareerProfileResponse> GetMineAsync()
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var profile = await repository.GetByIdAsync(identity.UserId, identity.AccessToken, cancellationToken);
        if (profile is null)
        {
            throw new ApiException(ErrorCodes.CareerProfileNotFound);
        }

        return CareerProfileMapper.ToResponse(profile);
    }

    public async Task<CareerProfileResponse> UpdateMineAsync(UpdateCareerProfileRequest request)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var profile = CareerProfileValidator.Normalize(request);
        var updated = await repository.UpdateAsync(identity.UserId, identity.AccessToken, profile, cancellationToken);
        if (updated is null)
        {
            throw new ApiException(ErrorCodes.CareerProfileNotFound);
        }

        return CareerProfileMapper.ToResponse(updated);
    }

}
