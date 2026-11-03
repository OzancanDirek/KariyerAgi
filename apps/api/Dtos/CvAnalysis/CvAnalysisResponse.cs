using System.Text.Json.Serialization;
using CareerPath.Api.Services.CvAnalysis.Scoring;

namespace CareerPath.Api.Dtos.CvAnalysis;

public class CvAnalysisResponse
{
    [JsonPropertyName("id")] public Guid Id { get; set; }
    [JsonPropertyName("cv_dosyasi_id")] public Guid CvFileId { get; set; }
    [JsonPropertyName("model_surumu")] public string ModelVersion { get; set; } = string.Empty;
    [JsonPropertyName("ozet")] public string Summary { get; set; } = string.Empty;
    [JsonPropertyName("beceriler")] public List<string> Skills { get; set; } = [];
    [JsonPropertyName("egitim_ozeti")] public string EducationSummary { get; set; } = string.Empty;
    [JsonPropertyName("deneyim_ozeti")] public string ExperienceSummary { get; set; } = string.Empty;
    [JsonPropertyName("guclu_yonler")] public List<string> Strengths { get; set; } = [];
    [JsonPropertyName("oneriler")] public List<string> Suggestions { get; set; } = [];
    [JsonPropertyName("olusturma_tarihi")] public DateTimeOffset CreatedAt { get; set; }
    [JsonPropertyName("girdi_token_sayisi")] public int InputTokens { get; set; }
    [JsonPropertyName("cikti_token_sayisi")] public int OutputTokens { get; set; }
    [JsonPropertyName("toplam_token_sayisi")] public int TotalTokens { get; set; }
    [JsonPropertyName("gorsel_token_sayisi")] public int ImageTokens { get; set; }
    [JsonPropertyName("girdi_yontemi")] public string InputMethod { get; set; } = string.Empty;
    [JsonPropertyName("ats_skoru")] public int? AtsScore { get; set; }
    [JsonPropertyName("bicim_skoru")] public int? FormatScore { get; set; }
    [JsonPropertyName("icerik_skoru")] public int? ContentScore { get; set; }
    [JsonPropertyName("genel_skor")] public int? OverallScore { get; set; }
    [JsonPropertyName("puan_detaylari")] public CvScoreReport? ScoreDetails { get; set; }
}
