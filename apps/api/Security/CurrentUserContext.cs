namespace CareerPath.Api.Security;

public class CurrentUserContext
{
    public Guid UserId { get; }
    public string AccessToken { get; }

    public CurrentUserContext(Guid userId, string accessToken)
    {
        UserId = userId;
        AccessToken = accessToken;
    }
}
