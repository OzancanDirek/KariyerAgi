using CareerPath.Api.Dtos.Profile;
using CareerPath.Api.Entities;

namespace CareerPath.Api.Mappers;

public static class ProfileMapper
{
    public static ProfileResponse ToResponse(SystemUser profile)
    {
        return new ProfileResponse
        {
            Id = profile.Id,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            Email = profile.Email,
            Phone = profile.Phone,
            Location = profile.Location,
            PhotoUrl = profile.PhotoUrl
        };
    }
}
