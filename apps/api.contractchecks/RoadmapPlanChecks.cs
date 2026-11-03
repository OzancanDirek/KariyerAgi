using CareerPath.Api.Dtos.Roadmap;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Infrastructure.Gemini;
using CareerPath.Api.Services.Roadmap;

public static class RoadmapPlanChecks
{
    public static void Run()
    {
        var skill = new RoadmapSkillResponse { Id = Guid.NewGuid(), Name = "SQL", Required = true };
        var plan = new GeneratedRoadmapPlan
        {
            Tasks = new List<GeneratedRoadmapTask>
            {
                new() { SkillId = skill.Id, Week = 1, Title = "Örnek veri modeli kur", Description = "Üç tablo tasarla, bağlantıları ve örnek sorguları göster.", Type = "proje", Priority = "yuksek", EstimatedHours = 3 }
            }
        };
        RoadmapTaskServiceImpl.ValidatePlan(plan, new[] { skill }, 4, 4);
        plan.Tasks[0].EstimatedHours = 5;
        ExpectInvalid(plan, skill);
        plan.Tasks[0].EstimatedHours = 3;
        plan.Tasks[0].SkillId = Guid.NewGuid();
        ExpectInvalid(plan, skill);
        plan.Tasks[0].SkillId = skill.Id;
        plan.Tasks[0].Week = 5;
        ExpectInvalid(plan, skill);
        plan.Tasks = null!;
        ExpectInvalid(plan, skill);
        Console.WriteLine("Gemini yol haritası beceri, hafta ve saat sınırları doğrulandı.");
    }

    private static void ExpectInvalid(GeneratedRoadmapPlan plan, RoadmapSkillResponse skill)
    {
        try
        {
            RoadmapTaskServiceImpl.ValidatePlan(plan, new[] { skill }, 4, 4);
        }
        catch (ApiException exception) when (exception.ErrorCode == ErrorCodes.RoadmapPlanInvalid)
        {
            return;
        }
        throw new Exception("Geçersiz Gemini görevi kabul edildi.");
    }
}
