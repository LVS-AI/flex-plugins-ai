using System.Text.Json.Serialization;

namespace LVS.Core.Models;

public class ReferrableResource
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("attributes")]
    public Dictionary<string, object?> Attributes { get; set; } = new();
}
