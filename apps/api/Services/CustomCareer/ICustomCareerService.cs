using CareerPath.Api.Dtos.CustomCareer;

namespace CareerPath.Api.Services.CustomCareer;

public interface ICustomCareerService
{
    Task<CustomCareerResponse?> GetLatestAsync();
    Task<CustomCareerResponse> CreateDraftAsync(CreateCustomCareerRequest request);
    Task<CustomCareerResponse> ConfirmAsync(Guid id, ConfirmCustomCareerRequest request);
}
