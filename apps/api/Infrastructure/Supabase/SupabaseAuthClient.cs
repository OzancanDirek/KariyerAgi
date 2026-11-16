using System.Net;
using System.Text.Json;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Infrastructure.Supabase;

public class SupabaseAuthClient
{
    private readonly HttpClient httpClient;
    private readonly SupabaseRequestFactory requestFactory;

    public SupabaseAuthClient(HttpClient httpClient, SupabaseRequestFactory requestFactory)
    {
        this.httpClient = httpClient;
        this.requestFactory = requestFactory;
    }

    public async Task<JsonDocument> SendAsync(HttpMethod method, string path, object? body, string? accessToken, CancellationToken cancellationToken)
    {
        using var message = requestFactory.Create(method, $"auth/v1/{path}", body, accessToken);

        HttpResponseMessage response;
        try
        {
            response = await httpClient.SendAsync(message, cancellationToken);
        }
        catch (HttpRequestException)
        {
            throw new ApiException(ErrorCodes.AuthServiceUnavailable);
        }

        using (response)
        {
            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
                string? errorCode = null;
                try
                {
                    using var error = JsonDocument.Parse(errorBody);
                    if (error.RootElement.TryGetProperty("error_code", out var code))
                    {
                        errorCode = code.GetString();
                    }
                }
                catch (JsonException)
                {
                }

                var mappedCode = errorCode switch
                {
                    "invalid_credentials" => ErrorCodes.InvalidCredentials,
                    "email_not_confirmed" => ErrorCodes.EmailNotConfirmed,
                    "user_already_exists" => ErrorCodes.EmailAlreadyRegistered,
                    "same_password" => ErrorCodes.PasswordUnchanged,
                    "weak_password" => ErrorCodes.PasswordWeak,
                    "reauthentication_needed" or "session_expired" or "session_not_found" or "token_expired" => ErrorCodes.PasswordRecoveryExpired,
                    _ => response.StatusCode switch
                    {
                        HttpStatusCode.BadRequest => ErrorCodes.Validation,
                        HttpStatusCode.Unauthorized => ErrorCodes.InvalidCredentials,
                        HttpStatusCode.Forbidden when path == "user" => ErrorCodes.InvalidCredentials,
                        HttpStatusCode.Forbidden => ErrorCodes.AuthServiceFailed,
                        HttpStatusCode.Conflict => ErrorCodes.EmailAlreadyRegistered,
                        HttpStatusCode.TooManyRequests => ErrorCodes.TooManyRequests,
                        HttpStatusCode.UnprocessableEntity when path == "user" => ErrorCodes.PasswordUpdateRejected,
                        HttpStatusCode.UnprocessableEntity => ErrorCodes.Validation,
                        _ => ErrorCodes.AuthServiceFailed
                    }
                };
                throw new ApiException(mappedCode);
            }
            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            return JsonDocument.Parse(StringUtils.IsBlank(content) ? "{}" : content);
        }
    }

}
