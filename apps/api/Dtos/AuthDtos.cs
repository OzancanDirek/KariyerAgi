namespace CareerPath.Api.Dtos;

public class RegisterRequest
{
    public string Ad { get; set; } = string.Empty;
    public string Soyad { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RefreshRequest
{
    public string RefreshToken { get; set; } = string.Empty;
}

public class AuthUser
{
    public string Id { get; set; } = string.Empty;
    public string? Email { get; set; }
}

public class AuthSession
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
    public AuthUser User { get; set; } = new();
}

public class RegisterResponse
{
    public AuthUser User { get; set; } = new();
    public AuthSession? Session { get; set; }
    public bool EmailConfirmationRequired { get; set; }
}
