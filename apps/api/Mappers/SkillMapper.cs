using CareerPath.Api.Dtos.Skill;
using CareerPath.Api.Repositories.Skill;

namespace CareerPath.Api.Mappers;

public static class SkillMapper
{
    public static SkillMapResponse BuildSkillMap(SkillMapData data)
    {
        var active = data.Selections.Where(row => !row.IsDeleted).ToList();
        var activeCatalog = active.Where(row => row.SkillId.HasValue).ToDictionary(row => row.SkillId!.Value);
        var activeCustomNames = active.Where(row => !string.IsNullOrWhiteSpace(row.CustomName)).Select(row => row.CustomName!).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var dismissedIds = data.Selections.Where(row => row.IsDeleted && row.SkillId.HasValue).Select(row => row.SkillId!.Value).ToHashSet();
        var dismissedNames = data.Selections.Where(row => row.IsDeleted && !string.IsNullOrWhiteSpace(row.CustomName)).Select(row => row.CustomName!).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var suggested = data.CvSkills.Select(name => name.Trim()).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var aliases = data.Aliases.GroupBy(row => row.SkillId).ToDictionary(group => group.Key, group => group.Select(row => row.Name).ToHashSet(StringComparer.OrdinalIgnoreCase));
        var catalogNames = data.Skills.SelectMany(row => new[] { row.Name, row.EnglishName }).Where(name => !string.IsNullOrWhiteSpace(name)).Select(name => name!).ToHashSet(StringComparer.OrdinalIgnoreCase);
        catalogNames.UnionWith(aliases.Values.SelectMany(names => names));
        return new SkillMapResponse
        {
            Categories = data.Categories.Select(row => new SkillCategoryResponse
            {
                Id = row.Id,
                Name = row.Name,
                SortOrder = row.SortOrder
            }).ToList(),
            Skills = data.Skills.Select(row =>
                {
                    activeCatalog.TryGetValue(row.Id, out var selection);
                    var cvMatch = suggested.Contains(row.Name ?? "") || suggested.Contains(row.EnglishName ?? "") || (aliases.TryGetValue(row.Id, out var names) && names.Overlaps(suggested));
                    return new SkillResponse
                    {
                        Id = row.Id,
                        CategoryId = row.CategoryId,
                        Name = row.Name ?? row.EnglishName ?? string.Empty,
                        Selected = selection is not null,
                        SelectionId = selection?.Id,
                        SuggestedFromCv = cvMatch && !dismissedIds.Contains(row.Id)
                    };
                }).Concat(active.Where(row => !row.SkillId.HasValue && !string.IsNullOrWhiteSpace(row.CustomName))
                    .Select(row => new SkillResponse
                    {
                        Id = row.Id,
                        Name = row.CustomName!,
                        Selected = true,
                        Custom = true,
                        SelectionId = row.Id,
                        SuggestedFromCv = suggested.Contains(row.CustomName!)
                    })).ToList(),
            Relations = data.Relations.Select(row => new SkillRelationResponse
            {
                SourceSkillId = row.SourceSkillId,
                TargetSkillId = row.TargetSkillId,
                Type = row.Type
            }).ToList(),
            UnmatchedCvSkills = data.CvSkills.Where(name => !catalogNames.Contains(name) && !dismissedNames.Contains(name) && !activeCustomNames.Contains(name)).Distinct(StringComparer.OrdinalIgnoreCase).ToList()
        };
    }
}
