using CareerPath.Api.Dtos.LearningResource;
using CareerPath.Api.Repositories.LearningResource;

namespace CareerPath.Api.Mappers;

public static class LearningResourceMapper
{
    public static LearningResourceResponse ToResponse(LearningResourceRepository.LearningResourceRow row)
    {
        return new LearningResourceResponse
        {
            Id = row.Id,
            SkillId = row.SkillId,
            Title = row.Title,
            Url = row.Url,
            Provider = row.Provider,
            Type = row.Type,
            Language = row.Language,
            Level = row.Level,
            Paid = row.Paid,
            Active = row.Active,
            CheckedOn = row.CheckedOn
        };
    }
}
