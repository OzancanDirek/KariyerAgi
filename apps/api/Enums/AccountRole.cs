namespace CareerPath.Api.Enums;

public enum AccountRole
{
    Aday,
    Isveren,
    Yonetici
}

public static class AccountRoleExtensions
{
    public static string ToDatabaseCode(this AccountRole role)
    {
        return role switch
        {
            AccountRole.Aday => "aday",
            AccountRole.Isveren => "isveren",
            AccountRole.Yonetici => "yonetici",
            _ => throw new ArgumentOutOfRangeException(nameof(role))
        };
    }

    public static bool TryFromDatabaseCode(string? code, out AccountRole role)
    {
        switch (code)
        {
            case "aday":
                role = AccountRole.Aday;
                return true;
            case "isveren":
                role = AccountRole.Isveren;
                return true;
            case "yonetici":
                role = AccountRole.Yonetici;
                return true;
            default:
                role = default;
                return false;
        }
    }
}
