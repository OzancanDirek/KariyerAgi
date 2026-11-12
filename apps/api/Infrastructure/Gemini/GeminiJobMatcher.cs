using System.Net.Http.Json;
using System.Text.Json;
using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Enums;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Infrastructure.Gemini.Prompts;
using CareerPath.Api.Infrastructure.Pdf;

namespace CareerPath.Api.Infrastructure.Gemini;

public class GeminiJobMatcher
{
    private readonly HttpClient client;
    private readonly IConfiguration configuration;
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public GeminiJobMatcher(HttpClient client, IConfiguration configuration)
    {
        this.client = client;
        this.configuration = configuration;
    }

    public async Task<List<MatchCriterion>> DraftAsync(string title, string description, CancellationToken cancellationToken)
    {
        using var result = await GenerateAsync([new { text = JobMatchPrompts.Draft(title, description) }], cancellationToken);
        return JsonSerializer.Deserialize<CriteriaDraft>(ReadText(result), JsonOptions)?.Criteria ?? [];
    }

    public async Task<List<MatchVerdict>> EvaluateAsync(List<MatchCriterion> criteria, byte[] pdf, CancellationToken cancellationToken)
    {
        var selected = PdfCvInputSelector.Select(pdf, configuration["Gemini:PdfInputMode"]);
        object document = selected.Method == "pdf_text"
            ? new { text = selected.Text }
            : new { inlineData = new { mimeType = "application/pdf", data = Convert.ToBase64String(pdf) } };
        using var result = await GenerateAsync([new { text = JobMatchPrompts.Evaluate(criteria) }, document], cancellationToken);
        try
        {
            return JsonSerializer.Deserialize<VerdictDraft>(ReadText(result), JsonOptions)?.Results ?? [];
        }
        catch (JsonException)
        {
            throw new ApiException(ErrorCodes.JobMatchFailed);
        }
    }

    private async Task<JsonDocument> GenerateAsync(object[] parts, CancellationToken cancellationToken)
    {
        var key = configuration["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new ApiException(ErrorCodes.CvAnalysisNotConfigured);
        }

        var body = new { contents = new[] { new { parts } }, generationConfig = new { responseMimeType = "application/json" } };
        using var request = new HttpRequestMessage(HttpMethod.Post, $"https://generativelanguage.googleapis.com/v1beta/models/{GeminiCvAnalyzer.Model}:generateContent");
        request.Headers.Add("x-goog-api-key", key);
        request.Content = JsonContent.Create(body);
        try
        {
            using var response = await client.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                throw new ApiException(ErrorCodes.JobMatchFailed);
            }
            return await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
        }
        catch (HttpRequestException)
        {
            throw new ApiException(ErrorCodes.JobMatchFailed);
        }
        catch (JsonException)
        {
            throw new ApiException(ErrorCodes.JobMatchFailed);
        }
    }

    private static string ReadText(JsonDocument result)
    {
        try
        {
            return result.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString() ?? string.Empty;
        }
        catch (Exception exception) when (exception is KeyNotFoundException or IndexOutOfRangeException or InvalidOperationException)
        {
            throw new ApiException(ErrorCodes.JobMatchFailed);
        }
    }

    private class CriteriaDraft
    {
        public List<MatchCriterion> Criteria { get; set; } = [];
    }

    private class VerdictDraft
    {
        public List<MatchVerdict> Results { get; set; } = [];
    }
}

public class MatchVerdict
{
    public MatchVerdictStatus Verdict { get; set; }
    public string? Evidence { get; set; }
}
