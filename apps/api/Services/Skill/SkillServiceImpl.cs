using CareerPath.Api.Dtos.Skill;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.Skill;
using CareerPath.Api.Security;

namespace CareerPath.Api.Services.Skill;

public class SkillServiceImpl : ISkillService
{
    private readonly SkillRepository repository;
    private readonly CurrentUserContextProvider currentUser;

    public SkillServiceImpl(SkillRepository repository, CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.currentUser = currentUser;
    }

    public async Task<SkillMapResponse> GetSkillMapAsync()
    {
        var identity = await currentUser.ResolveAsync();
        var data = await repository.GetSkillMapDataAsync(identity.UserId, identity.AccessToken, currentUser.CancellationToken);
        return BuildSkillMap(data);
    }

    public async Task AddSkillAsync(Guid skillId)
    {
        if (skillId == Guid.Empty)
        {
            throw new ApiException(ErrorCodes.SkillNotFound);
        }

        var identity = await currentUser.ResolveAsync();
        var selected = await repository.GetSelectionsAsync(identity.UserId, identity.AccessToken, currentUser.CancellationToken);
        if (selected.Any(item => item.SkillId == skillId && !item.IsDeleted))
        {
            return;
        }

        if (!await repository.SkillExistsAsync(skillId, identity.AccessToken, currentUser.CancellationToken) ||
            !await repository.AddSkillAsync(identity.UserId, skillId, identity.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.SkillNotFound);
        }
    }

    public async Task AddCustomSkillAsync(string? name)
    {
        var normalized = NormalizeName(name);
        var identity = await currentUser.ResolveAsync();
        var catalog = await repository.GetCatalogAsync(identity.AccessToken, currentUser.CancellationToken);
        var match = catalog.FirstOrDefault(item => string.Equals(item.Name, normalized, StringComparison.OrdinalIgnoreCase) || string.Equals(item.EnglishName, normalized, StringComparison.OrdinalIgnoreCase));
        if (match is not null)
        {
            await AddSkillAsync(match.Id);
            return;
        }

        var selected = await repository.GetSelectionsAsync(identity.UserId, identity.AccessToken, currentUser.CancellationToken);
        if (selected.Any(item => !item.IsDeleted && string.Equals(item.CustomName, normalized, StringComparison.OrdinalIgnoreCase)))
        {
            return;
        }

        if (!await repository.AddCustomSkillAsync(identity.UserId, normalized, identity.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.SkillNotFound);
        }
    }

    public async Task RemoveSkillAsync(Guid selectionId)
    {
        var identity = await currentUser.ResolveAsync();
        if (!await repository.RemoveSkillAsync(identity.UserId, selectionId, identity.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.SkillNotFound);
        }
    }

    public async Task DismissSkillAsync(DismissSkillRequest request)
    {
        var hasSkillId = request.SkillId.HasValue && request.SkillId.Value != Guid.Empty;
        var hasName = !string.IsNullOrWhiteSpace(request.Name);
        if (request.SkillId == Guid.Empty || hasSkillId == hasName)
        {
            throw new ApiException(ErrorCodes.Validation);
        }

        var name = request.Name is null ? null : NormalizeName(request.Name);
        var identity = await currentUser.ResolveAsync();
        var selected = await repository.GetSelectionsAsync(identity.UserId, identity.AccessToken, currentUser.CancellationToken);
        if (selected.Any(item => item.IsDeleted && (request.SkillId.HasValue ? item.SkillId == request.SkillId : string.Equals(item.CustomName, name, StringComparison.OrdinalIgnoreCase))))
        {
            return;
        }

        await repository.DismissSkillAsync(identity.UserId, request.SkillId, name, identity.AccessToken, currentUser.CancellationToken);
    }

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
            Categories = data.Categories.Select(row => new SkillCategoryResponse { Id = row.Id, Name = row.Name, SortOrder = row.SortOrder }).ToList(),
            Skills = data.Skills.Select(row =>
                {
                    activeCatalog.TryGetValue(row.Id, out var selection);
                    var cvMatch = suggested.Contains(row.Name ?? "") || suggested.Contains(row.EnglishName ?? "") || (aliases.TryGetValue(row.Id, out var names) && names.Overlaps(suggested));
                    return new SkillResponse { Id = row.Id, CategoryId = row.CategoryId, Name = row.Name ?? row.EnglishName ?? "", Selected = selection is not null, SelectionId = selection?.Id, SuggestedFromCv = cvMatch && !dismissedIds.Contains(row.Id) };
                }).Concat(active.Where(row => !row.SkillId.HasValue && !string.IsNullOrWhiteSpace(row.CustomName))
                    .Select(row => new SkillResponse { Id = row.Id, Name = row.CustomName!, Selected = true, Custom = true, SelectionId = row.Id, SuggestedFromCv = suggested.Contains(row.CustomName!) })).ToList(),
            Relations = data.Relations.Select(row => new SkillRelationResponse { SourceSkillId = row.SourceSkillId, TargetSkillId = row.TargetSkillId, Type = row.Type }).ToList(),
            UnmatchedCvSkills = data.CvSkills.Where(name => !catalogNames.Contains(name) && !dismissedNames.Contains(name) && !activeCustomNames.Contains(name)).Distinct(StringComparer.OrdinalIgnoreCase).ToList()
        };
    }

    private static string NormalizeName(string? name)
    {
        var normalized = name?.Trim();
        if (string.IsNullOrWhiteSpace(normalized) || normalized.Length > 80)
        {
            throw new ApiException(ErrorCodes.SkillNameInvalid);
        }

        return normalized;
    }
}
