using CareerPath.Api.Dtos.Profile;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.Profile;
using CareerPath.Api.Security;
using CareerPath.Api.Mappers;
using CareerPath.Api.Validation;

namespace CareerPath.Api.Services.Profile;

public class ProfileServiceImpl : IProfileService
{
    private readonly IProfileRepository repository;
    private readonly CurrentUserContextProvider currentUser;

    public ProfileServiceImpl(IProfileRepository repository, CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.currentUser = currentUser;
    }

    public async Task<ProfileResponse> GetMineAsync()
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var profile = await repository.GetByIdAsync(identity.UserId, identity.AccessToken, cancellationToken);
        if (profile is null)
        {
            throw new ApiException(ErrorCodes.ProfileNotFound);
        }

        return ProfileMapper.ToResponse(profile);
    }

    public async Task<ProfileResponse> UpdateMineAsync(UpdateProfileRequest request)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var profile = ProfileValidator.Normalize(request);
        var updated = await repository.UpdateAsync(identity.UserId, identity.AccessToken, profile, cancellationToken);
        if (updated is null)
        {
            throw new ApiException(ErrorCodes.ProfileNotFound);
        }

        return ProfileMapper.ToResponse(updated);
    }
}
