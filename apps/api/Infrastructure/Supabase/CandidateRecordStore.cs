namespace CareerPath.Api.Infrastructure.Supabase;

public class CandidateRecordStore<T>
{
    private readonly SupabaseRestClient client;

    public CandidateRecordStore(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<List<T>> ListAsync(string table, string columns, Guid candidateId, string token, CancellationToken cancellationToken, string orderColumn = "olusturma_tarihi")
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"{table}?aday_id=eq.{candidateId:D}&is_deleted=eq.false&select={columns}&order={orderColumn}.desc,id.desc", null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<T>(result.RootElement);
    }

    public async Task<T?> GetAsync(string table, string columns, Guid candidateId, Guid id, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, RecordPath(table, columns, candidateId, id), null, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<T>(result.RootElement);
    }

    public async Task<T?> CreateAsync(string table, string columns, Guid candidateId, string token, Dictionary<string, object?> values, CancellationToken cancellationToken)
    {
        values["aday_id"] = candidateId;
        using var result = await client.SendAsync(HttpMethod.Post, $"{table}?select={columns}", values, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<T>(result.RootElement);
    }

    public async Task<T?> UpdateAsync(string table, string columns, Guid candidateId, Guid id, string token, Dictionary<string, object?> values, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, RecordPath(table, columns, candidateId, id), values, token, cancellationToken);
        return SupabaseResponseReader.ReadSingle<T>(result.RootElement);
    }

    public async Task<bool> DeleteAsync(string table, string columns, Guid candidateId, Guid id, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, RecordPath(table, columns, candidateId, id), new { is_deleted = true }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    private static string RecordPath(string table, string columns, Guid candidateId, Guid id)
    {
        return $"{table}?id=eq.{id:D}&aday_id=eq.{candidateId:D}&is_deleted=eq.false&select={columns}";
    }
}
