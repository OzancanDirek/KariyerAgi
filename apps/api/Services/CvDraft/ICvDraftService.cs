using CareerPath.Api.Dtos.CvDraft;

namespace CareerPath.Api.Services.CvDraft;

public interface ICvDraftService
{
    Task<List<CvDraftResponse>> GetDraftsAsync();
    Task<CvDraftResponse> CreateDraftAsync(CvDraftRequest request);
    Task<CvDraftResponse> UpdateDraftAsync(Guid id, CvDraftRequest request);
    Task DeleteDraftAsync(Guid id);
}
