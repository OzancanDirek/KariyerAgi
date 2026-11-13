using System.Net;
using System.Text.Json;
using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Infrastructure.Supabase;

public class SupabaseRestClient
{
    private readonly HttpClient httpClient;
    private readonly SupabaseRequestFactory requestFactory;

    public SupabaseRestClient(HttpClient httpClient, SupabaseRequestFactory requestFactory)
    {
        this.httpClient = httpClient;
        this.requestFactory = requestFactory;
    }

    public async Task<JsonDocument> SendAsync(HttpMethod method, string path, object? body, string accessToken, CancellationToken cancellationToken, bool returnRepresentation = true, IReadOnlyDictionary<string, ErrorDefinition>? databaseErrors = null)
    {
        using var request = requestFactory.Create(method, $"rest/v1/{path}", body, accessToken);
        return await SendRequestAsync(request, method, cancellationToken, returnRepresentation, databaseErrors, false);
    }

    public async Task<JsonDocument> SendServerRequestAsync(HttpMethod method, string path, object? body, CancellationToken cancellationToken)
    {
        using var request = requestFactory.CreateServerRequest(method, $"rest/v1/{path}", body);
        return await SendRequestAsync(request, method, cancellationToken, true, null, true);
    }

    private async Task<JsonDocument> SendRequestAsync(HttpRequestMessage request, HttpMethod method, CancellationToken cancellationToken, bool returnRepresentation, IReadOnlyDictionary<string, ErrorDefinition>? databaseErrors, bool serverRequest)
    {
        if (method == HttpMethod.Patch || method == HttpMethod.Post || method == HttpMethod.Delete)
        {
            request.Headers.TryAddWithoutValidation("Prefer", returnRepresentation ? "return=representation" : "return=minimal");
        }

        HttpResponseMessage response;
        try
        {
            response = await httpClient.SendAsync(request, cancellationToken);
        }
        catch (HttpRequestException)
        {
            throw new ApiException(ErrorCodes.ProfileServiceUnavailable);
        }

        using (response)
        {
            if (!response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
                if (responseBody.Contains("sistem_kullanicilari_telefon_tekil", StringComparison.Ordinal))
                {
                    throw new ApiException(ErrorCodes.PhoneAlreadyRegistered);
                }
                if (databaseErrors is not null)
                {
                    try
                    {
                        using var errorDocument = JsonDocument.Parse(responseBody);
                        if (errorDocument.RootElement.TryGetProperty("message", out var messageElement)
                            && messageElement.GetString() is { } message
                            && databaseErrors.TryGetValue(message, out var mappedError))
                        {
                            throw new ApiException(mappedError);
                        }
                    }
                    catch (JsonException)
                    {
                    }
                }

                if (serverRequest)
                {
                    throw new ApiException(response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden
                        ? ErrorCodes.JobMatchServerNotConfigured
                        : ErrorCodes.JobMatchFailed);
                }

                var error = response.StatusCode switch
                {
                    HttpStatusCode.Unauthorized => ErrorCodes.InvalidCredentials,
                    HttpStatusCode.Forbidden => ErrorCodes.ProfileAccessDenied,
                    HttpStatusCode.BadRequest => ErrorCodes.Validation,
                    HttpStatusCode.Conflict => ErrorCodes.DuplicateRecord,
                    _ => ErrorCodes.ProfileServiceFailed
                };
                throw new ApiException(error);
            }

            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            try
            {
                return JsonDocument.Parse(string.IsNullOrWhiteSpace(content) ? "null" : content);
            }
            catch (JsonException)
            {
                throw new ApiException(ErrorCodes.ProfileServiceFailed);
            }
        }
    }
}
