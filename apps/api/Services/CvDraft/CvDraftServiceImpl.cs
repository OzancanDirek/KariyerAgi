using CareerPath.Api.Dtos.CvDraft;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.CvDraft;
using CareerPath.Api.Security;

namespace CareerPath.Api.Services.CvDraft;

public class CvDraftServiceImpl : ICvDraftService
{
    private readonly CvDraftRepository repository;
    private readonly CurrentUserContextProvider currentUser;

    public CvDraftServiceImpl(CvDraftRepository repository, CurrentUserContextProvider currentUser)
    {
        this.repository = repository;
        this.currentUser = currentUser;
    }

    public async Task<List<CvDraftResponse>> GetDraftsAsync()
    {
        var identity = await currentUser.ResolveAsync();
        var records = await repository.ListAsync(identity.UserId, identity.AccessToken, currentUser.CancellationToken);
        return records.Select(CvDraftResponse.FromEntity).ToList();
    }

    public async Task<CvDraftResponse> CreateDraftAsync(CvDraftRequest request)
    {
        Validate(request);
        var identity = await currentUser.ResolveAsync();
        var result = await repository.CreateAsync(identity.UserId, identity.AccessToken, request, currentUser.CancellationToken);
        if (result is null)
        {
            throw new ApiException(ErrorCodes.CvOperationFailed);
        }
        return CvDraftResponse.FromEntity(result);
    }

    public async Task<CvDraftResponse> UpdateDraftAsync(Guid id, CvDraftRequest request)
    {
        Validate(request);
        var identity = await currentUser.ResolveAsync();
        var result = await repository.UpdateAsync(identity.UserId, id, identity.AccessToken, request, currentUser.CancellationToken);
        if (result is null)
        {
            throw new ApiException(ErrorCodes.CvDraftNotFound);
        }
        return CvDraftResponse.FromEntity(result);
    }

    public async Task DeleteDraftAsync(Guid id)
    {
        var identity = await currentUser.ResolveAsync();
        if (!await repository.DeleteAsync(identity.UserId, id, identity.AccessToken, currentUser.CancellationToken))
        {
            throw new ApiException(ErrorCodes.CvDraftNotFound);
        }
    }

    private static void Validate(CvDraftRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || request.Name.Trim().Length > 100)
        {
            throw new ApiException(ErrorCodes.CvDraftInvalid);
        }
        if (request.Template is not ("sade" or "modern"))
        {
            throw new ApiException(ErrorCodes.CvDraftInvalid);
        }
        if (request.Content.ValueKind != System.Text.Json.JsonValueKind.Object
            || request.Content.GetRawText().Length > 150000)
        {
            throw new ApiException(ErrorCodes.CvDraftInvalid);
        }
    }
}
