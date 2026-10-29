using CareerPath.Api.Dtos.CareerProfile;

namespace CareerPath.Api.Services.CareerProfile;

public interface ICareerProfileService
{
    Task<CareerProfileResponse> GetMineAsync();
    Task<CareerProfileResponse> UpdateMineAsync(UpdateCareerProfileRequest request);
}
