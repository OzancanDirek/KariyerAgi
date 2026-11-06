using CareerPath.Api.Infrastructure.Gemini.Prompts;
using CareerPath.Api.Infrastructure.Pdf;
using System.Net.Http.Json;
using System.Text.Json;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Dtos.CvAnalysis;
using CareerPath.Api.Services.CvAnalysis.Scoring;

namespace CareerPath.Api.Infrastructure.Gemini;

public class GeminiCvAnalyzer
{
    public const string Model = "gemini-3.8-flash";

    private readonly HttpClient client;
    private readonly IConfiguration configuration;

    public GeminiCvAnalyzer(HttpClient client, IConfiguration configuration)
    {
        this.client = client;
        this.configuration = configuration;
    }

    public void EnsureConfigured()
    {
        if (string.IsNullOrWhiteSpace(configuration["Gemini:ApiKey"]))
        {
            throw new ApiException(ErrorCodes.CvAnalysisNotConfigured);
        }
    }

    public async Task<CvAnalysisResult> AnalyzeAsync(byte[] bytes, string contentType, CancellationToken cancellationToken)
    {
        var key = configuration["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new ApiException(ErrorCodes.CvAnalysisNotConfigured);
        }

        object documentPart;
        string inputMethod;
        if (contentType == "application/pdf")
        {
            var selection = PdfCvInputSelector.Select(bytes, configuration["Gemini:PdfInputMode"]);
            if (selection.Method == "pdf_text")
            {
                documentPart = new { text = selection.Text };
            }
            else
            {
                documentPart = new { inlineData = new { mimeType = "application/pdf", data = Convert.ToBase64String(bytes) } };
            }
            inputMethod = selection.Method;
        }
        else
        {
            throw new ApiException(ErrorCodes.CvFileInvalid);
        }

        var body = new
        {
            contents = new[] { new { parts = new object[] { new { text = CvAnalysisPrompt.Text }, documentPart } } },
            generationConfig = new { responseMimeType = "application/json" }
        };
        using var request = new HttpRequestMessage(HttpMethod.Post, $"https://generativelanguage.googleapis.com/v1beta/models/{Model}:generateContent");
        request.Headers.Add("x-goog-api-key", key);
        request.Content = JsonContent.Create(body);
        try
        {
            using var response = await client.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                throw new ApiException(ErrorCodes.CvAnalysisFailed);
            }
            using var result = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
            var raw = result.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();
            var content = JsonSerializer.Deserialize<CvAnalysisContent>(raw ?? "", new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (content is null || string.IsNullOrWhiteSpace(content.Summary))
            {
                throw new ApiException(ErrorCodes.CvAnalysisFailed);
            }
            content.Summary = Limit(content.Summary, 600);
            content.EducationSummary = Limit(content.EducationSummary, 500);
            content.ExperienceSummary = Limit(content.ExperienceSummary, 500);
            content.Skills = CleanList(content.Skills, 20);
            content.Strengths = CleanList(content.Strengths, 5);
            content.Suggestions = CleanList(content.Suggestions, 5);
            var usage = result.RootElement.TryGetProperty("usageMetadata", out var metadata) ? metadata : default;
            var imageTokens = 0;
            if (usage.ValueKind == JsonValueKind.Object && usage.TryGetProperty("promptTokensDetails", out var details) && details.ValueKind == JsonValueKind.Array)
            {
                foreach (var detail in details.EnumerateArray())
                {
                    if (detail.TryGetProperty("modality", out var modality) && modality.GetString() == "IMAGE")
                    {
                        imageTokens += ReadTokenCount(detail, "tokenCount");
                    }
                }
            }
            return new CvAnalysisResult
            {
                Content = content,
                Scores = CvScoreEvaluator.Evaluate(bytes, content),
                InputTokens = ReadTokenCount(usage, "promptTokenCount"),
                OutputTokens = ReadTokenCount(usage, "candidatesTokenCount"),
                TotalTokens = ReadTokenCount(usage, "totalTokenCount"),
                ImageTokens = imageTokens,
                InputMethod = inputMethod
            };
        }
        catch (HttpRequestException)
        {
            throw new ApiException(ErrorCodes.CvAnalysisFailed);
        }
        catch (JsonException)
        {
            throw new ApiException(ErrorCodes.CvAnalysisFailed);
        }
        catch (KeyNotFoundException)
        {
            throw new ApiException(ErrorCodes.CvAnalysisFailed);
        }
        catch (IndexOutOfRangeException)
        {
            throw new ApiException(ErrorCodes.CvAnalysisFailed);
        }
    }

    private static int ReadTokenCount(JsonElement value, string name)
    {
        if (value.ValueKind == JsonValueKind.Object && value.TryGetProperty(name, out var count) && count.TryGetInt32(out var tokens))
        {
            return tokens;
        }
        return 0;
    }

    private static string Limit(string? value, int maxLength)
    {
        var normalized = (value ?? string.Empty).Trim();
        return normalized[..Math.Min(normalized.Length, maxLength)];
    }

    private static List<string> CleanList(List<string>? values, int maxItems)
    {
        return (values ?? []).Where(value => !string.IsNullOrWhiteSpace(value))
            .Select(value => Limit(value, 160)).Distinct(StringComparer.OrdinalIgnoreCase).Take(maxItems).ToList();
    }
}
