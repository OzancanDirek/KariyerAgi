using Microsoft.AspNetCore.WebUtilities;

namespace CareerPath.Api.Exceptions;

public static class ApiErrorResponseFactory
{
    public static ApiErrorResponse Create(ErrorDefinition errorCode, string path, string? message = null)
    {
        var definition = errorCode;
        return new ApiErrorResponse
        {
            Timestamp = DateTimeOffset.UtcNow,
            Status = definition.Status,
            Error = ReasonPhrases.GetReasonPhrase(definition.Status),
            Code = definition.Code,
            Message = message ?? definition.Message,
            Path = path
        };
    }
}
