using CareerPath.Api.Dtos.LearningResource;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Validation;

public static class LearningResourceValidator
{
    public static LearningResourceValues Normalize(SaveLearningResourceRequest request)
    {
        var title = StringUtils.TrimRequired(request.Title, ErrorCodes.Validation);
        var provider = StringUtils.TrimRequired(request.Provider, ErrorCodes.Validation);
        var url = StringUtils.TrimRequired(request.Url, ErrorCodes.LearningResourceUrlInvalid);

        if (request.SkillId == Guid.Empty || title.Length is < 5 or > 160 || provider.Length is < 2 or > 100)
        {
            throw new ApiException(ErrorCodes.Validation);
        }

        if (url.Length > 2048 || !Uri.TryCreate(url, UriKind.Absolute, out var parsed)
            || parsed.Scheme != Uri.UriSchemeHttps || !string.IsNullOrEmpty(parsed.UserInfo))
        {
            throw new ApiException(ErrorCodes.LearningResourceUrlInvalid);
        }

        if (request.Type is not ("dokumantasyon" or "kurs" or "makale" or "video" or "uygulama")
            || request.Language is not ("tr" or "en")
            || request.Level is not ("baslangic" or "orta" or "ileri"))
        {
            throw new ApiException(ErrorCodes.Validation);
        }

        return new LearningResourceValues
        {
            SkillId = request.SkillId,
            Title = title,
            Url = url,
            Provider = provider,
            Type = request.Type,
            Language = request.Language,
            Level = request.Level,
            Paid = request.Paid,
            Active = request.Active,
            CheckedOn = DateOnly.FromDateTime(DateTime.UtcNow)
        };
    }
}
