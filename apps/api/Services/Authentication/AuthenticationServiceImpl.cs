using System.Net.Mail;
using CareerPath.Api.Dtos;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Repositories.Authentication;
using CareerPath.Api.Security;
using CareerPath.Api.Utils;

namespace CareerPath.Api.Services.Authentication;

public class AuthenticationServiceImpl : IAuthenticationService
{
    private readonly IAuthenticationRepository repository;
    private readonly HttpRequestContext requestContext;

    public AuthenticationServiceImpl(IAuthenticationRepository repository, HttpRequestContext requestContext)
    {
        this.repository = repository;
        this.requestContext = requestContext;
    }

    public Task<RegisterResponse> RegisterAsync(RegisterRequest request)
    {
        request.Email = ValidateCredentials(request.Email, request.Password);
        request.Ad = StringUtils.TrimRequired(request.Ad, ErrorCodes.FullNameRequired);
        request.Soyad = StringUtils.TrimRequired(request.Soyad, ErrorCodes.FullNameRequired);

        if (request.Rol is not ("aday" or "isveren"))
        {
            throw new ApiException(ErrorCodes.InvalidRole);
        }

        return repository.RegisterAsync(request, requestContext.CancellationToken);
    }

    public Task<AuthSession> LoginAsync(LoginRequest request)
    {
        request.Email = ValidateCredentials(request.Email, request.Password);
        return repository.LoginAsync(request, requestContext.CancellationToken);
    }

    public Task LogoutAsync()
    {
        return repository.LogoutAsync(requestContext.AccessToken, requestContext.CancellationToken);
    }

    private static string ValidateCredentials(string? email, string? password)
    {
        var normalizedEmail = StringUtils.TrimRequired(email, ErrorCodes.InvalidEmail);
        if (!MailAddress.TryCreate(normalizedEmail, out var parsed) || parsed.Address != normalizedEmail)
        {
            throw new ApiException(ErrorCodes.InvalidEmail);
        }

        if (StringUtils.IsBlank(password) || password!.Length < 6)
        {
            throw new ApiException(ErrorCodes.PasswordTooShort);
        }

        return normalizedEmail;
    }
}
