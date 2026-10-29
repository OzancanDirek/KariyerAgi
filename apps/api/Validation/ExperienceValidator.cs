using CareerPath.Api.Dtos.Experience;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Validation;

public static class ExperienceValidator
{
    private static readonly HashSet<string> EmploymentTypes = new() { "tam_zamanli", "yari_zamanli", "staj", "serbest", "gonullu", "proje_bazli" };

    public static ExperienceRequest Normalize(ExperienceRequest request)
    {
        request.Position = TextFieldValidator.RequiredText(request.Position, 150, ErrorCodes.ExperienceRequiredFields, ErrorCodes.ExperienceRequiredFields);
        request.Company = TextFieldValidator.RequiredText(request.Company, 150, ErrorCodes.ExperienceRequiredFields, ErrorCodes.ExperienceRequiredFields);
        request.EmploymentType = StringUtils.TrimToNull(request.EmploymentType);
        request.WorkModel = StringUtils.TrimToNull(request.WorkModel);
        request.Location = TextFieldValidator.Text(request.Location, 150, ErrorCodes.ExperienceTextTooLong);
        request.Description = TextFieldValidator.Text(request.Description, 5000, ErrorCodes.ExperienceTextTooLong);
        if (request.StartDate is null || request.EndDate < request.StartDate)
        {
            throw new ApiException(ErrorCodes.ExperienceInvalidDates);
        }
        if ((request.EmploymentType is not null && !EmploymentTypes.Contains(request.EmploymentType)) || (request.WorkModel is not null && !WorkModelValues.Allowed.Contains(request.WorkModel)))
        {
            throw new ApiException(ErrorCodes.ExperienceInvalidType);
        }
        return request;
    }
}
