using CareerPath.Api.Dtos.Roadmap;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Infrastructure.Gemini;
using CareerPath.Api.Repositories.CareerProfile;
using CareerPath.Api.Repositories.Roadmap;
using CareerPath.Api.Security;
using CareerPath.Api.Mappers;

namespace CareerPath.Api.Services.Roadmap;

public class RoadmapTaskServiceImpl : IRoadmapTaskService
{
    private readonly RoadmapTaskRepository tasks;
    private readonly CareerProfileRepository profiles;
    private readonly IRoadmapService roadmap;
    private readonly GeminiRoadmapPlanner planner;
    private readonly CurrentUserContextProvider currentUser;

    public RoadmapTaskServiceImpl(RoadmapTaskRepository tasks, CareerProfileRepository profiles, IRoadmapService roadmap, GeminiRoadmapPlanner planner, CurrentUserContextProvider currentUser)
    {
        this.tasks = tasks;
        this.profiles = profiles;
        this.roadmap = roadmap;
        this.planner = planner;
        this.currentUser = currentUser;
    }

    public async Task<List<RoadmapTaskResponse>> GetTasksAsync(Guid roleId)
    {
        var identity = await currentUser.ResolveAsync();
        var map = await roadmap.GetRoadmapAsync(roleId);
        var rows = await tasks.ListAsync(identity.UserId, roleId, identity.AccessToken, currentUser.CancellationToken);
        return RoadmapTaskMapper.ToResponses(rows, map.Skills);
    }

    public async Task<List<RoadmapTaskResponse>> CreatePlanAsync(Guid roleId, CreateRoadmapPlanRequest request)
    {
        if (request.Weeks is < 2 or > 8 || request.WeeklyHours is < 1 or > 20)
        {
            throw new ApiException(ErrorCodes.Validation);
        }

        var identity = await currentUser.ResolveAsync();
        var map = await roadmap.GetRoadmapAsync(roleId);
        var role = map.Roles.First(item => item.Id == roleId);
        var missing = map.Skills.Where(skill => !skill.Selected).ToList();
        if (missing.Count == 0 || missing.Count > Math.Min(32, request.Weeks * 2))
        {
            throw new ApiException(ErrorCodes.Validation);
        }

        var profile = await profiles.GetByIdAsync(identity.UserId, identity.AccessToken, currentUser.CancellationToken);
        var generated = await planner.GenerateAsync(role.Name, role.Description, profile?.ExperienceLevel, map.Skills, request.Weeks, request.WeeklyHours, currentUser.CancellationToken);
        ValidatePlan(generated, missing, request.Weeks, request.WeeklyHours);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var firstMonday = today.AddDays(-((int)today.DayOfWeek + 6) % 7);
        await tasks.ReplacePlanAsync(roleId, generated.Tasks, firstMonday, identity.AccessToken, currentUser.CancellationToken);
        var rows = await tasks.ListAsync(identity.UserId, roleId, identity.AccessToken, currentUser.CancellationToken);
        return RoadmapTaskMapper.ToResponses(rows, map.Skills);
    }

    public async Task SetCompletedAsync(Guid roleId, Guid taskId, bool completed)
    {
        var identity = await currentUser.ResolveAsync();
        if (!await tasks.SetCompletedAsync(identity.UserId, roleId, taskId, completed, identity.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.Validation);
        }
    }

    public async Task DeleteTaskAsync(Guid roleId, Guid taskId)
    {
        var identity = await currentUser.ResolveAsync();
        if (!await tasks.DeleteAsync(identity.UserId, roleId, taskId, identity.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.Validation);
        }
    }

    public static void ValidatePlan(GeneratedRoadmapPlan plan, IReadOnlyList<RoadmapSkillResponse> missing, int weeks, int weeklyHours)
    {
        var ids = missing.Select(skill => skill.Id).ToHashSet();
        if (plan.Tasks is null || plan.Tasks.Count < missing.Count || plan.Tasks.Count > Math.Min(32, weeks * 2) ||
            plan.Tasks.Any(task => !ids.Contains(task.SkillId) || task.Week < 1 || task.Week > weeks ||
                (task.Title?.Trim().Length ?? 0) is < 10 or > 100 || (task.Description?.Trim().Length ?? 0) is < 30 or > 400 ||
                task.EstimatedHours < 1 || task.EstimatedHours > weeklyHours ||
                task.Type is not ("arastirma" or "pratik" or "proje") || task.Priority is not ("yuksek" or "orta" or "dusuk")) ||
            plan.Tasks.GroupBy(task => task.Week).Any(group => group.Count() > 2 || group.Sum(task => task.EstimatedHours) > weeklyHours) ||
            ids.Any(id => plan.Tasks.All(task => task.SkillId != id)))
        {
            throw new ApiException(ErrorCodes.RoadmapPlanInvalid);
        }

        foreach (var task in plan.Tasks)
        {
            task.Title = task.Title.Trim();
            task.Description = task.Description.Trim();
        }
    }

}
