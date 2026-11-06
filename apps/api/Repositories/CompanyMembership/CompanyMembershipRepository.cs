using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Exceptions;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.CompanyMembership;

public class CompanyMembershipRepository
{
    private const string Columns = "id,sirket_id,kullanici_id,gorev,durum,sirketler(ad)";
    private static readonly IReadOnlyDictionary<string, ErrorDefinition> InviteErrors = new Dictionary<string, ErrorDefinition>
    {
        ["Bu e-posta ile işveren hesabı bulunamadı"] = ErrorCodes.CompanyInviteAccountNotFound,
        ["Geçersiz şirket daveti"] = ErrorCodes.CompanyInviteInvalid,
        ["Şirket sahibi değilsiniz"] = ErrorCodes.RecruitmentForbidden
    };
    private readonly SupabaseRestClient client;

    public CompanyMembershipRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<List<CompanyMembershipRow>> ListForUserAsync(Guid userId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"sirket_uyelikleri?kullanici_id=eq.{userId:D}&is_deleted=eq.false&select={Columns}&order=olusturma_tarihi.desc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<CompanyMembershipRow>(result.RootElement);
    }

    public async Task<List<CompanyMembershipRow>> ListForCompanyAsync(Guid companyId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"sirket_uyelikleri?sirket_id=eq.{companyId:D}&is_deleted=eq.false&select={Columns}&order=olusturma_tarihi.asc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<CompanyMembershipRow>(result.RootElement);
    }

    public async Task InviteAsync(Guid companyId, string email, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "rpc/sirket_calisani_davet_et", new { p_sirket_id = companyId, p_eposta = email }, token, cancellationToken, databaseErrors: InviteErrors);
    }

    public async Task<bool> RespondAsync(Guid membershipId, Guid userId, string status, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"sirket_uyelikleri?id=eq.{membershipId:D}&kullanici_id=eq.{userId:D}&durum=eq.beklemede&is_deleted=eq.false&select=id", new { durum = status }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    public async Task<bool> RemoveAsync(Guid membershipId, Guid companyId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"sirket_uyelikleri?id=eq.{membershipId:D}&sirket_id=eq.{companyId:D}&gorev=eq.ise_alim&is_deleted=eq.false&select=id", new { is_deleted = true }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }
}
