using System.Text.Json;
using CvDraftEntity = CareerPath.Api.Entities.CvDraft;

namespace CareerPath.Api.Dtos.CvDraft;

public class CvDraftResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Template { get; set; } = string.Empty;
    public JsonElement Content { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public static CvDraftResponse FromEntity(CvDraftEntity draft)
    {
        return new CvDraftResponse
        {
            Id = draft.Id,
            Name = draft.Name,
            Template = draft.Template,
            Content = draft.Content,
            UpdatedAt = draft.UpdatedAt
        };
    }
}
