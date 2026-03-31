using System.Text.Json.Serialization;

namespace LVS.Core.Models;

public class TimelineActivity
{
    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; set; }

    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("activity")]
    public object? Activity { get; set; }
}

public class SearchFormValues
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Counselor { get; set; }
    public string? PhoneNumber { get; set; }
    public string? DateFrom { get; set; }
    public string? DateTo { get; set; }
    public string? ContactNumber { get; set; }
    public string? Helpline { get; set; }
    public bool OnlyDataContacts { get; set; }
}

public class PermissionRules
{
    public Dictionary<string, List<List<PermissionCondition>>> Rules { get; set; } = new();
}

public class PermissionCondition
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("value")]
    public object? Value { get; set; }
}
