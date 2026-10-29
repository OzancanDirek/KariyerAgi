using System.Text.Json;
using CareerPath.Api.Dtos;
using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Security;

public static class SupabaseSessionMapper
{
    public static AuthUser ReadUser(JsonElement root)
    {
        if (!root.TryGetProperty("id", out var id))
        {
            throw new ApiException(ErrorCodes.InvalidAuthResponse);
        }

        return new AuthUser
        {
            Id = id.GetString()!,
            Email = root.TryGetProperty("email", out var email) ? email.GetString() : null
        };
    }

    public static AuthSession ReadSession(JsonElement root)
    {
        if (!root.TryGetProperty("user", out var user))
        {
            throw new ApiException(ErrorCodes.InvalidAuthResponse);
        }

        return TryReadSession(root, ReadUser(user))
            ?? throw new ApiException(ErrorCodes.InvalidAuthResponse);
    }

    public static AuthSession? TryReadSession(JsonElement root, AuthUser user)
    {
        if (!root.TryGetProperty("access_token", out var access) || access.ValueKind == JsonValueKind.Null)
        {
            return null;
        }

        if (!root.TryGetProperty("refresh_token", out var refresh) || !root.TryGetProperty("expires_in", out var expires))
        {
            throw new ApiException(ErrorCodes.InvalidAuthResponse);
        }

        return new AuthSession
        {
            AccessToken = access.GetString()!,
            RefreshToken = refresh.GetString()!,
            ExpiresIn = expires.GetInt32(),
            User = user
        };
    }
}
