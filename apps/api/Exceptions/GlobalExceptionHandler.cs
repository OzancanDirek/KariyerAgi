namespace CareerPath.Api.Exceptions;

public class GlobalExceptionHandler
{
    private readonly RequestDelegate next;
    private readonly ILogger<GlobalExceptionHandler> logger;

    public GlobalExceptionHandler(RequestDelegate next, ILogger<GlobalExceptionHandler> logger)
    {
        this.next = next;
        this.logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (OperationCanceledException) when (context.RequestAborted.IsCancellationRequested)
        {
        }
        catch (ApiException exception)
        {
            var response = ApiErrorResponseFactory.Create(exception.ErrorCode, context.Request.Path.ToString(), exception.Message);
            context.Response.StatusCode = response.Status;
            await context.Response.WriteAsJsonAsync(response);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Beklenmeyen API hatası. Yol: {Path}", context.Request.Path);
            var response = ApiErrorResponseFactory.Create(ErrorCodes.Unexpected, context.Request.Path.ToString());
            context.Response.StatusCode = response.Status;
            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
