using System.Text.Json;

namespace CareerPath.Api.Dtos.CvDraft;

public class CvDraftRequest
{
    public string? Name { get; set; }
    public string? Template { get; set; }
    public JsonElement Content { get; set; }
}
