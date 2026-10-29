namespace CareerPath.Api.Security;

public class HttpRequestContext
{
    private readonly IHttpContextAccessor accessor;

    public HttpRequestContext(IHttpContextAccessor accessor)
    {
        this.accessor = accessor;
    }

    public CancellationToken CancellationToken
    {
        get
        {
            return GetHttpContext().RequestAborted;
        }
    }

    public string AccessToken
    {
        get
        {
            return BearerTokenReader.Read(GetHttpContext().Request.Headers.Authorization.ToString());
        }
    }

    private HttpContext GetHttpContext()
    {
        var context = accessor.HttpContext;
        if (context is null)
        {
            throw new InvalidOperationException("Bu işlem yalnızca HTTP isteği kapsamında çalıştırılabilir.");
        }

        return context;
    }
}
