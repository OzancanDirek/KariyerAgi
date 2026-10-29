using CareerPath.Api.Dtos.Project;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Validation;

public static class ProjectValidator
{
    public static ProjectRequest Normalize(ProjectRequest request)
    {
        request.Name = TextFieldValidator.RequiredText(request.Name, 200, ErrorCodes.ProjectNameRequired, ErrorCodes.ProjectTextTooLong);
        request.Description = TextFieldValidator.Text(request.Description, 5000, ErrorCodes.ProjectTextTooLong);
        request.Role = TextFieldValidator.Text(request.Role, 150, ErrorCodes.ProjectTextTooLong);
        request.ProjectUrl = TextFieldValidator.HttpsUrl(request.ProjectUrl, 300, ErrorCodes.ProjectUrlInvalid);
        request.CodeUrl = TextFieldValidator.HttpsUrl(request.CodeUrl, 300, ErrorCodes.ProjectUrlInvalid);
        request.Technologies = (request.Technologies ?? new List<string>())
            .Select(StringUtils.TrimToNull)
            .Where(value => value is not null)
            .Select(value => value!)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
        if (request.Technologies.Count > 20 || request.Technologies.Any(value => value.Length > 80))
        {
            throw new ApiException(ErrorCodes.ProjectTechnologiesInvalid);
        }
        if (request.StartDate is not null && request.EndDate < request.StartDate)
        {
            throw new ApiException(ErrorCodes.ProjectInvalidDates);
        }
        return request;
    }
}
