using System.Net.Http.Headers;
using System.Net.Http.Json;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Infrastructure.Supabase;

public class SupabaseRequestFactory
{
    private readonly IConfiguration configuration;

    public SupabaseRequestFactory(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    public HttpRequestMessage Create(HttpMethod method, string endpoint, object? body, string? accessToken)
    {
        var url = configuration["Supabase:Url"];
        var key = configuration["Supabase:PublishableKey"];
        if (!Uri.TryCreate(url, UriKind.Absolute, out var baseUri) || baseUri.Scheme != Uri.UriSchemeHttps || StringUtils.IsBlank(key))
        {
            throw new ApiException(ErrorCodes.AuthConfigurationMissing);
        }

        var request = new HttpRequestMessage(method, $"{url!.TrimEnd('/')}/{endpoint}");
        request.Headers.Add("apikey", key);
        if (accessToken is not null)
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        }

        if (body is not null)
        {
            request.Content = JsonContent.Create(body);
        }

        return request;
    }
}
