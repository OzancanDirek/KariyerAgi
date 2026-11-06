using CareerPath.Api.Dtos.Roadmap;
using CareerPath.Api.Repositories.Roadmap;

namespace CareerPath.Api.Mappers;

public static class RoadmapTaskMapper
{
    public static List<RoadmapTaskResponse> ToResponses(List<RoadmapTaskRow> rows, List<RoadmapSkillResponse> skills)
    {
        var names = skills.ToDictionary(skill => skill.Id, skill => skill.Name);
        return rows.Select(row => new RoadmapTaskResponse
        {
            Id = row.Id,
            SkillId = row.SkillId,
            SkillName = names.GetValueOrDefault(row.SkillId, "Beceri"),
            Week = row.Week,
            DueDate = row.DueDate,
            Title = row.Title,
            Description = row.Description,
            Type = row.Type,
            Priority = row.Priority,
            EstimatedHours = row.EstimatedHours,
            Completed = row.Completed
        }).ToList();
    }
}
