using System.Text.Json.Serialization;

namespace LVS.Core.Models;

public class CSAMReportEntry
{
    [JsonPropertyName("csamReportId")]
    public string? CsamReportId { get; set; }

    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("reportType")]
    public string ReportType { get; set; } = string.Empty;

    [JsonPropertyName("acknowledged")]
    public bool Acknowledged { get; set; }

    [JsonPropertyName("contactId")]
    public int? ContactId { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }

    [JsonPropertyName("updatedBy")]
    public string? UpdatedBy { get; set; }

    [JsonPropertyName("twilioWorkerId")]
    public string? TwilioWorkerId { get; set; }
}
