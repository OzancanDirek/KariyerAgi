using CareerPath.Api.Dtos.Roadmap;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.CareerProfile;
using CareerPath.Api.Repositories.CustomCareer;
using CareerPath.Api.Repositories.Roadmap;
using CareerPath.Api.Repositories.Skill;
using CareerPath.Api.Security;
using CareerPath.Api.Services.Skill;

namespace CareerPath.Api.Services.Roadmap;

public class RoadmapServiceImpl : IRoadmapService
{
    private readonly RoadmapRepository repository;
    private readonly CareerProfileRepository profiles;
    private readonly CustomCareerRepository customCareers;
    private readonly ISkillService skills;
    private readonly CurrentUserContextProvider currentUser;

    public RoadmapServiceImpl(RoadmapRepository repository, CareerProfileRepository profiles, CustomCareerRepository customCareers, ISkillService skills, CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.profiles = profiles;
        this.customCareers = customCareers;
        this.skills = skills;
        this.currentUser = currentUser;
    }

    public async Task<RoadmapResponse> GetRoadmapAsync(Guid? roleId)
    {
        var identity = await currentUser.ResolveAsync();
        var rolesTask = repository.GetRolesAsync(identity.AccessToken, currentUser.CancellationToken);
        var profileTask = profiles.GetByIdAsync(identity.UserId, identity.AccessToken, currentUser.CancellationToken);
        var customTask = customCareers.GetConfirmedAsync(identity.UserId, identity.AccessToken, currentUser.CancellationToken);
        await Task.WhenAll(rolesTask, profileTask, customTask);

        var roles = await rolesTask;
        var profile = await profileTask;
        var customCareersForUser = await customTask;
        var custom = roleId.HasValue
            ? customCareersForUser.FirstOrDefault(item => item.Id == roleId.Value)
            : customCareersForUser.FirstOrDefault(item => CustomRoadmapSkills.Matches(item, profile?.TargetTitle));
        var response = new RoadmapResponse
        {
            TargetTitle = profile?.TargetTitle,
            Roles = roles.Select(role => new RoadmapRoleResponse { Id = role.Id, Name = role.Name, Description = role.Description }).ToList()
        };

        foreach (var personalCareer in customCareersForUser)
        {
            response.Roles.Add(new RoadmapRoleResponse { Id = personalCareer.Id, Name = personalCareer.Title, Description = "Onayladığın mesleğe özel beceriler" });
        }

        if (custom is not null)
        {
            var customSkillMap = await skills.GetSkillMapAsync();
            response.RoleId = custom.Id;
            response.IsCustomRole = true;
            response.Skills = CustomRoadmapSkills.ToRoadmapSkills(custom,
                customSkillMap.Skills.Where(skill => skill.Selected).Select(skill => skill.Id).ToHashSet(),
                customSkillMap.Skills.Where(skill => skill.Selected).Select(skill => skill.Name.Trim()).ToHashSet(StringComparer.OrdinalIgnoreCase));
            return response;
        }

        if (roles.Count == 0)
        {
            return response;
        }

        var targetTitle = profile?.TargetTitle?.Trim();
        var role = roleId.HasValue
            ? roles.FirstOrDefault(item => item.Id == roleId.Value)
            : roles.FirstOrDefault(item => string.Equals(item.Name, targetTitle, StringComparison.OrdinalIgnoreCase));
        if (!roleId.HasValue && role is null && !string.IsNullOrWhiteSpace(targetTitle))
        {
            var normalizedTitle = targetTitle.Replace("-", " ", StringComparison.OrdinalIgnoreCase).Replace("Developer", "Geliştirici", StringComparison.OrdinalIgnoreCase);
            role = roles.FirstOrDefault(item => string.Equals(item.Name.Replace("-", " "), normalizedTitle, StringComparison.OrdinalIgnoreCase));
        }
        if (roleId.HasValue && role is null)
        {
            throw new ApiException(ErrorCodes.Validation);
        }

        if (role is null)
        {
            return response;
        }

        response.RoleId = role.Id;
        var requirementsTask = repository.GetRequirementsAsync(role.Id, identity.AccessToken, currentUser.CancellationToken);
        var mapTask = skills.GetSkillMapAsync();
        await Task.WhenAll(requirementsTask, mapTask);

        var map = await mapTask;
        var catalog = map.Skills.ToDictionary(skill => skill.Id);
        var categories = map.Categories.ToDictionary(category => category.Id, category => category.Name);
        foreach (var requirement in await requirementsTask)
        {
            if (!catalog.TryGetValue(requirement.SkillId, out var skill))
            {
                continue;
            }

            var category = skill.CategoryId.HasValue && categories.TryGetValue(skill.CategoryId.Value, out var name) ? name : "Diğer";
            response.Skills.Add(new RoadmapSkillResponse
            {
                Id = skill.Id,
                Name = skill.Name,
                Category = category,
                Required = requirement.Required,
                Selected = skill.Selected,
                SuggestedFromCv = skill.SuggestedFromCv
            });
        }

        return response;
    }
}
