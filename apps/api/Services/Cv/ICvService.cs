using CareerPath.Api.Dtos.Cv;

namespace CareerPath.Api.Services.Cv;

public interface ICvService
{
    Task<List<CvFileResponse>> GetCvsAsync();
    Task<CvFileResponse> UploadCvAsync(IFormFile? file);
    Task<CvDocument> DownloadCvAsync(Guid id);
    Task<List<CvFileResponse>> SetPrimaryCvAsync(Guid id);
    Task DeleteCvAsync(Guid id);
}
