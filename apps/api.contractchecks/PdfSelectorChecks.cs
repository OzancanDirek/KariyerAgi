using CareerPath.Api.Infrastructure.Pdf;
using CareerPath.Api.Infrastructure.Gemini;
using UglyToad.PdfPig.Core;
using UglyToad.PdfPig.Fonts.Standard14Fonts;
using UglyToad.PdfPig.Writer;

public static class PdfSelectorChecks
{
    public static void Run()
    {
        Check("Tek sütun", Build(columns: false), "pdf_text");
        Check("İki sütun", Build(columns: true), "pdf_document");
        Check("Metinsiz belge", Build(columns: false, blank: true), "pdf_document");
        Check("Zorunlu belge modu", Build(columns: false), "pdf_document", "document");
        Console.WriteLine("PDF yöntem seçimi doğrulandı.");
    }

    private static void Check(string name, byte[] pdf, string expected, string? mode = null)
    {
        var selected = PdfCvInputSelector.Select(pdf, mode);
        if (selected.Method != expected)
        {
            throw new Exception($"{name}: {expected} bekleniyordu, {selected.Method} seçildi.");
        }
    }

    private static byte[] Build(bool columns, bool blank = false)
    {
        var builder = new PdfDocumentBuilder();
        var font = builder.AddStandard14Font(Standard14Font.Helvetica);
        var page = builder.AddPage(595, 842);
        if (blank)
        {
            return builder.Build();
        }

        for (var index = 0; index < 8; index++)
        {
            var y = 790 - index * 35;
            if (columns)
            {
                page.AddText($"Experience item {index} at company", 11, new PdfPoint(40, y), font);
                page.AddText($"Education skill {index} React SQL", 11, new PdfPoint(330, y), font);
            }
            else
            {
                page.AddText($"Experience item {index}: Software internship using React and SQL at sample company.", 11, new PdfPoint(40, y), font);
            }
        }

        return builder.Build();
    }
}
