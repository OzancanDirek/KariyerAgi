using CareerPath.Api.Dtos.Profile;

namespace CareerPath.Api.Services.Profile;

public interface IProfileService
{
    Task<ProfileResponse> GetMineAsync();
    Task<ProfileResponse> UpdateMineAsync(UpdateProfileRequest request);
}
