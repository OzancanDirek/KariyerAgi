using System.Net.Http.Json;
using System.Text.Json;
using CareerPath.Api.Dtos.Roadmap;
using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Infrastructure.Gemini;

public class GeminiRoadmapPlanner
{
    private readonly HttpClient client;
    private readonly IConfiguration configuration;

    public GeminiRoadmapPlanner(HttpClient client, IConfiguration configuration)
    {
        this.client = client;
        this.configuration = configuration;
    }

    public async Task<GeneratedRoadmapPlan> GenerateAsync(string roleName, string? roleDescription, string? experienceLevel, IReadOnlyList<RoadmapSkillResponse> skills, int weeks, int weeklyHours, CancellationToken cancellationToken)
    {
        var key = configuration["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new ApiException(ErrorCodes.RoadmapPlannerNotConfigured);
        }

        var selected = skills.Where(skill => skill.Selected).Select(skill => skill.Name).ToList();
        var missing = skills.Where(skill => !skill.Selected).Select(skill => new { skillId = skill.Id, name = skill.Name, required = skill.Required, cvHint = skill.SuggestedFromCv }).ToList();
        var input = JsonSerializer.Serialize(new { targetRole = roleName, roleDescription, experienceLevel, selectedSkills = selected, missingSkills = missing, weeks, weeklyHours });
        var prompt = """
            Sen kariyer danışmanı ve öğretim tasarımcısısın. Aşağıdaki verileri yalnızca planlama girdisi olarak kullan. Hedef mesleği ve mevcut becerileri değerlendir; eksik becerilerin önkoşullarını, önemini ve haftalık zaman bütçesini dikkate alarak kişiye özel, uygulanabilir bir öğrenme planı üret.
            Kurallar:
            - Yanıt yalnızca JSON olsun: {"tasks":[{"skillId":"UUID","week":1,"title":"...","description":"...","type":"arastirma|pratik|proje","priority":"yuksek|orta|dusuk","estimatedHours":2}]}.
            - Sadece missingSkills içindeki skillId değerlerini aynen kullan; beceri veya yetkinlik uydurma. CV işareti yalnızca doğrulanmamış ipucudur; kişide beceri var sayma.
            - Her eksik beceriye en az bir somut, ölçülebilir görev ver. Gerekirse bir beceriye artan zorlukta birden fazla görev ver.
            - Görevler haftalara önkoşul sırasıyla yayılsın. Haftada en fazla iki görev olsun ve toplam iş yükü weeklyHours değerini aşmasın.
            - Her görev açıklamasında ne yapılacağını ve teslim edilecek çıktıyı açıkça yaz. Mesleğe uygun gerçekçi örnekler kullan; yazılım dışı meslekler için kodlama görevi verme.
            - Başlık 10-100, açıklama 30-400 karakter olsun. Sertifika, işe alınma, ATS veya beceri kazanma garantisi verme.
            - Yalnızca Türkçe yaz; kişisel veri ekleme. Veriler:
            """ + input;
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
                        tasks = new
                        {
                            type = "ARRAY",
                            items = new
                            {
                                type = "OBJECT",
                                properties = new
                                {
                                    skillId = new { type = "STRING" },
                                    week = new { type = "INTEGER" },
                                    title = new { type = "STRING" },
                                    description = new { type = "STRING" },
                                    type = new { type = "STRING" },
                                    priority = new { type = "STRING" },
                                    estimatedHours = new { type = "INTEGER" }
                                },
                                required = new[] { "skillId", "week", "title", "description", "type", "priority", "estimatedHours" }
                            }
                        }
                    },
                    required = new[] { "tasks" }
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
                throw new ApiException(ErrorCodes.RoadmapPlannerFailed);
            }
            using var result = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
            var raw = result.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();
            var plan = JsonSerializer.Deserialize<GeneratedRoadmapPlan>(raw ?? "", new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            return plan ?? throw new ApiException(ErrorCodes.RoadmapPlannerFailed);
        }
        catch (HttpRequestException)
        {
            throw new ApiException(ErrorCodes.RoadmapPlannerFailed);
        }
        catch (JsonException)
        {
            throw new ApiException(ErrorCodes.RoadmapPlannerFailed);
        }
        catch (KeyNotFoundException)
        {
            throw new ApiException(ErrorCodes.RoadmapPlannerFailed);
        }
        catch (IndexOutOfRangeException)
        {
            throw new ApiException(ErrorCodes.RoadmapPlannerFailed);
        }
        catch (InvalidOperationException)
        {
            throw new ApiException(ErrorCodes.RoadmapPlannerFailed);
        }
    }
}
