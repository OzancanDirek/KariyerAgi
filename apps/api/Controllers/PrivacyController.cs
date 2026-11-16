using CareerPath.Api.Security;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/privacy")]
public sealed class PrivacyController(CvAiTransferPolicy cvAiTransferPolicy) : ControllerBase
{
    [HttpGet("cv-ai-status")]
    public IActionResult GetCvAiStatus() => Ok(new { enabled = cvAiTransferPolicy.IsEnabled });
}
