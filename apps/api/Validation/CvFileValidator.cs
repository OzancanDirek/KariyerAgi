using System.IO.Compression;
using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Validation;

public static class CvFileValidator
{
    private const int MaxSize = 10 * 1024 * 1024;

    public static async Task<(byte[] Bytes, string ContentType, string Extension, string FileName)> ReadAsync(IFormFile? file, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0 || file.Length > MaxSize)
        {
            throw new ApiException(ErrorCodes.CvFileInvalid);
        }
        var fileName = Path.GetFileName(file.FileName).Trim();
        if (fileName.Length == 0 || fileName.Length > 255 || fileName.Any(char.IsControl))
        {
            throw new ApiException(ErrorCodes.CvFileInvalid);
        }
        using var stream = new MemoryStream();
        await file.CopyToAsync(stream, cancellationToken);
        var bytes = stream.ToArray();
        if (bytes.Length == 0 || bytes.Length > MaxSize)
        {
            throw new ApiException(ErrorCodes.CvFileInvalid);
        }
        if (fileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase) && bytes.AsSpan().StartsWith("%PDF-"u8))
        {
            return (bytes, "application/pdf", "pdf", fileName);
        }
        if (fileName.EndsWith(".docx", StringComparison.OrdinalIgnoreCase) && IsDocx(bytes))
        {
            return (bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx", fileName);
        }
        throw new ApiException(ErrorCodes.CvFileInvalid);
    }

    private static bool IsDocx(byte[] bytes)
    {
        try
        {
            using var stream = new MemoryStream(bytes);
            using var archive = new ZipArchive(stream, ZipArchiveMode.Read);
            return archive.GetEntry("[Content_Types].xml") is not null && archive.GetEntry("word/document.xml") is not null;
        }
        catch (InvalidDataException)
        {
            return false;
        }
    }
}
