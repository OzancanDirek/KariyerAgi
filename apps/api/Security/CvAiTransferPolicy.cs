using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Security;

public sealed class CvAiTransferPolicy(IConfiguration configuration)
{
    public bool IsEnabled => configuration.GetValue<bool>("Privacy:CvAiTransferEnabled");

    public void RequireEnabled()
    {
        if (!IsEnabled)
        {
            throw new ApiException(ErrorCodes.CvAiTransferUnavailable);
        }
    }
}
