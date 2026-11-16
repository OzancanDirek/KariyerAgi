using System.Text.Json.Serialization;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.AccountClosure;

public sealed class AccountClosureRepository
{
    private readonly SupabaseRestClient client;

    public AccountClosureRepository(SupabaseRestClient client) => this.client = client;

    public async Task<bool> IsOpenAsync(string accessToken, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "rpc/hesap_acik_mi", new { }, accessToken, cancellationToken);
        return result.RootElement.ValueKind == System.Text.Json.JsonValueKind.True;
    }

    public async Task<AccountClosureRow> RequestAsync(string accessToken, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "rpc/hesap_kapatma_talep_et", new { }, accessToken,
            cancellationToken, databaseErrors: new Dictionary<string, ErrorDefinition>
            {
                ["Şirket sahibi hesabı kapatmadan önce sahipliği devretmelidir"] = ErrorCodes.AccountOwnsCompany,
                ["Hesap bulunamadı"] = ErrorCodes.AccountClosureFailed
            });
        var row = SupabaseResponseReader.ReadSingle<AccountClosureRow>(result.RootElement);
        return row ?? throw new ApiException(ErrorCodes.AccountClosureFailed);
    }
}

public sealed class AccountClosureRow
{
    [JsonPropertyName("talep_id")] public Guid RequestId { get; set; }
    [JsonPropertyName("kalici_silme_tarihi")] public DateTimeOffset ScheduledDeletionAt { get; set; }
}
