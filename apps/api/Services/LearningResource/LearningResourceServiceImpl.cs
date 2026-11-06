using CareerPath.Api.Dtos.LearningResource;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.LearningResource;
using CareerPath.Api.Repositories.Skill;
using CareerPath.Api.Security;
using CareerPath.Api.Mappers;
using CareerPath.Api.Validation;

namespace CareerPath.Api.Services.LearningResource;

public class LearningResourceServiceImpl : ILearningResourceService
{
    private readonly LearningResourceRepository repository;
    private readonly SkillRepository skills;
    private readonly CurrentUserContextProvider currentUser;

    public LearningResourceServiceImpl(LearningResourceRepository repository, SkillRepository skills, CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.skills = skills;
        this.currentUser = currentUser;
    }

    public async Task<List<LearningResourceResponse>> ListAsync()
    {
        var identity = await currentUser.ResolveAsync();
        var rows = await repository.ListAsync(false, identity.AccessToken, currentUser.CancellationToken);
        return rows.Select(LearningResourceMapper.ToResponse).ToList();
    }

    public async Task<List<LearningResourceResponse>> ListForManagementAsync()
    {
        var identity = await RequireAdministratorAsync();
        var rows = await repository.ListAsync(true, identity.AccessToken, currentUser.CancellationToken);
        return rows.Select(LearningResourceMapper.ToResponse).ToList();
    }

    public async Task<LearningResourceResponse> CreateAsync(SaveLearningResourceRequest request)
    {
        return await SaveAsync(null, request);
    }

    public async Task<LearningResourceResponse> UpdateAsync(Guid id, SaveLearningResourceRequest request)
    {
        if (id == Guid.Empty)
        {
            throw new ApiException(ErrorCodes.Validation);
        }
        return await SaveAsync(id, request);
    }

    private async Task<LearningResourceResponse> SaveAsync(Guid? id, SaveLearningResourceRequest request)
    {
        var identity = await RequireAdministratorAsync();
        var values = LearningResourceValidator.Normalize(request);

        if (!await skills.SkillExistsAsync(request.SkillId, identity.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.SkillNotFound);
        }

        var saved = await repository.SaveAsync(id, values, identity.AccessToken, currentUser.CancellationToken);
        if (saved is null)
        {
            throw new ApiException(ErrorCodes.LearningResourceNotFound);
        }
        return LearningResourceMapper.ToResponse(saved);
    }

    private async Task<CurrentUserContext> RequireAdministratorAsync()
    {
        var identity = await currentUser.ResolveAsync();
        if (!await repository.IsAdministratorAsync(identity.UserId, identity.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.LearningResourceForbidden);
        }
        return identity;
    }

}
