using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Validation;

public static class ProfilePhotoValidator
{
    private const int MaxFileSize = 3 * 1024 * 1024;

    public static async Task<(byte[] Bytes, string ContentType, string Extension)> ReadAsync(IFormFile? file, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0 || file.Length > MaxFileSize)
        {
            throw new ApiException(ErrorCodes.ProfilePhotoInvalid);
        }

        using var stream = new MemoryStream();
        await file.CopyToAsync(stream, cancellationToken);
        var bytes = stream.ToArray();
        if (bytes.Length == 0 || bytes.Length > MaxFileSize)
        {
            throw new ApiException(ErrorCodes.ProfilePhotoInvalid);
        }

        if (bytes.Length >= 3 && bytes[0] == 0xFF && bytes[1] == 0xD8 && bytes[2] == 0xFF)
        {
            return (bytes, "image/jpeg", "jpg");
        }

        if (bytes.Length >= 8 && bytes.AsSpan(0, 8).SequenceEqual(new byte[] { 137, 80, 78, 71, 13, 10, 26, 10 }))
        {
            return (bytes, "image/png", "png");
        }

        throw new ApiException(ErrorCodes.ProfilePhotoInvalid);
    }
}
