using System.Text.Json.Serialization;
using CareerPath.Api.Dtos.Skill;
using CareerPath.Api.Infrastructure.Supabase;

namespace CareerPath.Api.Repositories.Skill;

public class SkillRepository
{
    private readonly SupabaseRestClient client;

    public SkillRepository(SupabaseRestClient client)
    {
        this.client = client;
    }

    public async Task<SkillMapData> GetSkillMapDataAsync(Guid candidateId, string token, CancellationToken cancellationToken)
    {
        var categoryTask = ReadAsync<CategoryRow>("beceri_kategorileri?select=id,ad,sira&order=sira.asc,ad.asc", token, cancellationToken);
        var skillTask = ReadAsync<SkillRow>("beceriler?select=id,kategori_id,ad,ad_en&aktif_mi=eq.true&order=ad.asc", token, cancellationToken);
        var relationTask = ReadAsync<RelationRow>("beceri_iliskileri?select=kaynak_beceri_id,hedef_beceri_id,iliski_tipi", token, cancellationToken);
        var aliasTask = ReadAsync<SkillAliasRow>("beceri_esanlamlilari?select=beceri_id,esanlamli", token, cancellationToken);
        var selectedTask = ReadAsync<SelectedSkillRow>($"aday_becerileri?aday_id=eq.{candidateId:D}&select=id,beceri_id,ozel_ad,kategori_id,is_deleted", token, cancellationToken);
        var analysisTask = ReadAsync<CvSkillsRow>($"cv_analizleri?aday_id=eq.{candidateId:D}&is_deleted=eq.false&select=beceriler&order=olusturma_tarihi.desc&limit=1", token, cancellationToken);
        await Task.WhenAll(categoryTask, skillTask, relationTask, aliasTask, selectedTask, analysisTask);
        var categories = await categoryTask;
        var skills = await skillTask;
        var relations = await relationTask;
        var aliases = await aliasTask;
        var selected = await selectedTask;
        var analysis = await analysisTask;
        return new SkillMapData(categories, skills, relations, aliases, selected, analysis.FirstOrDefault()?.Skills ?? new());
    }

    public async Task<List<SkillRow>> GetCatalogAsync(string token, CancellationToken cancellationToken)
    {
        return await ReadAsync<SkillRow>("beceriler?aktif_mi=eq.true&select=id,kategori_id,ad,ad_en", token, cancellationToken);
    }

    public async Task<List<SelectedSkillRow>> GetSelectionsAsync(Guid candidateId, string token, CancellationToken cancellationToken)
    {
        return await ReadAsync<SelectedSkillRow>($"aday_becerileri?aday_id=eq.{candidateId:D}&select=id,beceri_id,ozel_ad,kategori_id,is_deleted", token, cancellationToken);
    }

    public async Task<bool> SkillExistsAsync(Guid skillId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"beceriler?id=eq.{skillId:D}&aktif_mi=eq.true&select=id", null, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    public async Task<bool> CategoryExistsAsync(Guid categoryId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, $"beceri_kategorileri?id=eq.{categoryId:D}&select=id", null, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    private async Task<List<T>> ReadAsync<T>(string path, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Get, path, null, token, cancellationToken);
        return SupabaseResponseReader.ReadList<T>(result.RootElement);
    }

    public async Task<bool> AddSkillAsync(Guid candidateId, Guid skillId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "aday_becerileri?select=id", new { aday_id = candidateId, beceri_id = skillId }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    public async Task<bool> AddCustomSkillAsync(Guid candidateId, string name, Guid categoryId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "aday_becerileri?select=id", new { aday_id = candidateId, ozel_ad = name, kategori_id = categoryId }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    public async Task<bool> RemoveSkillAsync(Guid candidateId, Guid selectionId, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Patch, $"aday_becerileri?id=eq.{selectionId:D}&aday_id=eq.{candidateId:D}&is_deleted=eq.false&select=id", new { is_deleted = true }, token, cancellationToken);
        return result.RootElement.GetArrayLength() > 0;
    }

    public async Task DismissSkillAsync(Guid candidateId, Guid? skillId, string? name, string token, CancellationToken cancellationToken)
    {
        using var result = await client.SendAsync(HttpMethod.Post, "aday_becerileri?select=id", new { aday_id = candidateId, beceri_id = skillId, ozel_ad = name, is_deleted = true }, token, cancellationToken);
    }

    public class CategoryRow
    {
        [JsonPropertyName("id")] public Guid Id { get; set; }
        [JsonPropertyName("ad")] public string Name { get; set; } = string.Empty;
        [JsonPropertyName("sira")] public int SortOrder { get; set; }
    }

    public class SkillRow
    {
        [JsonPropertyName("id")] public Guid Id { get; set; }
        [JsonPropertyName("kategori_id")] public Guid? CategoryId { get; set; }
        [JsonPropertyName("ad")] public string? Name { get; set; }
        [JsonPropertyName("ad_en")] public string? EnglishName { get; set; }
    }

    public class SelectedSkillRow
    {
        [JsonPropertyName("id")] public Guid Id { get; set; }
        [JsonPropertyName("beceri_id")] public Guid? SkillId { get; set; }
        [JsonPropertyName("ozel_ad")] public string? CustomName { get; set; }
        [JsonPropertyName("kategori_id")] public Guid? CategoryId { get; set; }
        [JsonPropertyName("is_deleted")] public bool IsDeleted { get; set; }
    }

    public class RelationRow
    {
        [JsonPropertyName("kaynak_beceri_id")] public Guid SourceSkillId { get; set; }
        [JsonPropertyName("hedef_beceri_id")] public Guid TargetSkillId { get; set; }
        [JsonPropertyName("iliski_tipi")] public string Type { get; set; } = string.Empty;
    }

    public class CvSkillsRow
    {
        [JsonPropertyName("beceriler")] public List<string> Skills { get; set; } = new();
    }

    public class SkillAliasRow
    {
        [JsonPropertyName("beceri_id")] public Guid SkillId { get; set; }
        [JsonPropertyName("esanlamli")] public string Name { get; set; } = string.Empty;
    }
}

public record SkillMapData(
    List<SkillRepository.CategoryRow> Categories,
    List<SkillRepository.SkillRow> Skills,
    List<SkillRepository.RelationRow> Relations,
    List<SkillRepository.SkillAliasRow> Aliases,
    List<SkillRepository.SelectedSkillRow> Selections,
    List<string> CvSkills);
