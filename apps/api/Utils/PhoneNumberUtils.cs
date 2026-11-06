using CareerPath.Api.Exceptions;

namespace CareerPath.Api.Utils;

public static class PhoneNumberUtils
{
    public static string NormalizeRequired(string? value)
    {
        var phone = Normalize(value);
        if (phone is null)
        {
            throw new ApiException(ErrorCodes.PhoneRequired);
        }

        return phone;
    }

    public static string? Normalize(string? value)
    {
        if (StringUtils.IsBlank(value))
        {
            return null;
        }

        var digits = new string(value!.Where(char.IsAsciiDigit).ToArray());
        if (digits.Length == 12 && digits.StartsWith("90", StringComparison.Ordinal))
        {
            digits = digits[2..];
        }
        else if (digits.Length == 11 && digits.StartsWith('0'))
        {
            digits = digits[1..];
        }

        if (digits.Length != 10 || digits[0] != '5')
        {
            throw new ApiException(ErrorCodes.PhoneInvalid);
        }

        return digits;
    }
}
