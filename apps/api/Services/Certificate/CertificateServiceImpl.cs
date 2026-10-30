using CareerPath.Api.Dtos.Certificate;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Infrastructure.Supabase;
using CareerPath.Api.Mappers;
using CareerPath.Api.Repositories.Certificate;
using CareerPath.Api.Security;
using CareerPath.Api.Validation;
using CertificateEntity = CareerPath.Api.Entities.Certificate;

namespace CareerPath.Api.Services.Certificate;

public class CertificateServiceImpl : ICertificateService
{
    private const string Bucket = "sertifika-belgeleri";
    private const int MaxFileSize = 10 * 1024 * 1024;
    private readonly ICertificateRepository repository;
    private readonly CurrentUserContextProvider currentUser;
    private readonly SupabasePrivateStorageClient storage;
    private readonly ILogger<CertificateServiceImpl> logger;

    public CertificateServiceImpl(ICertificateRepository repository, CurrentUserContextProvider currentUser, SupabasePrivateStorageClient storage, ILogger<CertificateServiceImpl> logger)
    {
        this.repository = repository;
        this.currentUser = currentUser;
        this.storage = storage;
        this.logger = logger;
    }

    public async Task<List<CertificateResponse>> GetCertificatesAsync()
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var records = await repository.ListAsync(identity.UserId, identity.AccessToken, cancellationToken);
        return records.Select(CertificateMapper.ToResponse).ToList();
    }

    public async Task<CertificateResponse> CreateCertificateAsync(CertificateRequest request)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var created = await repository.CreateAsync(identity.UserId, identity.AccessToken, CertificateValidator.Normalize(request), cancellationToken);
        if (created is null)
        {
            throw new ApiException(ErrorCodes.CertificateOperationFailed);
        }
        return CertificateMapper.ToResponse(created);
    }

    public async Task<CertificateResponse> UpdateCertificateAsync(Guid id, CertificateRequest request)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var updated = await repository.UpdateAsync(identity.UserId, id, identity.AccessToken, CertificateValidator.Normalize(request), cancellationToken);
        if (updated is null)
        {
            throw new ApiException(ErrorCodes.CertificateNotFound);
        }
        return CertificateMapper.ToResponse(updated);
    }

    public async Task DeleteCertificateAsync(Guid id)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        if (!await repository.DeleteAsync(identity.UserId, id, identity.AccessToken, cancellationToken))
        {
            throw new ApiException(ErrorCodes.CertificateNotFound);
        }
    }

    public async Task<CertificateResponse> UploadCertificateDocumentAsync(Guid id, IFormFile? file)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var certificate = await GetOwnedAsync(identity.UserId, id, identity.AccessToken, cancellationToken);
        var (bytes, contentType, extension) = await ReadValidatedFileAsync(file, cancellationToken);
        var fileName = Path.GetFileName(file!.FileName).Trim();
        if (fileName.Length == 0 || fileName.Length > 255 || fileName.Any(char.IsControl))
        {
            throw new ApiException(ErrorCodes.CertificateFileInvalid);
        }
        var path = $"{identity.UserId:D}/{id:D}/{Guid.NewGuid():N}.{extension}";
        await storage.UploadAsync(Bucket, path, bytes, contentType, identity.AccessToken, cancellationToken);
        CertificateEntity? updated;
        try
        {
            updated = await repository.UpdateDocumentAsync(identity.UserId, id, identity.AccessToken, path, fileName, cancellationToken);
            if (updated is null)
            {
                throw new ApiException(ErrorCodes.CertificateNotFound);
            }
        }
        catch
        {
            await DeleteStorageFileBestEffortAsync(path, identity.AccessToken, cancellationToken);
            throw;
        }
        return CertificateMapper.ToResponse(updated);
    }

    public async Task<CertificateDocument> DownloadCertificateDocumentAsync(Guid id)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var certificate = await GetOwnedAsync(identity.UserId, id, identity.AccessToken, cancellationToken);
        if (certificate.DocumentPath is null)
        {
            throw new ApiException(ErrorCodes.CertificateDocumentNotFound);
        }
        var (bytes, contentType) = await storage.DownloadAsync(Bucket, certificate.DocumentPath, identity.AccessToken, cancellationToken);
        return new CertificateDocument { Bytes = bytes, ContentType = contentType, FileName = certificate.DocumentFileName ?? "sertifika" };
    }

    public async Task<CertificateResponse> DeleteCertificateDocumentAsync(Guid id)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var certificate = await GetOwnedAsync(identity.UserId, id, identity.AccessToken, cancellationToken);
        if (certificate.DocumentPath is null)
        {
            return CertificateMapper.ToResponse(certificate);
        }
        var updated = await repository.UpdateDocumentAsync(identity.UserId, id, identity.AccessToken, null, null, cancellationToken);
        if (updated is null)
        {
            throw new ApiException(ErrorCodes.CertificateNotFound);
        }
        return CertificateMapper.ToResponse(updated);
    }

    private async Task<CertificateEntity> GetOwnedAsync(Guid userId, Guid id, string token, CancellationToken cancellationToken)
    {
        var certificate = await repository.GetAsync(userId, id, token, cancellationToken);
        if (certificate is null)
        {
            throw new ApiException(ErrorCodes.CertificateNotFound);
        }
        return certificate;
    }

    private static async Task<(byte[] Bytes, string ContentType, string Extension)> ReadValidatedFileAsync(IFormFile? file, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0 || file.Length > MaxFileSize)
        {
            throw new ApiException(ErrorCodes.CertificateFileInvalid);
        }
        using var stream = new MemoryStream();
        await file.CopyToAsync(stream, cancellationToken);
        var bytes = stream.ToArray();
        if (bytes.Length > MaxFileSize)
        {
            throw new ApiException(ErrorCodes.CertificateFileInvalid);
        }
        if (bytes.Length >= 5 && bytes.AsSpan(0, 5).SequenceEqual("%PDF-"u8))
        {
            return (bytes, "application/pdf", "pdf");
        }
        if (bytes.Length >= 3 && bytes[0] == 0xFF && bytes[1] == 0xD8 && bytes[2] == 0xFF)
        {
            return (bytes, "image/jpeg", "jpg");
        }
        if (bytes.Length >= 8 && bytes.AsSpan(0, 8).SequenceEqual(new byte[] { 137, 80, 78, 71, 13, 10, 26, 10 }))
        {
            return (bytes, "image/png", "png");
        }
        throw new ApiException(ErrorCodes.CertificateFileInvalid);
    }

    private async Task DeleteStorageFileBestEffortAsync(string path, string token, CancellationToken cancellationToken)
    {
        try
        {
            await storage.DeleteAsync(Bucket, path, token, cancellationToken);
        }
        catch (ApiException exception)
        {
            logger.LogWarning(exception, "Sertifika belge temizliği tamamlanamadı. Yol: {Path}", path);
        }
    }
}
