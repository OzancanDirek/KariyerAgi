using CareerPath.Api.Dtos.Education;
using CareerPath.Api.Entities;

namespace CareerPath.Api.Mappers;

public static class EducationMapper
{
    public static EducationResponse ToResponse(Education education)
    {
        return new EducationResponse
        {
            Id = education.Id,
            CandidateId = education.CandidateId,
            Institution = education.Institution,
            Degree = education.Degree,
            FieldOfStudy = education.FieldOfStudy,
            StartDate = education.StartDate,
            EndDate = education.EndDate,
            GradeAverage = education.GradeAverage,
            GradeScale = education.GradeScale,
            Description = education.Description
        };
    }
}
