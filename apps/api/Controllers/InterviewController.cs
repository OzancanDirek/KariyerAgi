using CareerPath.Api.Infrastructure.Gemini;
using CareerPath.Api.Security;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/interview")]
public sealed class InterviewController(GeminiInterviewCoach coach, CurrentUserContextProvider currentUser) : ControllerBase
{
    public sealed record QuestionsRequest(string? JobText, string? Language);
    public sealed record ReviewRequest(string? JobText, List<InterviewAnswer>? Answers, string? Language);

    [HttpPost("questions")]
    public async Task<ActionResult<InterviewQuestions>> Questions(QuestionsRequest request, CancellationToken cancellationToken)
    {
        if (!ValidJobText(request.JobText) || !ValidLanguage(request.Language))
            return BadRequest(new { code = "INT-001", message = "İlan metni 100-10000 karakter olmalı ve dil seçimi geçerli olmalıdır." });
        await currentUser.ResolveAsync();
        try { return await coach.CreateQuestionsAsync(request.JobText!.Trim(), request.Language!, cancellationToken); }
        catch (Exception error) when (error is HttpRequestException or System.Text.Json.JsonException or InvalidOperationException or KeyNotFoundException or IndexOutOfRangeException
            || error is TaskCanceledException && !cancellationToken.IsCancellationRequested)
        { return StatusCode(502, new { code = "INT-002", message = "Mülakat soruları oluşturulamadı. Lütfen tekrar deneyin." }); }
    }

    [HttpPost("review")]
    public async Task<ActionResult<InterviewFeedback>> Review(ReviewRequest request, CancellationToken cancellationToken)
    {
        if (!ValidJobText(request.JobText) || !ValidLanguage(request.Language)
            || request.Answers is not { Count: 5 }
            || request.Answers.Any(item => string.IsNullOrWhiteSpace(item.Question) || item.Question.Length > 500
                || string.IsNullOrWhiteSpace(item.Answer) || item.Answer.Length > 3000))
            return BadRequest(new { code = "INT-001", message = "Beş sorunun her birine 1-3000 karakterlik yanıt verin." });
        await currentUser.ResolveAsync();
        try { return await coach.ReviewAsync(request.JobText!.Trim(), request.Answers, request.Language!, cancellationToken); }
        catch (Exception error) when (error is HttpRequestException or System.Text.Json.JsonException or InvalidOperationException or KeyNotFoundException or IndexOutOfRangeException
            || error is TaskCanceledException && !cancellationToken.IsCancellationRequested)
        { return StatusCode(502, new { code = "INT-002", message = "Mülakat değerlendirmesi oluşturulamadı. Lütfen tekrar deneyin." }); }
    }

    private static bool ValidJobText(string? value) => value?.Trim().Length is >= 100 and <= 10000;
    private static bool ValidLanguage(string? value) => value is "tr" or "en";
}
