using CareerPath.Api.Exceptions;
using CareerPath.Api.Validation;
using Microsoft.AspNetCore.Http;

public static class CvFileValidatorChecks
{
    public static async Task RunAsync()
    {
        var pdf = await CvFileValidator.ReadAsync(File("sample.pdf", "%PDF-1.7\nexample"u8.ToArray()), CancellationToken.None);
        if (pdf.ContentType != "application/pdf")
        {
            throw new Exception("PDF yükleme doğrulaması başarısız.");
        }

        await ExpectRejectedAsync("sample.docx", "PK\u0003\u0004example"u8.ToArray());
        await ExpectRejectedAsync("sample.pdf", "not a PDF"u8.ToArray());
        Console.WriteLine("CV yükleme yalnızca PDF kabul ediyor.");
    }

    private static async Task ExpectRejectedAsync(string name, byte[] bytes)
    {
        try
        {
            await CvFileValidator.ReadAsync(File(name, bytes), CancellationToken.None);
            throw new Exception($"{name} reddedilmeliydi.");
        }
        catch (ApiException)
        {
        }
    }

    private static FormFile File(string name, byte[] bytes)
    {
        var stream = new MemoryStream(bytes);
        return new FormFile(stream, 0, bytes.Length, "file", name);
    }
}
