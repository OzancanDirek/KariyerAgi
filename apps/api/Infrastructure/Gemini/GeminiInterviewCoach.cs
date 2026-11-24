using System.Net.Http.Json;
using System.Text.Json;
using CareerPath.Api.Infrastructure.Gemini.Prompts;

namespace CareerPath.Api.Infrastructure.Gemini;

public sealed record InterviewQuestions(IReadOnlyList<string> Questions);
public sealed record InterviewAnswer(string Question, string Answer);
public sealed record InterviewFeedbackItem(string Strength, string Improvement, string Suggestion);
public sealed record InterviewFeedback(IReadOnlyList<InterviewFeedbackItem> Feedback, string Summary);

public sealed class GeminiInterviewCoach(HttpClient client, IConfiguration configuration)
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public async Task<InterviewQuestions> CreateQuestionsAsync(string jobText, string language, CancellationToken cancellationToken)
    {
        var result = await GenerateAsync(InterviewPrompt.Questions, new { jobText, language }, cancellationToken);
        var questions = JsonSerializer.Deserialize<InterviewQuestions>(result, JsonOptions);
        if (questions?.Questions is not { Count: 5 } || questions.Questions.Any(string.IsNullOrWhiteSpace))
            throw new InvalidOperationException("Invalid interview questions response.");
        return questions;
    }

    public async Task<InterviewFeedback> ReviewAsync(string jobText, IReadOnlyList<InterviewAnswer> answers, string language, CancellationToken cancellationToken)
    {
        var result = await GenerateAsync(InterviewPrompt.Feedback, new { jobText, answers, language }, cancellationToken);
        var feedback = JsonSerializer.Deserialize<InterviewFeedback>(result, JsonOptions);
        if (feedback?.Feedback?.Count != answers.Count || string.IsNullOrWhiteSpace(feedback.Summary))
            throw new InvalidOperationException("Invalid interview feedback response.");
        return feedback;
    }

    private async Task<string> GenerateAsync(string instruction, object input, CancellationToken cancellationToken)
    {
        var key = configuration["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(key))
            throw new InvalidOperationException("Gemini API key is not configured.");

        var body = new
        {
            systemInstruction = new { parts = new[] { new { text = instruction } } },
            contents = new[] { new { role = "user", parts = new[] { new { text = JsonSerializer.Serialize(input) } } } },
            generationConfig = new { responseMimeType = "application/json" }
        };
        using var request = new HttpRequestMessage(HttpMethod.Post,
            $"https://generativelanguage.googleapis.com/v1beta/models/{GeminiCvAnalyzer.Model}:generateContent");
        request.Headers.Add("x-goog-api-key", key);
        request.Content = JsonContent.Create(body);
        using var response = await client.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
        using var document = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
        return document.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString()
            ?? throw new InvalidOperationException("Empty interview response.");
    }
}
