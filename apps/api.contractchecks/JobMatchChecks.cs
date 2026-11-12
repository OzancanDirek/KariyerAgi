using System.Text.Json;
using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Enums;
using CareerPath.Api.Services.Job.Scoring;

public static class JobMatchChecks
{
    public static void Run()
    {
        var criteria = JsonSerializer.Deserialize<MatchCriteriaRow>("""{"ilan_id":"067063ea-449d-407e-866b-df8193ed8396","surum":1,"olcutler":[{"title":"Backend","description":"API geliştirme","weight":40,"required":true}]}""");
        if (criteria?.Criteria[0].Title != "Backend" || criteria.Criteria[0].Weight != 40 || !criteria.Criteria[0].Required)
        {
            throw new Exception("Kaydedilen iş ölçütleri veritabanından okunamadı.");
        }

        var score = JobMatchScoreCalculator.Calculate([
            new MatchEvidence { Weight = 40, Verdict = MatchVerdictStatus.Matched },
            new MatchEvidence { Weight = 30, Verdict = MatchVerdictStatus.Partial },
            new MatchEvidence { Weight = 20, Verdict = MatchVerdictStatus.NotFound },
            new MatchEvidence { Weight = 10, Verdict = MatchVerdictStatus.CannotDetermine }
        ]);
        if (score != 55)
        {
            throw new Exception("İlan uyumu ağırlıklı hesaplaması hatalı.");
        }

        var savedEvidence = JsonSerializer.Serialize(new MatchEvidence { Verdict = MatchVerdictStatus.CannotDetermine });
        if (!savedEvidence.Contains("\"verdict\":\"cannot_determine\""))
        {
            throw new Exception("Değerlendirme sonucu veritabanı biçiminde yazılamadı.");
        }
        var restoredEvidence = JsonSerializer.Deserialize<MatchEvidence>("""{"verdict":"not_found"}""");
        if (restoredEvidence?.Verdict != MatchVerdictStatus.NotFound)
        {
            throw new Exception("Değerlendirme sonucu veritabanından okunamadı.");
        }
    }
}
