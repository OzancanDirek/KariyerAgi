namespace CareerPath.Api.Enums;

public enum JobWorkModel
{
    Uzaktan,
    Hibrit,
    Ofis
}

public static class JobWorkModelExtensions
{
    public static string ToDatabaseCode(this JobWorkModel model)
    {
        return model switch
        {
            JobWorkModel.Uzaktan => "uzaktan",
            JobWorkModel.Hibrit => "hibrit",
            JobWorkModel.Ofis => "ofis",
            _ => throw new ArgumentOutOfRangeException(nameof(model))
        };
    }

    public static bool TryFromDatabaseCode(string? code, out JobWorkModel model)
    {
        switch (code)
        {
            case "uzaktan": model = JobWorkModel.Uzaktan; return true;
            case "hibrit": model = JobWorkModel.Hibrit; return true;
            case "ofis": model = JobWorkModel.Ofis; return true;
            default: model = default; return false;
        }
    }
}
