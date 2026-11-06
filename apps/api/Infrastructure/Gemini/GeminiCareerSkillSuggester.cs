using CareerPath.Api.Infrastructure.Gemini.Prompts;
using System.Net.Http.Json;
using System.Text.Json;
using CareerPath.Api.Dtos.CustomCareer;
using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Infrastructure.Gemini;

public class GeminiCareerSkillSuggester
{
    private readonly HttpClient client;
    private readonly IConfiguration configuration;

    public GeminiCareerSkillSuggester(HttpClient client, IConfiguration configuration)
    {
        this.client = client;
        this.configuration = configuration;
    }

    public async Task<List<CustomCareerSkill>> SuggestAsync(string title, IReadOnlyList<string> existingSkills, IReadOnlyList<string> catalogSkills, CancellationToken cancellationToken)
    {
        var key = configuration["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new ApiException(ErrorCodes.RoadmapPlannerNotConfigured);
        }

        var input = JsonSerializer.Serialize(new { targetOccupation = title, existingSkills, catalogSkills });
        var prompt = CareerSkillsPrompt.Text + input;
        var body = new
        {
            contents = new[] { new { parts = new[] { new { text = prompt } } } },
            generationConfig = new
            {
                responseMimeType = "application/json",
                responseSchema = new
                {
                    type = "OBJECT",
                    properties = new
                    {
                        skills = new
                        {
                            type = "ARRAY",
                            items = new
                            {
                                type = "OBJECT",
                                properties = new
                                {
                                    name = new { type = "STRING" },
                                    reason = new { type = "STRING" },
                                    exercise = new { type = "STRING" }
                                },
                                required = new[] { "name", "reason", "exercise" }
                            }
                        }
                    },
                    required = new[] { "skills" }
                }
            }
        };
        using var request = new HttpRequestMessage(HttpMethod.Post, $"https://generativelanguage.googleapis.com/v1beta/models/{GeminiCvAnalyzer.Model}:generateContent");
        request.Headers.Add("x-goog-api-key", key);
        request.Content = JsonContent.Create(body);
        try
        {
            using var response = await client.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                throw new ApiException(ErrorCodes.CustomCareerGenerationFailed);
            }
            using var result = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
            var raw = result.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();
            var generated = JsonSerializer.Deserialize<GeneratedSkills>(raw ?? "", new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            return generated?.Skills ?? throw new ApiException(ErrorCodes.CustomCareerGenerationFailed);
        }
        catch (HttpRequestException)
        {
            throw new ApiException(ErrorCodes.CustomCareerGenerationFailed);
        }
        catch (JsonException)
        {
            throw new ApiException(ErrorCodes.CustomCareerGenerationFailed);
        }
        catch (InvalidOperationException)
        {
            throw new ApiException(ErrorCodes.CustomCareerGenerationFailed);
        }
        catch (IndexOutOfRangeException)
        {
            throw new ApiException(ErrorCodes.CustomCareerGenerationFailed);
        }
        catch (KeyNotFoundException)
        {
            throw new ApiException(ErrorCodes.CustomCareerGenerationFailed);
        }
    }

    private class GeneratedSkills
    {
        public List<CustomCareerSkill> Skills { get; set; } = new();
    }
}
