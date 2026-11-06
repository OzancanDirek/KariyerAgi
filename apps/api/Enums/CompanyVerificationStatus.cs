namespace CareerPath.Api.Enums;

public enum CompanyVerificationStatus
{
    Beklemede,
    Onaylandi,
    Reddedildi
}

public static class CompanyVerificationStatusExtensions
{
    public static string ToDatabaseCode(this CompanyVerificationStatus status)
    {
        return status switch
        {
            CompanyVerificationStatus.Beklemede => "beklemede",
            CompanyVerificationStatus.Onaylandi => "onaylandi",
            CompanyVerificationStatus.Reddedildi => "reddedildi",
            _ => throw new ArgumentOutOfRangeException(nameof(status))
        };
    }
}
