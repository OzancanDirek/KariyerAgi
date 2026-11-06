namespace CareerPath.Api.Enums;

public enum JobEmploymentType
{
    TamZamanli,
    YariZamanli,
    Staj,
    Sozlesmeli
}

public static class JobEmploymentTypeExtensions
{
    public static string ToDatabaseCode(this JobEmploymentType type)
    {
        return type switch
        {
            JobEmploymentType.TamZamanli => "tam_zamanli",
            JobEmploymentType.YariZamanli => "yari_zamanli",
            JobEmploymentType.Staj => "staj",
            JobEmploymentType.Sozlesmeli => "sozlesmeli",
            _ => throw new ArgumentOutOfRangeException(nameof(type))
        };
    }

    public static bool TryFromDatabaseCode(string? code, out JobEmploymentType type)
    {
        switch (code)
        {
            case "tam_zamanli": type = JobEmploymentType.TamZamanli; return true;
            case "yari_zamanli": type = JobEmploymentType.YariZamanli; return true;
            case "staj": type = JobEmploymentType.Staj; return true;
            case "sozlesmeli": type = JobEmploymentType.Sozlesmeli; return true;
            default: type = default; return false;
        }
    }
}
