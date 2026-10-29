using CareerPath.Api.Dtos.CareerProfile;
using CareerPath.Api.Entities;

namespace CareerPath.Api.Mappers;

public static class CareerProfileMapper
{
    public static CareerProfileResponse ToResponse(CandidateProfile profile)
    {
        return new CareerProfileResponse
        {
            Id = profile.Id,
            Title = profile.Title,
            Summary = profile.Summary,
            ExperienceLevel = profile.ExperienceLevel,
            LinkedInUrl = profile.LinkedInUrl,
            GitHubUrl = profile.GitHubUrl,
            PortfolioUrl = profile.PortfolioUrl,
            TargetTitle = profile.TargetTitle,
            TargetIndustry = profile.TargetIndustry,
            WorkModels = profile.WorkModels,
            PreferredLocations = profile.PreferredLocations,
            TargetSeniority = profile.TargetSeniority,
            CareerNotes = profile.CareerNotes,
            Visibility = profile.Visibility
        };
    }
}
