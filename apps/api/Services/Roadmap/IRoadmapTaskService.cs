using CareerPath.Api.Dtos.Roadmap;

namespace CareerPath.Api.Services.Roadmap;

public interface IRoadmapTaskService
{
    Task<List<RoadmapTaskResponse>> GetTasksAsync(Guid roleId);
    Task<List<RoadmapTaskResponse>> CreatePlanAsync(Guid roleId, CreateRoadmapPlanRequest request);
    Task SetCompletedAsync(Guid roleId, Guid taskId, bool completed);
    Task DeleteTaskAsync(Guid roleId, Guid taskId);
}
