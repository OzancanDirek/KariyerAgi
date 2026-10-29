using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Utils;

public static class TextFieldValidator
{
    public static string RequiredText(string? value, int maxLength, ErrorDefinition requiredError, ErrorDefinition lengthError)
    {
        var normalized = StringUtils.TrimRequired(value, requiredError);
        if (normalized.Length > maxLength)
        {
            throw new ApiException(lengthError);
        }

        return normalized;
    }

    public static string? Text(string? value, int maxLength, ErrorDefinition error)
    {
        var normalized = StringUtils.TrimToNull(value);
        if (normalized?.Length > maxLength)
        {
            throw new ApiException(error);
        }

        return normalized;
    }

    public static string? HttpsUrl(string? value, int maxLength, ErrorDefinition error)
    {
        var normalized = Text(value, maxLength, error);
        if (normalized is not null &&
            (!Uri.TryCreate(normalized, UriKind.Absolute, out var uri) || uri.Scheme != Uri.UriSchemeHttps))
        {
            throw new ApiException(error);
        }

        return normalized;
    }
}
