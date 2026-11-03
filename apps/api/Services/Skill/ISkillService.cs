using CareerPath.Api.Dtos.Skill;

namespace CareerPath.Api.Services.Skill;

public interface ISkillService
{
    Task<SkillMapResponse> GetSkillMapAsync();
    Task AddSkillAsync(Guid skillId);
    Task AddCustomSkillAsync(string? name);
    Task RemoveSkillAsync(Guid selectionId);
    Task DismissSkillAsync(DismissSkillRequest request);
}
