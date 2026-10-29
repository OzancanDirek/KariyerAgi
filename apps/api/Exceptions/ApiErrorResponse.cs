namespace CareerPath.Api.Exceptions;

public class ApiErrorResponse
{
    public DateTimeOffset Timestamp { get; set; }
    public int Status { get; set; }
    public string Error { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
}
