using System.Text.Json.Serialization;

namespace LVS.Core.Models;

public class ResourceReferral
{
    [JsonPropertyName("resourceId")]
    public string ResourceId { get; set; } = string.Empty;

    [JsonPropertyName("referredAt")]
    public DateTime ReferredAt { get; set; }

    [JsonPropertyName("resourceName")]
    public string? ResourceName { get; set; }
}

public class DraftResourceReferralState
{
    public string? ResourceReferralIdToAdd { get; set; }
    public ReferralLookupStatus LookupStatus { get; set; }
}
