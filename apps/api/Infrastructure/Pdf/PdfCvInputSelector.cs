using System.Text;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;
using UglyToad.PdfPig.DocumentLayoutAnalysis.WordExtractor;

namespace CareerPath.Api.Infrastructure.Pdf;

public class PdfCvInputSelection
{
    public required string Method { get; init; }
    public string? Text { get; init; }
}

public static class PdfCvInputSelector
{
    private const int MaxTextLength = 60000;
    private const int MinimumPageTextLength = 100;

    public static PdfCvInputSelection Select(byte[] bytes, string? configuredMode)
    {
        if (configuredMode == "document")
        {
            return Document();
        }

        try
        {
            using var document = PdfDocument.Open(bytes);
            var pages = document.GetPages().ToList();
            if (pages.Count == 0)
            {
                return Document();
            }

            var text = new StringBuilder();
            foreach (var page in pages)
            {
                var pageText = ContentOrderTextExtractor.GetText(page).Trim();
                if (!HasReadableText(pageText) || HasMultipleColumns(page))
                {
                    return Document();
                }

                if (text.Length > 0)
                {
                    text.Append("\n\n");
                }
                text.Append(pageText);
                if (text.Length > MaxTextLength)
                {
                    return Document();
                }
            }

            return new PdfCvInputSelection { Method = "pdf_text", Text = text.ToString() };
        }
        catch (Exception exception) when (exception is IOException or InvalidOperationException or ArgumentException)
        {
            return Document();
        }
    }

    private static bool HasReadableText(string text)
    {
        if (text.Length < MinimumPageTextLength)
        {
            return false;
        }

        var letters = text.Count(char.IsLetter);
        var words = text.Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries);
        return letters >= 50 && words.Length >= 15 && !text.Contains('\uFFFD');
    }

    private static bool HasMultipleColumns(UglyToad.PdfPig.Content.Page page)
    {
        var words = page.GetWords(NearestNeighbourWordExtractor.Instance);
        var gutterLeft = page.Width * 0.44;
        var gutterRight = page.Width * 0.56;
        var bands = new Dictionary<int, (int Left, int Middle, int Right)>();

        foreach (var word in words)
        {
            var box = word.BoundingBox;
            var band = (int)Math.Floor(box.Bottom / 24);
            bands.TryGetValue(band, out var counts);
            var center = (box.Left + box.Right) / 2;
            if (center < gutterLeft)
            {
                counts.Left++;
            }
            else if (center > gutterRight)
            {
                counts.Right++;
            }
            else
            {
                counts.Middle++;
            }
            bands[band] = counts;
        }

        var parallelBands = bands.Values.Count(counts => counts.Left >= 2 && counts.Right >= 2 && counts.Middle == 0);
        return parallelBands >= 3;
    }

    private static PdfCvInputSelection Document()
    {
        return new PdfCvInputSelection { Method = "pdf_document" };
    }
}
