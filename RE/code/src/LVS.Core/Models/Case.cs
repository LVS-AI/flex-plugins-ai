using System.Text.Json.Serialization;

namespace LVS.Core.Models;

public class Case
{
    [JsonPropertyName("accountSid")]
    public string AccountSid { get; set; } = string.Empty;

    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("definitionVersion")]
    public string? DefinitionVersion { get; set; }

    [JsonPropertyName("label")]
    public string? Label { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = "open";

    [JsonPropertyName("helpline")]
    public string Helpline { get; set; } = string.Empty;

    [JsonPropertyName("twilioWorkerId")]
    public string TwilioWorkerId { get; set; } = string.Empty;

    [JsonPropertyName("info")]
    public CaseInfo Info { get; set; } = new();

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [JsonPropertyName("updatedBy")]
    public string? UpdatedBy { get; set; }

    [JsonPropertyName("statusUpdatedAt")]
    public DateTime? StatusUpdatedAt { get; set; }

    [JsonPropertyName("statusUpdatedBy")]
    public string? StatusUpdatedBy { get; set; }

    [JsonPropertyName("previousStatus")]
    public string? PreviousStatus { get; set; }
}

public class CaseInfo
{
    [JsonPropertyName("followUpDate")]
    public DateTime? FollowUpDate { get; set; }

    [JsonPropertyName("childIsAtRisk")]
    public bool? ChildIsAtRisk { get; set; }

    [JsonPropertyName("summary")]
    public string? Summary { get; set; }

    [JsonPropertyName("definitionVersion")]
    public string? DefinitionVersion { get; set; }

    [JsonPropertyName("offlineContactCreator")]
    public string? OfflineContactCreator { get; set; }

    [JsonExtensionData]
    public Dictionary<string, object?>? AdditionalData { get; set; }
}

public class CaseSection
{
    [JsonPropertyName("sectionType")]
    public string SectionType { get; set; } = string.Empty;

    [JsonPropertyName("sectionId")]
    public string SectionId { get; set; } = string.Empty;

    [JsonPropertyName("sectionTypeSpecificData")]
    public Dictionary<string, object?> SectionTypeSpecificData { get; set; } = new();

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("createdBy")]
    public string CreatedBy { get; set; } = string.Empty;

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }

    [JsonPropertyName("updatedBy")]
    public string? UpdatedBy { get; set; }

    [JsonPropertyName("eventTimestamp")]
    public DateTime EventTimestamp { get; set; }
}

public class SearchCaseResult
{
    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("cases")]
    public List<Case> Cases { get; set; } = [];
}

public class ListCasesSort
{
    [JsonPropertyName("sortBy")]
    public ListCasesSortBy? SortBy { get; set; }

    [JsonPropertyName("sortDirection")]
    public SortDirection? SortDirection { get; set; }
}

public class ListCasesFilters
{
    [JsonPropertyName("counsellors")]
    public List<string>? Counsellors { get; set; }

    [JsonPropertyName("statuses")]
    public List<string>? Statuses { get; set; }

    [JsonPropertyName("includeOrphans")]
    public bool IncludeOrphans { get; set; }

    [JsonPropertyName("createdAt")]
    public DateFilterValue? CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateFilterValue? UpdatedAt { get; set; }

    [JsonPropertyName("followUpDate")]
    public DateFilterValue? FollowUpDate { get; set; }

    [JsonPropertyName("categories")]
    public List<CategoryFilter>? Categories { get; set; }

    [JsonPropertyName("caseInfoFilters")]
    public Dictionary<string, object?>? CaseInfoFilters { get; set; }
}

public class CategoryFilter
{
    [JsonPropertyName("category")]
    public string Category { get; set; } = string.Empty;

    [JsonPropertyName("subcategory")]
    public string Subcategory { get; set; } = string.Empty;
}

public class DateFilterValue
{
    [JsonPropertyName("option")]
    public string? Option { get; set; }

    [JsonPropertyName("from")]
    public DateTime? From { get; set; }

    [JsonPropertyName("to")]
    public DateTime? To { get; set; }

    [JsonPropertyName("exists")]
    public DateExistsCondition? Exists { get; set; }
}
