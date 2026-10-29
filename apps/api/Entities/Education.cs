using System.Text.Json.Serialization;

namespace CareerPath.Api.Entities;

public class Education
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("aday_id")] public Guid CandidateId { get; set; }
    [JsonPropertyName("kurum")] public string Institution { get; set; } = string.Empty;
    [JsonPropertyName("derece")] public string? Degree { get; set; }
    [JsonPropertyName("bolum")] public string? FieldOfStudy { get; set; }
    [JsonPropertyName("baslangic_tarihi")] public DateOnly? StartDate { get; set; }
    [JsonPropertyName("bitis_tarihi")] public DateOnly? EndDate { get; set; }
    [JsonPropertyName("not_ortalamasi")] public decimal? GradeAverage { get; set; }
    [JsonPropertyName("not_olcegi")] public short? GradeScale { get; set; }
    [JsonPropertyName("aciklama")] public string? Description { get; set; }
}
