using System.Text.Json.Serialization;

namespace CareerPath.Api.Entities;

public class CvFile
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("aday_id")] public Guid CandidateId { get; set; }
    [JsonPropertyName("depolama_yolu")] public string StoragePath { get; set; } = string.Empty;
    [JsonPropertyName("orijinal_dosya_adi")] public string FileName { get; set; } = string.Empty;
    [JsonPropertyName("mime_tipi")] public string ContentType { get; set; } = string.Empty;
    [JsonPropertyName("boyut_bayt")] public long SizeBytes { get; set; }
    [JsonPropertyName("birincil_mi")] public bool IsPrimary { get; set; }
    [JsonPropertyName("olusturma_tarihi")] public DateTimeOffset CreatedAt { get; set; }
}
