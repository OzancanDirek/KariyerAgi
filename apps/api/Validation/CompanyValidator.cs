using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Validation;

public static class CompanyValidator
{
    public static CompanyValues Normalize(CompanyRequest request)
    {
        var name = StringUtils.TrimRequired(request.Name, ErrorCodes.CompanyInvalid);
        var description = StringUtils.TrimToNull(request.Description);
        var sector = StringUtils.TrimToNull(request.Sector);
        var location = StringUtils.TrimToNull(request.Location);
        var website = StringUtils.TrimToNull(request.Website);

        if (name.Length is < 2 or > 160 || description?.Length > 2000 || sector?.Length > 120 || location?.Length > 150)
        {
            throw new ApiException(ErrorCodes.CompanyInvalid);
        }

        if (website is not null && (website.Length > 2048 || !Uri.TryCreate(website, UriKind.Absolute, out var uri) || uri.Scheme != Uri.UriSchemeHttps || !string.IsNullOrEmpty(uri.UserInfo)))
        {
            throw new ApiException(ErrorCodes.CompanyInvalid);
        }

        return new CompanyValues
        {
            Name = name,
            Description = description,
            Sector = sector,
            Location = location,
            Website = website
        };
    }
}
