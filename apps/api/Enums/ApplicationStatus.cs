namespace CareerPath.Api.Enums;

public enum ApplicationStatus
{
    Gonderildi,
    Inceleniyor,
    Mulakat,
    Teklif,
    Reddedildi,
    GeriCekildi
}

public static class ApplicationStatusExtensions
{
    public static string ToDatabaseCode(this ApplicationStatus status)
    {
        return status switch
        {
            ApplicationStatus.Gonderildi => "gonderildi",
            ApplicationStatus.Inceleniyor => "inceleniyor",
            ApplicationStatus.Mulakat => "mulakat",
            ApplicationStatus.Teklif => "teklif",
            ApplicationStatus.Reddedildi => "reddedildi",
            ApplicationStatus.GeriCekildi => "geri_cekildi",
            _ => throw new ArgumentOutOfRangeException(nameof(status))
        };
    }

    public static bool TryFromDatabaseCode(string? code, out ApplicationStatus status)
    {
        switch (code)
        {
            case "gonderildi": status = ApplicationStatus.Gonderildi; return true;
            case "inceleniyor": status = ApplicationStatus.Inceleniyor; return true;
            case "mulakat": status = ApplicationStatus.Mulakat; return true;
            case "teklif": status = ApplicationStatus.Teklif; return true;
            case "reddedildi": status = ApplicationStatus.Reddedildi; return true;
            case "geri_cekildi": status = ApplicationStatus.GeriCekildi; return true;
            default: status = default; return false;
        }
    }

    public static bool CanEmployerSet(this ApplicationStatus status)
    {
        return status is ApplicationStatus.Inceleniyor or ApplicationStatus.Mulakat
            or ApplicationStatus.Teklif or ApplicationStatus.Reddedildi;
    }
}
