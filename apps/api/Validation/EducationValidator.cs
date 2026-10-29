using CareerPath.Api.Dtos.Education;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Validation;

public static class EducationValidator
{
    private static readonly HashSet<string> Degrees = new(StringComparer.Ordinal)
    {
        "lise", "onlisans", "lisans", "yuksek_lisans", "doktora", "diger"
    };

    public static EducationRequest Normalize(EducationRequest request)
    {
        request.Institution = TextFieldValidator.RequiredText(request.Institution, 200, ErrorCodes.EducationInstitutionRequired, ErrorCodes.EducationTextTooLong);
        request.Degree = StringUtils.TrimToNull(request.Degree);
        request.FieldOfStudy = TextFieldValidator.Text(request.FieldOfStudy, 200, ErrorCodes.EducationTextTooLong);
        request.Description = TextFieldValidator.Text(request.Description, 2000, ErrorCodes.EducationTextTooLong);

        if (request.Degree is not null && !Degrees.Contains(request.Degree))
        {
            throw new ApiException(ErrorCodes.EducationInvalidDegree);
        }
        if (request.StartDate is not null && request.EndDate is not null && request.EndDate < request.StartDate)
        {
            throw new ApiException(ErrorCodes.EducationInvalidDates);
        }
        if (request.GradeScale is not null && request.GradeScale is not (4 or 5 or 100))
        {
            throw new ApiException(ErrorCodes.EducationInvalidGrade);
        }
        if (request.GradeAverage is not null && (request.GradeScale is null || request.GradeAverage < 0 || request.GradeAverage > request.GradeScale))
        {
            throw new ApiException(ErrorCodes.EducationInvalidGrade);
        }
        return request;
    }
}
