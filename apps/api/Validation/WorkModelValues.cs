namespace CareerPath.Api.Validation;

public static class WorkModelValues
{
    public static readonly IReadOnlySet<string> Allowed = new HashSet<string>(StringComparer.Ordinal)
    {
        "uzaktan", "hibrit", "ofis"
    };
}
