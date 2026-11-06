using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Enums;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Validation;

public static class JobValidator
{
    public static JobValues Normalize(JobRequest request)
    {
        var title = StringUtils.TrimRequired(request.Title, ErrorCodes.JobInvalid);
        var description = StringUtils.TrimRequired(request.Description, ErrorCodes.JobInvalid);
        var location = StringUtils.TrimToNull(request.Location);
        var statusCode = StringUtils.TrimToNull(request.Status) ?? JobStatus.Taslak.ToDatabaseCode();

        if (request.CompanyId == Guid.Empty || title.Length is < 5 or > 160
            || description.Length is < 50 or > 10000 || location?.Length > 150)
        {
            throw new ApiException(ErrorCodes.JobInvalid);
        }

        if (!JobStatusExtensions.TryFromDatabaseCode(statusCode, out var status)
            || !JobWorkModelExtensions.TryFromDatabaseCode(request.WorkModel, out var workModel)
            || !JobEmploymentTypeExtensions.TryFromDatabaseCode(request.EmploymentType, out var employmentType))
        {
            throw new ApiException(ErrorCodes.JobInvalid);
        }

        if (status == JobStatus.Yayinda && request.ApplicationDeadline <= DateTimeOffset.UtcNow)
        {
            throw new ApiException(ErrorCodes.JobInvalid);
        }

        return new JobValues
        {
            CompanyId = request.CompanyId,
            Title = title,
            Description = description,
            Location = location,
            WorkModel = workModel.ToDatabaseCode(),
            EmploymentType = employmentType.ToDatabaseCode(),
            Status = status.ToDatabaseCode(),
            ApplicationDeadline = request.ApplicationDeadline
        };
    }
}
