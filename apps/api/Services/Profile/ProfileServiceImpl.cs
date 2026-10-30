using CareerPath.Api.Dtos.Profile;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.Profile;
using CareerPath.Api.Security;
using CareerPath.Api.Mappers;
using CareerPath.Api.Validation;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Services.Profile;

public class ProfileServiceImpl : IProfileService
{
    private const string PhotoBucket = "profil-fotograflari";
    private readonly IProfileRepository repository;
    private readonly CurrentUserContextProvider currentUser;
    private readonly SupabasePrivateStorageClient storage;
    private readonly ILogger<ProfileServiceImpl> logger;

    public ProfileServiceImpl(IProfileRepository repository, CurrentUserContextProvider currentUser, SupabasePrivateStorageClient storage, ILogger<ProfileServiceImpl> logger)
    {
        this.repository = repository;
        this.currentUser = currentUser;
        this.storage = storage;
        this.logger = logger;
    }

    public async Task<ProfileResponse> GetProfileAsync()
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var profile = await GetCurrentProfileAsync(identity.UserId, identity.AccessToken, cancellationToken);
        return ProfileMapper.ToResponse(profile);
    }

    public async Task<ProfileResponse> UpdateProfileAsync(UpdateProfileRequest request)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var profile = ProfileValidator.Normalize(request);
        var updated = await repository.UpdateAsync(identity.UserId, identity.AccessToken, profile, cancellationToken);
        if (updated is null)
        {
            throw new ApiException(ErrorCodes.ProfileNotFound);
        }

        return ProfileMapper.ToResponse(updated);
    }

    public async Task<ProfileResponse> UploadPhotoAsync(IFormFile? file)
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var current = await GetCurrentProfileAsync(identity.UserId, identity.AccessToken, cancellationToken);
        var (bytes, contentType, extension) = await ProfilePhotoValidator.ReadAsync(file, cancellationToken);
        var path = $"{identity.UserId:D}/{Guid.NewGuid():N}.{extension}";
        await storage.UploadAsync(PhotoBucket, path, bytes, contentType, identity.AccessToken, cancellationToken);

        try
        {
            var updated = await repository.UpdatePhotoAsync(identity.UserId, identity.AccessToken, path, cancellationToken);
            if (updated is null)
            {
                throw new ApiException(ErrorCodes.ProfileNotFound);
            }

            return ProfileMapper.ToResponse(updated);
        }
        catch
        {
            await DeleteFileBestEffortAsync(path, identity.AccessToken, cancellationToken);
            throw;
        }
    }

    public async Task<ProfilePhoto> DownloadPhotoAsync()
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var current = await GetCurrentProfileAsync(identity.UserId, identity.AccessToken, cancellationToken);
        if (current.PhotoPath is null)
        {
            throw new ApiException(ErrorCodes.ProfilePhotoNotFound);
        }

        var (bytes, contentType) = await storage.DownloadAsync(PhotoBucket, current.PhotoPath, identity.AccessToken, cancellationToken);
        return new ProfilePhoto { Bytes = bytes, ContentType = contentType };
    }

    public async Task<ProfileResponse> DeletePhotoAsync()
    {
        var cancellationToken = currentUser.CancellationToken;
        var identity = await currentUser.ResolveAsync();
        var current = await GetCurrentProfileAsync(identity.UserId, identity.AccessToken, cancellationToken);
        var updated = await repository.UpdatePhotoAsync(identity.UserId, identity.AccessToken, null, cancellationToken);
        if (updated is null)
        {
            throw new ApiException(ErrorCodes.ProfileNotFound);
        }

        return ProfileMapper.ToResponse(updated);
    }

    private async Task DeleteFileBestEffortAsync(string path, string accessToken, CancellationToken cancellationToken)
    {
        try
        {
            await storage.DeleteAsync(PhotoBucket, path, accessToken, cancellationToken);
        }
        catch (ApiException exception)
        {
            logger.LogWarning(exception, "Eski profil fotoğrafı temizlenemedi. Yol: {Path}", path);
        }
    }

    private async Task<Entities.SystemUser> GetCurrentProfileAsync(Guid userId, string accessToken, CancellationToken cancellationToken)
    {
        var profile = await repository.GetByIdAsync(userId, accessToken, cancellationToken);
        if (profile is null)
        {
            throw new ApiException(ErrorCodes.ProfileNotFound);
        }

        return profile;
    }
}
