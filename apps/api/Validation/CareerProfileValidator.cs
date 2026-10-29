using CareerPath.Api.Dtos.CareerProfile;
using CareerPath.Api.Entities;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Validation;

public static class CareerProfileValidator
{
    private static readonly HashSet<string> Levels = new(StringComparer.Ordinal)
    {
        "stajyer", "baslangic", "orta", "kidemli", "lider"
    };
    private static readonly HashSet<string> Visibilities = new(StringComparer.Ordinal)
    {
        "gizli", "basvurulanlar", "herkese_acik"
    };

    public static CandidateProfile Normalize(UpdateCareerProfileRequest request)
    {
        var experienceLevel = StringUtils.TrimToNull(request.ExperienceLevel);
        var targetSeniority = StringUtils.TrimToNull(request.TargetSeniority);
        if ((experienceLevel is not null && !Levels.Contains(experienceLevel)) ||
            (targetSeniority is not null && !Levels.Contains(targetSeniority)))
        {
            throw new ApiException(ErrorCodes.CareerProfileLevelInvalid);
        }

        var workModels = NormalizeWorkModels(request.WorkModels);
        var locations = NormalizeLocations(request.PreferredLocations);
        var visibility = StringUtils.TrimToNull(request.Visibility) ?? "basvurulanlar";
        if (!Visibilities.Contains(visibility))
        {
            throw new ApiException(ErrorCodes.CareerProfileVisibilityInvalid);
        }

        return new CandidateProfile
        {
            Title = TextFieldValidator.Text(request.Title, 150, ErrorCodes.CareerProfileTextTooLong),
            Summary = TextFieldValidator.Text(request.Summary, 2000, ErrorCodes.CareerProfileTextTooLong),
            ExperienceLevel = experienceLevel,
            LinkedInUrl = TextFieldValidator.HttpsUrl(request.LinkedInUrl, 300, ErrorCodes.CareerProfileUrlInvalid),
            GitHubUrl = TextFieldValidator.HttpsUrl(request.GitHubUrl, 300, ErrorCodes.CareerProfileUrlInvalid),
            PortfolioUrl = TextFieldValidator.HttpsUrl(request.PortfolioUrl, 300, ErrorCodes.CareerProfileUrlInvalid),
            TargetTitle = TextFieldValidator.Text(request.TargetTitle, 150, ErrorCodes.CareerProfileTextTooLong),
            TargetIndustry = TextFieldValidator.Text(request.TargetIndustry, 150, ErrorCodes.CareerProfileTextTooLong),
            WorkModels = workModels,
            PreferredLocations = locations,
            TargetSeniority = targetSeniority,
            CareerNotes = TextFieldValidator.Text(request.CareerNotes, 2000, ErrorCodes.CareerProfileTextTooLong),
            Visibility = visibility
        };
    }

    private static List<string> NormalizeWorkModels(List<string>? values)
    {
        var normalized = (values ?? new List<string>())
            .Select(StringUtils.TrimToNull)
            .Where(value => value is not null)
            .Select(value => value!)
            .Distinct(StringComparer.Ordinal)
            .ToList();
        if (normalized.Any(value => !WorkModelValues.Allowed.Contains(value)))
        {
            throw new ApiException(ErrorCodes.CareerProfileWorkModelInvalid);
        }

        return normalized;
    }

    private static List<string> NormalizeLocations(List<string>? values)
    {
        var normalized = (values ?? new List<string>())
            .Select(StringUtils.TrimToNull)
            .Where(value => value is not null)
            .Select(value => value!)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
        if (normalized.Count > 10 || normalized.Any(value => value.Length > 150))
        {
            throw new ApiException(ErrorCodes.CareerProfileLocationInvalid);
        }

        return normalized;
    }
}
