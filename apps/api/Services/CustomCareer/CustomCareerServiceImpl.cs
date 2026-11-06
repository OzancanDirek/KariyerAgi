using CareerPath.Api.Enums;
using CareerPath.Api.Mappers;
using CareerPath.Api.Validation;
using CareerPath.Api.Dtos.CustomCareer;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Infrastructure.Gemini;
using CareerPath.Api.Repositories.CustomCareer;
using CareerPath.Api.Repositories.Skill;
using CareerPath.Api.Security;
using CareerPath.Api.Services.Skill;

namespace CareerPath.Api.Services.CustomCareer;

public class CustomCareerServiceImpl : ICustomCareerService
{
    private readonly CustomCareerRepository repository;
    private readonly SkillRepository skills;
    private readonly ISkillService skillService;
    private readonly GeminiCareerSkillSuggester suggester;
    private readonly CurrentUserContextProvider currentUser;

    public CustomCareerServiceImpl(CustomCareerRepository repository, SkillRepository skills, ISkillService skillService, GeminiCareerSkillSuggester suggester, CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.skills = skills;
        this.skillService = skillService;
        this.suggester = suggester;
        this.currentUser = currentUser;
    }

    public async Task<CustomCareerResponse?> GetLatestAsync()
    {
        var identity = await currentUser.ResolveAsync();
        var row = await repository.GetLatestAsync(identity.UserId, identity.AccessToken, currentUser.CancellationToken);
        return row is null ? null : CustomCareerMapper.ToResponse(row);
    }

    public async Task<CustomCareerResponse> CreateDraftAsync(CreateCustomCareerRequest request)
    {
        var title = CustomCareerValidator.NormalizeTitle(request.Title);
        var identity = await currentUser.ResolveAsync();
        if (await repository.CountTodayAsync(identity.UserId, identity.AccessToken, currentUser.CancellationToken) >= 2)
        {
            throw new ApiException(ErrorCodes.CustomCareerDailyLimit);
        }
        var row = await repository.CreateAsync(identity.UserId, title, identity.AccessToken, currentUser.CancellationToken);
        if (row is null)
        {
            throw new ApiException(ErrorCodes.CustomCareerGenerationFailed);
        }
        try
        {
            var map = await skillService.GetSkillMapAsync();
            var catalog = await skills.GetCatalogAsync(identity.AccessToken, currentUser.CancellationToken);
            var existing = map.Skills.Where(skill => skill.Selected).Select(skill => skill.Name).Distinct(StringComparer.OrdinalIgnoreCase).Take(30).ToList();
            var names = catalog.Select(skill => skill.Name).Where(name => !string.IsNullOrWhiteSpace(name)).Select(name => name!).Take(300).ToList();
            var suggestions = await suggester.SuggestAsync(title, existing, names, currentUser.CancellationToken);
            CustomCareerValidator.ValidateSuggestions(suggestions);
            foreach (var suggestion in suggestions)
            {
                suggestion.Name = suggestion.Name.Trim();
                suggestion.Reason = suggestion.Reason.Trim();
                suggestion.Exercise = suggestion.Exercise.Trim();
                suggestion.CatalogSkillId = catalog.FirstOrDefault(skill => string.Equals(skill.Name, suggestion.Name, StringComparison.OrdinalIgnoreCase) || string.Equals(skill.EnglishName, suggestion.Name, StringComparison.OrdinalIgnoreCase))?.Id;
            }
            var values = new CustomCareerUpdateValues { Status = CustomCareerStatus.Draft.ToDatabaseCode(), SuggestedSkills = suggestions };
            var saved = await repository.UpdateAsync(identity.UserId, row.Id, values, identity.AccessToken, currentUser.CancellationToken);
            return saved is null ? throw new ApiException(ErrorCodes.CustomCareerGenerationFailed) : CustomCareerMapper.ToResponse(saved);
        }
        catch (Exception)
        {
            try
            {
                var failed = new CustomCareerUpdateValues { Status = CustomCareerStatus.Failed.ToDatabaseCode() };
                await repository.UpdateAsync(identity.UserId, row.Id, failed, identity.AccessToken, CancellationToken.None);
            }
            catch (Exception)
            {
                // Preserve the original generation error if status persistence also fails.
            }
            throw;
        }
    }

    public async Task<CustomCareerResponse> ConfirmAsync(Guid id, ConfirmCustomCareerRequest request)
    {
        var identity = await currentUser.ResolveAsync();
        var row = await repository.GetAsync(identity.UserId, id, identity.AccessToken, currentUser.CancellationToken);
        if (row is null || !CustomCareerStatusExtensions.TryFromDatabaseCode(row.Status, out var status)
            || status == CustomCareerStatus.Failed)
        {
            throw new ApiException(ErrorCodes.CustomCareerNotFound);
        }
        var indexes = CustomCareerValidator.SelectedIndexes(request.SelectedIndexes, row.SuggestedSkills.Count);
        var approved = indexes.Select(index => row.SuggestedSkills[index]).ToList();
        var values = new CustomCareerUpdateValues { Status = CustomCareerStatus.Confirmed.ToDatabaseCode(), ConfirmedSkills = approved };
        var saved = await repository.UpdateAsync(identity.UserId, row.Id, values, identity.AccessToken, currentUser.CancellationToken);
        return saved is null ? throw new ApiException(ErrorCodes.CustomCareerNotFound) : CustomCareerMapper.ToResponse(saved);
    }

}
