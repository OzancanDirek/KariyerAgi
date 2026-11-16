using CareerPath.Api.Services.AccountClosure;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/account/closure")]
public sealed class AccountClosureController : ControllerBase
{
    private readonly IAccountClosureService service;

    public AccountClosureController(IAccountClosureService service) => this.service = service;

    [HttpPost]
    public async Task<ActionResult<AccountClosureResponse>> Close(CloseAccountRequest request)
        => await service.CloseAsync(request.Confirmation);
}

public sealed record CloseAccountRequest(string Confirmation);
