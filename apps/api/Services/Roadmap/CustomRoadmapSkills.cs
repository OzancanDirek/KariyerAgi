using System.Security.Cryptography;
using System.Text;
using CareerPath.Api.Dtos.CustomCareer;
using CareerPath.Api.Dtos.Roadmap;
using CareerPath.Api.Enums;
using CareerPath.Api.Repositories.CustomCareer;

namespace CareerPath.Api.Services.Roadmap;

public static class CustomRoadmapSkills
{
    public static bool Matches(CustomCareerRow? career, string? title)
    {
        return career is not null && CustomCareerStatusExtensions.TryFromDatabaseCode(career.Status, out var status)
            && status == CustomCareerStatus.Confirmed &&
            string.Equals(career.Title.Trim(), title?.Trim(), StringComparison.OrdinalIgnoreCase);
    }

    public static Guid SkillId(Guid careerId, CustomCareerSkill skill)
    {
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes($"{careerId:D}:{skill.Name.Trim().ToUpperInvariant()}"));
        return new Guid(hash.AsSpan(0, 16));
    }

    public static List<RoadmapSkillResponse> ToRoadmapSkills(CustomCareerRow career, IReadOnlySet<Guid> savedSkillIds, IReadOnlySet<string> savedSkillNames)
    {
        return career.ConfirmedSkills.Select(skill => new RoadmapSkillResponse
        {
            Id = SkillId(career.Id, skill),
            Name = skill.Name,
            Category = "Mesleğine özel",
            Required = true,
            Selected = skill.CatalogSkillId.HasValue && savedSkillIds.Contains(skill.CatalogSkillId.Value)
                || savedSkillNames.Contains(skill.Name.Trim()),
            SuggestedFromCv = false
        }).ToList();
    }
}
