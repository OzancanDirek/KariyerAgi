using CareerPath.Api.Infrastructure.Supabase;
using CareerPath.Api.Dtos;
using CareerPath.Api.Security;

namespace CareerPath.Api.Repositories.Authentication;

public class AuthenticationRepository
{
    private readonly SupabaseAuthClient client;

    public AuthenticationRepository(SupabaseAuthClient client)
    {
        this.client = client;
    }

    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "signup", new
        {
            email = request.Email,
            password = request.Password,
            data = new { ad = request.Ad, soyad = request.Soyad, telefon = request.Telefon, rol = request.Rol }
        }, null, cancellationToken);
        var root = result.RootElement;
        var user = SupabaseSessionMapper.ReadUser(root.TryGetProperty("user", out var nested) ? nested : root);
        var session = SupabaseSessionMapper.TryReadSession(root, user);
        return new RegisterResponse { User = user, Session = session, EmailConfirmationRequired = session is null };
    }

    public async Task<AuthSession> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "token?grant_type=password", new { email = request.Email, password = request.Password }, null, cancellationToken);
        return SupabaseSessionMapper.ReadSession(result.RootElement);
    }

    public async Task LogoutAsync(string accessToken, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "logout", null, accessToken, cancellationToken);
    }

    public async Task RequestPasswordResetAsync(string email, string redirectUrl, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, $"recover?redirect_to={Uri.EscapeDataString(redirectUrl)}", new { email }, null, cancellationToken);
    }

    public async Task UpdatePasswordAsync(string password, string accessToken, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Put, "user", new { password }, accessToken, cancellationToken);
    }

}
