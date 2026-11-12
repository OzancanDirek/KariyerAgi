using System.Text.Json;
using System.Text.Json.Serialization;

namespace CareerPath.Api.Enums;

[JsonConverter(typeof(MatchVerdictStatusJsonConverter))]
public enum MatchVerdictStatus
{
    Matched,
    Partial,
    NotFound,
    CannotDetermine
}

public class MatchVerdictStatusJsonConverter : JsonStringEnumConverter<MatchVerdictStatus>
{
    public MatchVerdictStatusJsonConverter() : base(JsonNamingPolicy.SnakeCaseLower, allowIntegerValues: false)
    {
    }
}
