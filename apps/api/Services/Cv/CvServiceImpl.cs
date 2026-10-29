using CareerPath.Api.Dtos.Cv;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Infrastructure.Supabase;
using CareerPath.Api.Mappers;
using CareerPath.Api.Repositories.Cv;
using CareerPath.Api.Security;
using CareerPath.Api.Validation;
using CareerPath.Api.Entities;

namespace CareerPath.Api.Services.Cv;

public class CvServiceImpl : ICvService
{
    private const string Bucket = "cv-dosyalari";
    private readonly ICvRepository repository;
    private readonly CurrentUserContextProvider currentUser;
    private readonly SupabasePrivateStorageClient storage;
    private readonly ILogger<CvServiceImpl> logger;

    public CvServiceImpl(ICvRepository repository, CurrentUserContextProvider currentUser, SupabasePrivateStorageClient storage, ILogger<CvServiceImpl> logger)
    {
        this.repository = repository;
        this.currentUser = currentUser;
        this.storage = storage;
        this.logger = logger;
    }

    public async Task<List<CvFileResponse>> GetMyCvsAsync()
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var files = await repository.ListAsync(identity.UserId, identity.AccessToken, cancellationToken);
        return files.Select(CvMapper.ToResponse).ToList();
    }

    public async Task<CvConsentResponse> GetCurrentConsentAsync()
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        return await ResolveConsentAsync(identity.UserId, identity.AccessToken, cancellationToken);
    }

    public async Task<CvConsentResponse> AcceptCurrentConsentAsync(Guid textId)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var current = await repository.GetCurrentConsentTextAsync(identity.AccessToken, cancellationToken);
        if (current is null || current.Id != textId)
        {
            throw new ApiException(ErrorCodes.CvConsentUnavailable);
        }
        await repository.GrantConsentAsync(textId, identity.AccessToken, cancellationToken);
        return await ResolveConsentAsync(identity.UserId, identity.AccessToken, cancellationToken);
    }

    public async Task<CvFileResponse> UploadCvAsync(IFormFile? file)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var consent = await ResolveConsentAsync(identity.UserId, identity.AccessToken, cancellationToken);
        if (!consent.Granted)
        {
            throw new ApiException(consent.TextId is null ? ErrorCodes.CvConsentUnavailable : ErrorCodes.CvConsentRequired);
        }
        var (bytes, contentType, extension, fileName) = await CvFileValidator.ReadAsync(file, cancellationToken);
        var path = $"{identity.UserId:D}/{Guid.NewGuid():N}.{extension}";
        await storage.UploadAsync(Bucket, path, bytes, contentType, identity.AccessToken, cancellationToken);
        try
        {
            var created = await repository.CreateAsync(identity.UserId, path, fileName, identity.AccessToken, cancellationToken);
            if (created is null)
            {
                throw new ApiException(ErrorCodes.CvOperationFailed);
            }
            return CvMapper.ToResponse(created);
        }
        catch
        {
            try
            {
                await storage.DeleteAsync(Bucket, path, identity.AccessToken, cancellationToken);
            }
            catch (ApiException exception)
            {
                logger.LogWarning(exception, "CV dosyası temizlenemedi. Yol: {Path}", path);
            }
            throw;
        }
    }

    public async Task<CvDocument> DownloadCvAsync(Guid id)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var file = await GetOwnedAsync(identity.UserId, id, identity.AccessToken, cancellationToken);
        var (bytes, _) = await storage.DownloadAsync(Bucket, file.StoragePath, identity.AccessToken, cancellationToken);
        return new CvDocument { Bytes = bytes, ContentType = file.ContentType, FileName = file.FileName };
    }

    public async Task<List<CvFileResponse>> SetPrimaryCvAsync(Guid id)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        if (!await repository.SetPrimaryAsync(identity.UserId, id, identity.AccessToken, cancellationToken))
        {
            throw new ApiException(ErrorCodes.CvNotFound);
        }
        var files = await repository.ListAsync(identity.UserId, identity.AccessToken, cancellationToken);
        return files.Select(CvMapper.ToResponse).ToList();
    }

    public async Task DeleteCvAsync(Guid id)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var file = await GetOwnedAsync(identity.UserId, id, identity.AccessToken, cancellationToken);
        await storage.DeleteAsync(Bucket, file.StoragePath, identity.AccessToken, cancellationToken);
        if (!await repository.DeleteAsync(identity.UserId, id, identity.AccessToken, cancellationToken))
        {
            throw new ApiException(ErrorCodes.CvNotFound);
        }
    }

    private async Task<CvFile> GetOwnedAsync(Guid userId, Guid id, string token, CancellationToken cancellationToken)
    {
        var file = await repository.GetAsync(userId, id, token, cancellationToken);
        if (file is null)
        {
            throw new ApiException(ErrorCodes.CvNotFound);
        }
        return file;
    }

    private async Task<CvConsentResponse> ResolveConsentAsync(Guid userId, string token, CancellationToken cancellationToken)
    {
        var text = await repository.GetCurrentConsentTextAsync(token, cancellationToken);
        if (text is null)
        {
            return new CvConsentResponse();
        }
        return new CvConsentResponse
        {
            TextId = text.Id,
            Title = text.Title,
            Content = text.Content,
            Version = text.Version,
            Granted = await repository.HasConsentAsync(userId, text.Id, token, cancellationToken)
        };
    }
}
