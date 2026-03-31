using System.Text.Json.Serialization;

namespace LVS.Core.Models;

public class Contact
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("accountSid")]
    public string AccountSid { get; set; } = string.Empty;

    [JsonPropertyName("twilioWorkerId")]
    public string TwilioWorkerId { get; set; } = string.Empty;

    [JsonPropertyName("number")]
    public string Number { get; set; } = string.Empty;

    [JsonPropertyName("conversationDuration")]
    public int ConversationDuration { get; set; }

    [JsonPropertyName("csamReports")]
    public List<CSAMReportEntry> CsamReports { get; set; } = [];

    [JsonPropertyName("referrals")]
    public List<ResourceReferral> Referrals { get; set; } = [];

    [JsonPropertyName("conversationMedia")]
    public List<ConversationMedia> ConversationMedia { get; set; } = [];

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("createdBy")]
    public string CreatedBy { get; set; } = string.Empty;

    [JsonPropertyName("helpline")]
    public string Helpline { get; set; } = string.Empty;

    [JsonPropertyName("taskId")]
    public string TaskId { get; set; } = string.Empty;

    [JsonPropertyName("profileId")]
    public int? ProfileId { get; set; }

    [JsonPropertyName("identifierId")]
    public int? IdentifierId { get; set; }

    [JsonPropertyName("channel")]
    public string Channel { get; set; } = string.Empty;

    [JsonPropertyName("updatedBy")]
    public string? UpdatedBy { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }

    [JsonPropertyName("finalizedAt")]
    public DateTime? FinalizedAt { get; set; }

    [JsonPropertyName("rawJson")]
    public ContactRawJson RawJson { get; set; } = new();

    [JsonPropertyName("timeOfContact")]
    public DateTime TimeOfContact { get; set; }

    [JsonPropertyName("queueName")]
    public string? QueueName { get; set; }

    [JsonPropertyName("channelSid")]
    public string? ChannelSid { get; set; }

    [JsonPropertyName("serviceSid")]
    public string? ServiceSid { get; set; }

    [JsonPropertyName("caseId")]
    public string? CaseId { get; set; }

    [JsonPropertyName("definitionVersion")]
    public string? DefinitionVersion { get; set; }
}

public class ContactRawJson
{
    [JsonPropertyName("definitionVersion")]
    public string? DefinitionVersion { get; set; }

    [JsonPropertyName("callType")]
    public string? CallType { get; set; }

    [JsonPropertyName("hangUpBy")]
    public string? HangUpBy { get; set; }

    [JsonPropertyName("childInformation")]
    public Dictionary<string, object?> ChildInformation { get; set; } = new();

    [JsonPropertyName("callerInformation")]
    public Dictionary<string, object?> CallerInformation { get; set; } = new();

    [JsonPropertyName("caseInformation")]
    public Dictionary<string, object?> CaseInformation { get; set; } = new();

    [JsonPropertyName("categories")]
    public Dictionary<string, List<string>> Categories { get; set; } = new();

    [JsonPropertyName("contactlessTask")]
    public ContactlessTask? ContactlessTask { get; set; }

    [JsonPropertyName("llmSupportedEntries")]
    public Dictionary<string, List<string>>? LlmSupportedEntries { get; set; }
}

public class ContactlessTask
{
    [JsonPropertyName("channel")]
    public string? Channel { get; set; }

    [JsonPropertyName("createdOnBehalfOf")]
    public string? CreatedOnBehalfOf { get; set; }

    [JsonExtensionData]
    public Dictionary<string, object?>? AdditionalData { get; set; }
}

public class SearchContactResult
{
    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("contacts")]
    public List<Contact> Contacts { get; set; } = [];
}
