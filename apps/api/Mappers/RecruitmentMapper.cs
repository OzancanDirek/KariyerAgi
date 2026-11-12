using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Enums;

namespace CareerPath.Api.Mappers;

public static class RecruitmentMapper
{
    public static CompanyResponse ToResponse(CompanyRow row)
    {
        return new CompanyResponse
        {
            Id = row.Id,
            Name = row.Name,
            Description = row.Description,
            Sector = row.Sector,
            Location = row.Location,
            Website = row.Website,
            VerificationStatus = row.VerificationStatus,
            CreatedAt = row.CreatedAt,
            UpdatedAt = row.UpdatedAt
        };
    }

    public static JobResponse ToResponse(JobRow row)
    {
        var status = row.Status;
        if (JobStatusExtensions.TryFromDatabaseCode(status, out var parsed)
            && parsed == JobStatus.Yayinda && row.ApplicationDeadline <= DateTimeOffset.UtcNow)
        {
            status = JobStatus.Kapali.ToDatabaseCode();
        }

        return new JobResponse
        {
            Id = row.Id,
            CompanyId = row.CompanyId,
            CompanyName = row.Company?.Name ?? string.Empty,
            Title = row.Title,
            Description = row.Description,
            Location = row.Location,
            WorkModel = row.WorkModel,
            EmploymentType = row.EmploymentType,
            Status = status,
            PublishedAt = row.PublishedAt,
            ApplicationDeadline = row.ApplicationDeadline,
            CreatedAt = row.CreatedAt,
            UpdatedAt = row.UpdatedAt
        };
    }

    public static ApplicationResponse ToResponse(ApplicationRow row)
    {
        return new ApplicationResponse
        {
            Id = row.Id,
            JobId = row.JobId,
            CandidateId = row.CandidateId,
            CandidateName = row.CandidateName,
            CvFileId = row.CvFileId,
            CoverLetter = row.CoverLetter,
            Status = row.Status,
            CreatedAt = row.CreatedAt,
            UpdatedAt = row.UpdatedAt
        };
    }

    public static ApplicantDetailResponse ToResponse(ApplicantDetailRow row)
    {
        return new ApplicantDetailResponse
        {
            Id = row.Id,
            JobId = row.JobId,
            CandidateName = row.CandidateName,
            Email = row.Email,
            Phone = row.Phone,
            Location = row.Location,
            Title = row.Title,
            Summary = row.Summary,
            ExperienceLevel = row.ExperienceLevel,
            LinkedInUrl = row.LinkedInUrl,
            GitHubUrl = row.GitHubUrl,
            PortfolioUrl = row.PortfolioUrl,
            CvFileName = row.CvFileName,
            CvContentType = row.CvContentType,
            CoverLetter = row.CoverLetter,
            Status = row.Status,
            CreatedAt = row.CreatedAt
        };
    }
}
