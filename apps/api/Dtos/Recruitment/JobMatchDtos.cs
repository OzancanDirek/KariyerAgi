using System.Text.Json.Serialization;
using CareerPath.Api.Enums;

namespace CareerPath.Api.Dtos.Recruitment;

public class MatchCriterion
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    [JsonPropertyName("weight")]
    public int Weight { get; set; }
    [JsonPropertyName("required")]
    public bool Required { get; set; }
}

public class MatchCriteriaRequest
{
    public List<MatchCriterion> Criteria { get; set; } = [];
}

public class MatchCriteriaResponse
{
    public Guid JobId { get; set; }
    public int Version { get; set; }
    public List<MatchCriterion> Criteria { get; set; } = [];
}

public class MatchEvidence
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    [JsonPropertyName("verdict")]
    public MatchVerdictStatus Verdict { get; set; }
    [JsonPropertyName("evidence")]
    public string? Evidence { get; set; }
    [JsonPropertyName("weight")]
    public int Weight { get; set; }
    [JsonPropertyName("required")]
    public bool Required { get; set; }
}

public class ApplicationMatchResponse
{
    public Guid ApplicationId { get; set; }
    public Guid JobId { get; set; }
    public int CriteriaVersion { get; set; }
    public int Score { get; set; }
    public List<MatchEvidence> Evidence { get; set; } = [];
    public DateTimeOffset CreatedAt { get; set; }
}

public class MatchCriteriaRow
{
    [JsonPropertyName("ilan_id")] public Guid JobId { get; set; }
    [JsonPropertyName("surum")] public int Version { get; set; }
    [JsonPropertyName("olcutler")] public List<MatchCriterion> Criteria { get; set; } = [];
}

public class ApplicationMatchRow
{
    [JsonPropertyName("basvuru_id")] public Guid ApplicationId { get; set; }
    [JsonPropertyName("ilan_id")] public Guid JobId { get; set; }
    [JsonPropertyName("olcut_surumu")] public int CriteriaVersion { get; set; }
    [JsonPropertyName("puan")] public int Score { get; set; }
    [JsonPropertyName("dayanaklar")] public List<MatchEvidence> Evidence { get; set; } = [];
    [JsonPropertyName("olusturma_tarihi")] public DateTimeOffset CreatedAt { get; set; }
}
