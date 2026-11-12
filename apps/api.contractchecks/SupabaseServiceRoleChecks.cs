using CareerPath.Api.Exceptions;
using CareerPath.Api.Infrastructure.Supabase;
using Microsoft.Extensions.Configuration;

public static class SupabaseServiceRoleChecks
{
    public static void Run()
    {
        var missingKeyConfiguration = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Supabase:Url"] = "https://example.supabase.co",
            ["Supabase:PublishableKey"] = "public-key"
        }).Build();
        var missingKeyFactory = new SupabaseRequestFactory(missingKeyConfiguration);
        try
        {
            using var unexpected = missingKeyFactory.CreateServerRequest(HttpMethod.Post, "rest/v1/rpc/is_basvurusu_eslestirmesini_kaydet", new { });
            throw new Exception("Sunucu anahtarı olmadan eşleşme kaydı açıldı.");
        }
        catch (ApiException exception) when (exception.ErrorCode == ErrorCodes.JobMatchServerNotConfigured)
        {
        }

        var configured = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Supabase:Url"] = "https://example.supabase.co",
            ["Supabase:PublishableKey"] = "public-key",
            ["Supabase:SecretKey"] = "sb_secret_private-test-key"
        }).Build();
        var factory = new SupabaseRequestFactory(configured);
        using var request = factory.CreateServerRequest(HttpMethod.Post, "rest/v1/rpc/is_basvurusu_eslestirmesini_kaydet", new { });
        if (request.Headers.Authorization is not null
            || !request.Headers.TryGetValues("apikey", out var apiKeys)
            || apiKeys.Single() != "sb_secret_private-test-key")
        {
            throw new Exception("Eşleşme kaydı sunucu anahtarıyla yetkilendirilmedi.");
        }
    }
}
