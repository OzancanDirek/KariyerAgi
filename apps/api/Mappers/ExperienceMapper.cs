using CareerPath.Api.Dtos.Experience;
using CareerPath.Api.Entities;

namespace CareerPath.Api.Mappers;

public static class ExperienceMapper
{
    public static ExperienceResponse ToResponse(Experience experience)
    {
        return new ExperienceResponse
        {
            Id = experience.Id,
            CandidateId = experience.CandidateId,
            Position = experience.Position,
            Company = experience.Company,
            EmploymentType = experience.EmploymentType,
            WorkModel = experience.WorkModel,
            Location = experience.Location,
            StartDate = experience.StartDate,
            EndDate = experience.EndDate,
            Description = experience.Description
        };
    }
}
