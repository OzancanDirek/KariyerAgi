namespace CareerPath.Api.Enums;

public enum CustomCareerStatus
{
    Draft,
    Confirmed,
    Failed
}

public static class CustomCareerStatusExtensions
{
    public static string ToDatabaseCode(this CustomCareerStatus status)
    {
        return status switch
        {
            CustomCareerStatus.Draft => "draft",
            CustomCareerStatus.Confirmed => "confirmed",
            CustomCareerStatus.Failed => "failed",
            _ => throw new ArgumentOutOfRangeException(nameof(status))
        };
    }

    public static bool TryFromDatabaseCode(string? code, out CustomCareerStatus status)
    {
        switch (code)
        {
            case "draft": status = CustomCareerStatus.Draft; return true;
            case "confirmed": status = CustomCareerStatus.Confirmed; return true;
            case "failed": status = CustomCareerStatus.Failed; return true;
            default: status = default; return false;
        }
    }
}
