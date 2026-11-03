using CareerPath.Api.Infrastructure.Gemini;
using CareerPath.Api.Dtos.CvAnalysis;
using CareerPath.Api.Services.CvAnalysis.Scoring;
using UglyToad.PdfPig.Core;
using UglyToad.PdfPig.Fonts.Standard14Fonts;
using UglyToad.PdfPig.Writer;

public static class CvScoreChecks
{
    public static void Run()
    {
        var builder = new PdfDocumentBuilder();
        var font = builder.AddStandard14Font(Standard14Font.Helvetica);
        var page = builder.AddPage(595, 842);
        var lines = new[]
        {
            "sample@example.com", "Experience", "2023 - 2025 Built React application at example company",
            "Improved response time by 30 percent", "Education", "2020 - 2024 Computer Science degree",
            "Skills", "React SQL testing", "Project: API integration with database", "Developed and delivered product"
        };
        for (var index = 0; index < lines.Length; index++)
        {
            page.AddText(lines[index], 11, new PdfPoint(40, 790 - index * 30), font);
        }

        var content = new CvAnalysisContent
        {
            ExperienceSummary = "Software developer",
            EducationSummary = "Computer Science",
            Skills = ["React", "SQL"],
            ContentEvidence = new CvContentEvidence
            {
                HasMeasurableImpact = true,
                HasProjectDetails = true,
                HasActionOrientedDescriptions = true
            }
        };
        var result = CvScoreEvaluator.Evaluate(builder.Build(), content);
        if (result.AtsScore != 100 || result.ContentScore != 100 || result.OverallScore < 80)
        {
            throw new Exception("CV puanları beklenen ölçütlerden hesaplanmadı.");
        }
        var empty = CvScoreEvaluator.Evaluate(BuildEmpty(), new CvAnalysisContent());
        if (empty.AtsScore != 0 || empty.ContentScore != 0 || empty.OverallScore >= result.OverallScore)
        {
            throw new Exception("Boş CV yüksek puan aldı.");
        }
        Console.WriteLine("CV puanlama ölçütleri doğrulandı.");
    }

    private static byte[] BuildEmpty()
    {
        var builder = new PdfDocumentBuilder();
        builder.AddPage(595, 842);
        return builder.Build();
    }
}
