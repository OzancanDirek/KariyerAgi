using System.Text.Json;
using CareerPath.Api.Dtos.CvAnalysis;
using CareerPath.Api.Infrastructure.Gemini;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.CvAnalysis;

public class CvAnalysisRepository
{
    private const string Columns = "id,cv_dosyasi_id,model_surumu,ozet,beceriler,egitim_ozeti,deneyim_ozeti,guclu_yonler,oneriler,olusturma_tarihi,girdi_token_sayisi,cikti_token_sayisi,toplam_token_sayisi,gorsel_token_sayisi,girdi_yontemi,ats_skoru,bicim_skoru,icerik_skoru,genel_skor,puan_detaylari";
    private readonly SupabaseRestClient client;

    public CvAnalysisRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<CvAnalysisResponse?> GetLatestAsync(Guid candidateId, Guid cvFileId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"cv_analizleri?aday_id=eq.{candidateId:D}&cv_dosyasi_id=eq.{cvFileId:D}&is_deleted=eq.false&select={Columns}&order=olusturma_tarihi.desc&limit=1", null, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CvAnalysisResponse>(result.RootElement);
    }

    public async Task<CvAnalysisQuotaResponse> GetQuotaAsync(string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "rpc/cv_analizi_kotasi", new { }, token, cancellationToken);
        var quota = JsonSerializer.Deserialize<CvAnalysisQuotaResponse>(result.RootElement.GetRawText(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        return quota ?? throw new InvalidOperationException("CV analiz kotası okunamadı.");
    }

    public async Task<Guid?> ReserveAnalysisAsync(string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "rpc/cv_analizi_hakki_ayir", new { }, token, cancellationToken);
        if (result.RootElement.ValueKind == JsonValueKind.Null)
        {
            return null;
        }
        return result.RootElement.GetGuid();
    }

    public async Task<CvAnalysisResponse?> CreateAsync(Guid candidateId, Guid cvFileId, Guid quotaRequestId, string model, CvAnalysisResult analysis, string token, CancellationToken cancellationToken)
    {
        var content = analysis.Content;
        var body = new Dictionary<string, object?>
        {
            ["aday_id"] = candidateId,
            ["cv_dosyasi_id"] = cvFileId,
            ["kota_istegi_id"] = quotaRequestId,
            ["model_surumu"] = model,
            ["ozet"] = content.Summary,
            ["beceriler"] = content.Skills,
            ["egitim_ozeti"] = content.EducationSummary,
            ["deneyim_ozeti"] = content.ExperienceSummary,
            ["guclu_yonler"] = content.Strengths,
            ["oneriler"] = content.Suggestions,
            ["girdi_token_sayisi"] = analysis.InputTokens,
            ["cikti_token_sayisi"] = analysis.OutputTokens,
            ["toplam_token_sayisi"] = analysis.TotalTokens,
            ["gorsel_token_sayisi"] = analysis.ImageTokens,
            ["girdi_yontemi"] = analysis.InputMethod,
            ["ats_skoru"] = analysis.Scores.AtsScore,
            ["bicim_skoru"] = analysis.Scores.FormatScore,
            ["icerik_skoru"] = analysis.Scores.ContentScore,
            ["genel_skor"] = analysis.Scores.OverallScore,
            ["puan_detaylari"] = analysis.Scores
        };
        using var result = await client.SendAsync(HttpMethod.Post, $"cv_analizleri?select={Columns}", body, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<CvAnalysisResponse>(result.RootElement);
    }
}
