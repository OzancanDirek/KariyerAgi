using CareerPath.Api.Dtos.Skill;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.Skill;
using CareerPath.Api.Security;
using CareerPath.Api.Mappers;

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
        return SkillMapper.BuildSkillMap(data);
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

    public async Task AddCustomSkillAsync(string? name, Guid? categoryId)
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

        if (!categoryId.HasValue || categoryId.Value == Guid.Empty ||
            !await repository.CategoryExistsAsync(categoryId.Value, identity.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.Validation);
        }

        var selected = await repository.GetSelectionsAsync(identity.UserId, identity.AccessToken, currentUser.CancellationToken);
        if (selected.Any(item => !item.IsDeleted && string.Equals(item.CustomName, normalized, StringComparison.OrdinalIgnoreCase)))
        {
            return;
        }

        if (!await repository.AddCustomSkillAsync(identity.UserId, normalized, categoryId.Value, identity.AccessToken, currentUser.CancellationToken))
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
