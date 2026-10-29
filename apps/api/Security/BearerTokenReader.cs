using CareerPath.Api.Exceptions;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Security;

public static class BearerTokenReader
{
    public static string Read(string? authorization)
    {
        if (authorization is null || StringUtils.IsBlank(authorization) || !authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            throw new ApiException(ErrorCodes.MissingToken);
        }

        return StringUtils.TrimRequired(authorization![7..], ErrorCodes.MissingToken);
    }
}
