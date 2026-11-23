using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace CareerPath.Api.Services.Job;

public sealed record ExternalJob(string Title, string Company, string Location, string Description, string Url);
public sealed record ExternalJobSearchResponse(IReadOnlyList<ExternalJob> Jobs, int Total, int Page);

public sealed class ExternalJobSearchService(HttpClient client, IConfiguration configuration, ILogger<ExternalJobSearchService> logger)
{
    public bool IsConfigured => !string.IsNullOrWhiteSpace(configuration["Careerjet:ApiKey"]);

    public async Task<ExternalJobSearchResponse> SearchAsync(string keywords, string? location, int page, string userIp, string userAgent, CancellationToken cancellationToken)
    {
        var key = configuration["Careerjet:ApiKey"];
        if (string.IsNullOrWhiteSpace(key))
            throw new InvalidOperationException("Careerjet API key is not configured.");

        var query = new Dictionary<string, string>
        {
            ["locale_code"] = "tr_TR",
            ["keywords"] = keywords,
            ["page"] = page.ToString(System.Globalization.CultureInfo.InvariantCulture),
            ["page_size"] = "20",
            ["user_ip"] = userIp,
            ["user_agent"] = userAgent
        };
        if (!string.IsNullOrWhiteSpace(location)) query["location"] = location;
        var uri = "https://search.api.careerjet.net/v4/query?" + string.Join("&", query.Select(pair =>
            $"{Uri.EscapeDataString(pair.Key)}={Uri.EscapeDataString(pair.Value)}"));
        using var request = new HttpRequestMessage(HttpMethod.Get, uri);
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.UTF8.GetBytes(key + ":")));
        request.Headers.Referrer = new Uri(configuration["Careerjet:PublisherUrl"] ?? "https://careerpath-web.onrender.com/");
        using var response = await client.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning("Careerjet search failed with HTTP {StatusCode}", (int)response.StatusCode);
            throw new HttpRequestException("Careerjet search failed.");
        }
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync(cancellationToken));
        var root = document.RootElement;
        if (GetString(root, "type") != "JOBS") return new ExternalJobSearchResponse([], 0, page);
        var jobs = new List<ExternalJob>();
        if (root.TryGetProperty("jobs", out var rows) && rows.ValueKind == JsonValueKind.Array)
        {
            foreach (var row in rows.EnumerateArray())
            {
                var url = GetString(row, "url");
                if (!Uri.TryCreate(url, UriKind.Absolute, out var link) || link.Scheme != Uri.UriSchemeHttps)
                    continue;
                jobs.Add(new ExternalJob(GetString(row, "title"), GetString(row, "company"), GetString(row, "locations"), GetString(row, "description"), url));
            }
        }
        var total = root.TryGetProperty("hits", out var hits) && hits.TryGetInt32(out var count) ? count : jobs.Count;
        return new ExternalJobSearchResponse(jobs, total, page);
    }

    private static string GetString(JsonElement row, string name) => row.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.String
        ? value.GetString() ?? string.Empty : string.Empty;
}
