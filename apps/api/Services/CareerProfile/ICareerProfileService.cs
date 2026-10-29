using CareerPath.Api.Dtos.CareerProfile;

namespace CareerPath.Api.Services.CareerProfile;

public interface ICareerProfileService
{
    Task<CareerProfileResponse> GetCareerProfileAsync();
    Task<CareerProfileResponse> UpdateCareerProfileAsync(UpdateCareerProfileRequest request);
}
