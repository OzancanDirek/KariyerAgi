using CareerPath.Api.Dtos.Cv;
using CareerPath.Api.Entities;

namespace CareerPath.Api.Mappers;

public static class CvMapper
{
    public static CvFileResponse ToResponse(CvFile file)
    {
        return new CvFileResponse
        {
            Id = file.Id,
            FileName = file.FileName,
            ContentType = file.ContentType,
            SizeBytes = file.SizeBytes,
            IsPrimary = file.IsPrimary,
            CreatedAt = file.CreatedAt
        };
    }
}
