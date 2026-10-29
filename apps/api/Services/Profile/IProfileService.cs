using CareerPath.Api.Dtos.Profile;

namespace CareerPath.Api.Services.Profile;

public interface IProfileService
{
    Task<ProfileResponse> GetProfileAsync();
    Task<ProfileResponse> UpdateProfileAsync(UpdateProfileRequest request);
}
