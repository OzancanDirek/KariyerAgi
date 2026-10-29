using System.Text.Json;
using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Infrastructure.Supabase;

public static class SupabaseResponseReader
{
    public static List<T> ReadList<T>(JsonElement root)
    {
        if (root.ValueKind != JsonValueKind.Array)
        {
            throw new ApiException(ErrorCodes.ProfileServiceFailed);
        }

        try
        {
            return root.Deserialize<List<T>>() ?? throw new ApiException(ErrorCodes.ProfileServiceFailed);
        }
        catch (JsonException)
        {
            throw new ApiException(ErrorCodes.ProfileServiceFailed);
        }
    }

    public static T? ReadSingle<T>(JsonElement root)
    {
        if (root.ValueKind != JsonValueKind.Array)
        {
            throw new ApiException(ErrorCodes.ProfileServiceFailed);
        }

        if (root.GetArrayLength() == 0)
        {
            return default;
        }

        try
        {
            return root[0].Deserialize<T>() ?? throw new ApiException(ErrorCodes.ProfileServiceFailed);
        }
        catch (JsonException)
        {
            throw new ApiException(ErrorCodes.ProfileServiceFailed);
        }
    }
}
