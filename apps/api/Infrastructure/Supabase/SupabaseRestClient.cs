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

    public async Task<JsonDocument> SendAsync(HttpMethod method, string path, object? body, string accessToken, CancellationToken cancellationToken)
    {
        using var request = requestFactory.Create(method, $"rest/v1/{path}", body, accessToken);
        if (method == HttpMethod.Patch || method == HttpMethod.Post || method == HttpMethod.Delete)
        {
            request.Headers.TryAddWithoutValidation("Prefer", "return=representation");
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
                var error = response.StatusCode switch
                {
                    HttpStatusCode.Unauthorized => ErrorCodes.InvalidCredentials,
                    HttpStatusCode.Forbidden => ErrorCodes.ProfileAccessDenied,
                    HttpStatusCode.BadRequest => ErrorCodes.Validation,
                    _ => ErrorCodes.ProfileServiceFailed
                };
                throw new ApiException(error);
            }

            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            try
            {
                return JsonDocument.Parse(content);
            }
            catch (JsonException)
            {
                throw new ApiException(ErrorCodes.ProfileServiceFailed);
            }
        }
    }
}
