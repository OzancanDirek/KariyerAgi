using CareerPath.Api.Dtos.CustomCareer;
using CareerPath.Api.Repositories.CustomCareer;

namespace CareerPath.Api.Mappers;

public static class CustomCareerMapper
{
    public static CustomCareerResponse ToResponse(CustomCareerRow row)
    {
        return new CustomCareerResponse
        {
            Id = row.Id,
            Title = row.Title,
            Status = row.Status,
            SuggestedSkills = row.SuggestedSkills,
            ConfirmedSkills = row.ConfirmedSkills
        };
    }
}
