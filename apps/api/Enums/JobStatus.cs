namespace CareerPath.Api.Enums;

public enum JobStatus
{
    Taslak,
    Yayinda,
    Kapali
}

public static class JobStatusExtensions
{
    public static string ToDatabaseCode(this JobStatus status)
    {
        return status switch
        {
            JobStatus.Taslak => "taslak",
            JobStatus.Yayinda => "yayinda",
            JobStatus.Kapali => "kapali",
            _ => throw new ArgumentOutOfRangeException(nameof(status))
        };
    }

    public static bool TryFromDatabaseCode(string? code, out JobStatus status)
    {
        switch (code)
        {
            case "taslak": status = JobStatus.Taslak; return true;
            case "yayinda": status = JobStatus.Yayinda; return true;
            case "kapali": status = JobStatus.Kapali; return true;
            default: status = default; return false;
        }
    }
}
