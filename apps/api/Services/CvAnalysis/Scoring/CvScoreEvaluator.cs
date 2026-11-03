using System.Text.RegularExpressions;
using CareerPath.Api.Dtos.CvAnalysis;
using CareerPath.Api.Infrastructure.Pdf;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;

namespace CareerPath.Api.Services.CvAnalysis.Scoring;

public class CvScoreCheck
{
    public required string Label { get; init; }
    public int Points { get; init; }
    public bool Passed { get; init; }
}

public class CvScoreReport
{
    public string Version { get; init; } = "v2";
    public int AtsScore { get; init; }
    public int FormatScore { get; init; }
    public int ContentScore { get; init; }
    public int OverallScore { get; init; }
    public List<CvScoreCheck> AtsChecks { get; init; } = [];
    public List<CvScoreCheck> FormatChecks { get; init; } = [];
    public List<CvScoreCheck> ContentChecks { get; init; } = [];
}

public static class CvScoreEvaluator
{
    public static CvScoreReport Evaluate(byte[] pdf, CvAnalysisContent content)
    {
        string text;
        var everyPageReadable = false;
        try
        {
            using var document = PdfDocument.Open(pdf);
            var pages = document.GetPages().ToList();
            var pageTexts = pages.Select(page => ContentOrderTextExtractor.GetText(page)).ToList();
            text = string.Join("\n", pageTexts);
            everyPageReadable = pageTexts.Count > 0 && pageTexts.All(pageText => pageText.Count(char.IsLetter) >= 30);
        }
        catch (Exception exception) when (exception is IOException or InvalidOperationException or ArgumentException)
        {
            text = string.Empty;
            everyPageReadable = false;
        }

        var readable = text.Length >= 100 && text.Count(char.IsLetter) >= 50 && !text.Contains('\uFFFD');
        var singleColumn = PdfCvInputSelector.Select(pdf, null).Method == "pdf_text";
        var hasDates = Regex.IsMatch(text, @"\b(?:19|20)\d{2}\b");
        var hasContact = Regex.IsMatch(text, @"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}");
        var hasExperienceHeading = HasHeading(text, "deneyim", "iş deneyimi", "work experience", "experience", "projects", "projeler");
        var hasEducationHeading = HasHeading(text, "eğitim", "education", "öğrenim");
        var hasSkillsHeading = HasHeading(text, "beceriler", "yetenekler", "skills", "teknik yetkinlikler");
        var headingCount = new[] { hasExperienceHeading, hasEducationHeading, hasSkillsHeading }.Count(found => found);
        var hasExperience = !string.IsNullOrWhiteSpace(content.ExperienceSummary);
        var hasEducation = !string.IsNullOrWhiteSpace(content.EducationSummary);
        var hasSkills = content.Skills.Count > 0;

        var ats = new List<CvScoreCheck>
        {
            Check("PDF'den seçilebilir metin çıkarılabiliyor", 35, readable),
            Check("Deneyim veya proje başlığı metinde bulunuyor", 15, readable && hasExperienceHeading),
            Check("Eğitim başlığı metinde bulunuyor", 15, readable && hasEducationHeading),
            Check("Beceriler başlığı metinde bulunuyor", 15, readable && hasSkillsHeading),
            Check("E-posta adresi metin olarak bulunuyor", 10, hasContact),
            Check("Yıl bilgisi metin olarak bulunuyor", 10, hasDates)
        };
        var format = new List<CvScoreCheck>
        {
            Check("Metin tek sütunda ve okuma sırası açık", 40, singleColumn),
            Check("Her sayfada okunabilir metin var", 30, everyPageReadable),
            Check("En az iki standart bölüm başlığı var", 20, headingCount >= 2),
            Check("Tarihler metin olarak yazılmış", 10, hasDates)
        };
        var details = content.ContentEvidence ?? new CvContentEvidence();
        var depth = new List<CvScoreCheck>
        {
            Check("Deneyim açıklaması var", 20, hasExperience),
            Check("Eğitim açıklaması var", 10, hasEducation),
            Check("Beceriler belirtilmiş", 15, hasSkills),
            Check("Somut ve ölçülebilir sonuç anlatılmış", 25, details.HasMeasurableImpact),
            Check("Proje veya işin teknik ayrıntısı anlatılmış", 20, details.HasProjectDetails),
            Check("Yapılan eylemler açık fiillerle anlatılmış", 10, details.HasActionOrientedDescriptions)
        };
        var atsScore = Sum(ats);
        var formatScore = Sum(format);
        var contentScore = Sum(depth);
        return new CvScoreReport
        {
            AtsScore = atsScore,
            FormatScore = formatScore,
            ContentScore = contentScore,
            OverallScore = (int)Math.Round(0.4 * atsScore + 0.2 * formatScore + 0.4 * contentScore, MidpointRounding.AwayFromZero),
            AtsChecks = ats,
            FormatChecks = format,
            ContentChecks = depth
        };
    }

    private static CvScoreCheck Check(string label, int points, bool passed)
    {
        return new CvScoreCheck { Label = label, Points = points, Passed = passed };
    }

    private static int Sum(IEnumerable<CvScoreCheck> checks)
    {
        return checks.Where(check => check.Passed).Sum(check => check.Points);
    }

    private static bool HasHeading(string text, params string[] headings)
    {
        return headings.Any(heading => Regex.IsMatch(text, $@"(?im)^\s*{Regex.Escape(heading)}(?:\s*[:|])?\s*$"));
    }
}
