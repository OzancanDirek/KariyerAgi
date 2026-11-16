using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.AccountClosure;
using CareerPath.Api.Repositories.Authentication;
using CareerPath.Api.Security;

namespace CareerPath.Api.Services.AccountClosure;

public sealed class AccountClosureServiceImpl : IAccountClosureService
{
    private readonly AccountClosureRepository repository;
    private readonly AuthenticationRepository authentication;
    private readonly CurrentUserContextProvider currentUser;

    public AccountClosureServiceImpl(AccountClosureRepository repository, AuthenticationRepository authentication,
        CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.authentication = authentication;
        this.currentUser = currentUser;
    }

    public async Task<AccountClosureResponse> CloseAsync(string confirmation)
    {
        if (confirmation != "HESABIMI KAPAT")
        {
            throw new ApiException(ErrorCodes.AccountClosureConfirmationRequired);
        }

        var identity = await currentUser.ResolveAsync();
        var row = await repository.RequestAsync(identity.AccessToken, currentUser.CancellationToken);
        try
        {
            await authentication.LogoutAsync(identity.AccessToken, currentUser.CancellationToken);
        }
        catch (ApiException)
        {
            // The database restriction takes effect atomically with closure.
            // A failed refresh-token revocation must not turn a committed closure into an error.
        }
        return new AccountClosureResponse(row.RequestId, row.ScheduledDeletionAt);
    }
}
