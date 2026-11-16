namespace CareerPath.Api.Services.AccountClosure;

public interface IAccountClosureService
{
    Task<AccountClosureResponse> CloseAsync(string confirmation);
}

public sealed record AccountClosureResponse(Guid RequestId, DateTimeOffset ScheduledDeletionAt);
