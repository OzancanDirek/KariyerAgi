namespace CareerPath.Api.Exceptions;

public class ApiException : Exception
{
    public ErrorDefinition ErrorCode { get; }

    public ApiException(ErrorDefinition errorCode) : base(errorCode.Message)
    {
        ErrorCode = errorCode;
    }
}
