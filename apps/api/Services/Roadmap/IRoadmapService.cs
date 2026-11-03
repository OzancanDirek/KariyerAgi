using CareerPath.Api.Dtos.Roadmap;

namespace CareerPath.Api.Services.Roadmap;

public interface IRoadmapService
{
    Task<RoadmapResponse> GetRoadmapAsync(Guid? roleId);
}
