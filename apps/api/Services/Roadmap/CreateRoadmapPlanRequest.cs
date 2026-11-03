namespace CareerPath.Api.Services.Roadmap;

public class CreateRoadmapPlanRequest
{
    public int Weeks { get; set; } = 4;
    public int WeeklyHours { get; set; } = 4;
}
