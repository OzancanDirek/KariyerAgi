using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Utils;

public static class StringUtils
{
    public static bool IsBlank(string? value)
    {
        return string.IsNullOrWhiteSpace(value);
    }

    public static string TrimRequired(string? value, ErrorDefinition error)
    {
        if (IsBlank(value))
        {
            throw new ApiException(error);
        }

        return value!.Trim();
    }
    public static string? TrimToNull(string? value)
    {
        if (IsBlank(value))
        {
            return null;
        }

        return value!.Trim();
    }
}
