using CareerPath.Api.Dtos.Profile;
using CareerPath.Api.Entities;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Validation;

public static class ProfileValidator
{
    public static SystemUser Normalize(UpdateProfileRequest request)
    {
        var profile = new SystemUser
        {
            FirstName = TextFieldValidator.RequiredText(request.FirstName, 100, ErrorCodes.FullNameRequired, ErrorCodes.ProfileNameTooLong),
            LastName = TextFieldValidator.RequiredText(request.LastName, 100, ErrorCodes.FullNameRequired, ErrorCodes.ProfileNameTooLong),
            Phone = TextFieldValidator.Text(request.Phone, 30, ErrorCodes.ProfilePhoneTooLong),
            Location = TextFieldValidator.Text(request.Location, 150, ErrorCodes.ProfileLocationTooLong),
            PhotoUrl = TextFieldValidator.HttpsUrl(request.PhotoUrl, 2048, ErrorCodes.ProfilePhotoUrlInvalid)
        };
        return profile;
    }
}
