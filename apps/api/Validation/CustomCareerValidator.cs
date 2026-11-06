using CareerPath.Api.Dtos.CustomCareer;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Validation;

public static class CustomCareerValidator
{
    public static string NormalizeTitle(string? title)
    {
        var normalized = StringUtils.TrimRequired(title, ErrorCodes.CustomCareerTitleInvalid);
        if (normalized.Length is < 3 or > 100)
        {
            throw new ApiException(ErrorCodes.CustomCareerTitleInvalid);
        }

        return normalized;
    }

    public static void ValidateSuggestions(IReadOnlyList<CustomCareerSkill> suggestions)
    {
        if (suggestions.Count is < 4 or > 8)
        {
            throw new ApiException(ErrorCodes.CustomCareerGenerationFailed);
        }

        foreach (var skill in suggestions)
        {
            if (!IsValidLength(skill.Name, 3, 80) || !IsValidLength(skill.Reason, 5, 180)
                || !IsValidLength(skill.Exercise, 5, 180))
            {
                throw new ApiException(ErrorCodes.CustomCareerGenerationFailed);
            }
        }

        if (suggestions.Select(skill => skill.Name.Trim()).Distinct(StringComparer.OrdinalIgnoreCase).Count() != suggestions.Count)
        {
            throw new ApiException(ErrorCodes.CustomCareerGenerationFailed);
        }
    }

    public static List<int> SelectedIndexes(List<int>? indexes, int suggestionCount)
    {
        var selected = indexes?.Distinct().ToList() ?? new List<int>();
        if (selected.Count is < 1 or > 8 || selected.Any(index => index < 0 || index >= suggestionCount))
        {
            throw new ApiException(ErrorCodes.Validation);
        }

        return selected;
    }

    private static bool IsValidLength(string? value, int minimum, int maximum)
    {
        return value?.Trim().Length is var length && length >= minimum && length <= maximum;
    }
}
