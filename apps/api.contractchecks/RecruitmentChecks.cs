using System.Text.Json;
using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Dtos.CustomCareer;
using CareerPath.Api.Dtos.LearningResource;
using CareerPath.Api.Enums;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Mappers;
using CareerPath.Api.Validation;

internal static class RecruitmentChecks
{
    public static void Run()
    {
        var request = new JobRequest
        {
            CompanyId = Guid.NewGuid(),
            Title = "  Yazılım Geliştirici  ",
            Description = new string('A', 50),
            WorkModel = JobWorkModel.Hibrit.ToDatabaseCode(),
            EmploymentType = JobEmploymentType.TamZamanli.ToDatabaseCode(),
            Status = JobStatus.Yayinda.ToDatabaseCode(),
            ApplicationDeadline = DateTimeOffset.UtcNow.AddDays(7)
        };

        var values = JobValidator.Normalize(request);
        using var json = JsonDocument.Parse(JsonSerializer.Serialize(values));
        if (json.RootElement.GetProperty("baslik").GetString() != "Yazılım Geliştirici"
            || json.RootElement.GetProperty("durum").GetString() != "yayinda"
            || json.RootElement.GetProperty("calisma_modeli").GetString() != "hibrit"
            || json.RootElement.TryGetProperty("Title", out _))
        {
            throw new Exception("İlan veritabanı alanları yanlış eşleştirildi.");
        }

        request.Status = "yanlis_durum";
        ExpectInvalid(request);
        request.Status = JobStatus.Yayinda.ToDatabaseCode();
        request.ApplicationDeadline = DateTimeOffset.UtcNow.AddDays(-1);
        ExpectInvalid(request);

        var expired = RecruitmentMapper.ToResponse(new JobRow
        {
            Status = JobStatus.Yayinda.ToDatabaseCode(),
            ApplicationDeadline = DateTimeOffset.UtcNow.AddDays(-1)
        });
        if (expired.Status != JobStatus.Kapali.ToDatabaseCode())
        {
            throw new Exception("Süresi geçmiş ilan kapalı gösterilmedi.");
        }

        var application = RecruitmentMapper.ToResponse(new ApplicationRow { CandidateName = "Ozan Direk" });
        if (application.CandidateName != "Ozan Direk")
        {
            throw new Exception("Aday adı başvuru yanıtına taşınmadı.");
        }

        var company = CompanyValidator.Normalize(new CompanyRequest { Name = "  Test Şirketi  " });
        using var companyJson = JsonDocument.Parse(JsonSerializer.Serialize(company));
        if (companyJson.RootElement.GetProperty("ad").GetString() != "Test Şirketi"
            || companyJson.RootElement.TryGetProperty("sahip_kullanici_id", out _))
        {
            throw new Exception("Şirket veritabanı alanları yanlış eşleştirildi.");
        }

        using var careerJson = JsonDocument.Parse(JsonSerializer.Serialize(new CustomCareerUpdateValues
        {
            Status = CustomCareerStatus.Failed.ToDatabaseCode()
        }));
        if (careerJson.RootElement.TryGetProperty("oneriler", out _)
            || careerJson.RootElement.TryGetProperty("onaylananlar", out _))
        {
            throw new Exception("Meslek taslağı güncellemesi diğer alanları siliyor.");
        }

        var resource = LearningResourceValidator.Normalize(new SaveLearningResourceRequest
        {
            SkillId = Guid.NewGuid(),
            Title = "  Örnek Eğitim  ",
            Provider = "  Eğitim Kurumu  ",
            Url = "https://example.com/course",
            Type = "kurs",
            Language = "tr",
            Level = "baslangic"
        });
        using var resourceJson = JsonDocument.Parse(JsonSerializer.Serialize(resource));
        if (resourceJson.RootElement.GetProperty("baslik").GetString() != "Örnek Eğitim"
            || resourceJson.RootElement.GetProperty("saglayici").GetString() != "Eğitim Kurumu")
        {
            throw new Exception("Eğitim kaynağı alanları yanlış eşleştirildi.");
        }
    }

    private static void ExpectInvalid(JobRequest request)
    {
        try
        {
            JobValidator.Normalize(request);
        }
        catch (ApiException)
        {
            return;
        }

        throw new Exception("Geçersiz ilan kabul edildi.");
    }
}
