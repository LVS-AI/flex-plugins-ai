using System.Text.Json.Serialization;

namespace LVS.Core.Models;

public class DefinitionVersion
{
    [JsonPropertyName("version")]
    public string? Version { get; set; }

    [JsonPropertyName("caseStatus")]
    public Dictionary<string, StatusInfo> CaseStatus { get; set; } = new();

    [JsonPropertyName("caseOverview")]
    public Dictionary<string, CaseOverviewTypeEntry>? CaseOverview { get; set; }

    [JsonPropertyName("caseFilters")]
    public Dictionary<string, CaseFilterConfig>? CaseFilters { get; set; }

    [JsonPropertyName("caseSectionTypes")]
    public Dictionary<string, CaseSectionTypeEntry>? CaseSectionTypes { get; set; }

    [JsonPropertyName("tabbedForms")]
    public TabbedForms TabbedForms { get; set; } = new();

    [JsonPropertyName("callTypeButtons")]
    public List<CallTypeButtonEntry>? CallTypeButtons { get; set; }

    [JsonPropertyName("layoutVersion")]
    public LayoutVersion? LayoutVersion { get; set; }

    [JsonPropertyName("helplineInformation")]
    public HelplineDefinitions? HelplineInformation { get; set; }

    [JsonPropertyName("cannedResponses")]
    public List<CannedResponse>? CannedResponses { get; set; }

    [JsonPropertyName("blockedEmojis")]
    public List<string>? BlockedEmojis { get; set; }

    [JsonPropertyName("customLinks")]
    public List<CustomLink>? CustomLinks { get; set; }

    [JsonPropertyName("flexUiLocales")]
    public List<FlexUILocaleEntry>? FlexUiLocales { get; set; }
}

public class StatusInfo
{
    [JsonPropertyName("value")]
    public string Value { get; set; } = string.Empty;

    [JsonPropertyName("label")]
    public string Label { get; set; } = string.Empty;

    [JsonPropertyName("color")]
    public string? Color { get; set; }

    [JsonPropertyName("transitions")]
    public List<string> Transitions { get; set; } = [];
}

public class CaseOverviewTypeEntry
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("label")]
    public string? Label { get; set; }

    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [JsonPropertyName("form")]
    public List<FormItemDefinition>? Form { get; set; }
}

public class CaseFilterConfig
{
    [JsonPropertyName("searchable")]
    public bool? Searchable { get; set; }

    [JsonPropertyName("type")]
    public CaseFilterType? Type { get; set; }

    [JsonPropertyName("allowFutureDates")]
    public bool? AllowFutureDates { get; set; }

    [JsonPropertyName("component")]
    public string? Component { get; set; }

    [JsonPropertyName("position")]
    public CaseFilterPosition Position { get; set; }
}

public class CaseSectionTypeEntry
{
    [JsonPropertyName("label")]
    public string? Label { get; set; }

    [JsonPropertyName("form")]
    public List<FormItemDefinition>? Form { get; set; }
}

public class TabbedForms
{
    [JsonPropertyName("callerInformationTab")]
    public List<FormItemDefinition> CallerInformationTab { get; set; } = [];

    [JsonPropertyName("caseInformationTab")]
    public List<FormItemDefinition> CaseInformationTab { get; set; } = [];

    [JsonPropertyName("childInformationTab")]
    public List<FormItemDefinition> ChildInformationTab { get; set; } = [];

    [JsonPropertyName("issueCategorizationTab")]
    public CategoriesDefinition? IssueCategorizationTab { get; set; }

    [JsonPropertyName("contactlessTaskTab")]
    public ContactlessTaskConfig? ContactlessTaskTab { get; set; }
}

public class CategoriesDefinition
{
    [JsonPropertyName("categories")]
    public Dictionary<string, CategoryEntry> Categories { get; set; } = new();

    [JsonPropertyName("maxSelections")]
    public int? MaxSelections { get; set; }
}

public class CategoryEntry
{
    [JsonPropertyName("color")]
    public string? Color { get; set; }

    [JsonPropertyName("subcategories")]
    public List<SubcategoryEntry> Subcategories { get; set; } = [];
}

public class SubcategoryEntry
{
    [JsonPropertyName("label")]
    public string Label { get; set; } = string.Empty;

    [JsonPropertyName("toolkitUrl")]
    public string? ToolkitUrl { get; set; }
}

public class ContactlessTaskConfig
{
    [JsonPropertyName("offlineChannels")]
    public List<string>? OfflineChannels { get; set; }
}

public class CallTypeButtonEntry
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = "button";

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("label")]
    public string Label { get; set; } = string.Empty;

    [JsonPropertyName("category")]
    public string Category { get; set; } = string.Empty;
}

public class HelplineDefinitions
{
    [JsonPropertyName("label")]
    public string? Label { get; set; }

    [JsonPropertyName("helplines")]
    public List<HelplineEntry> Helplines { get; set; } = [];
}

public class HelplineEntry
{
    [JsonPropertyName("label")]
    public string Label { get; set; } = string.Empty;

    [JsonPropertyName("value")]
    public string Value { get; set; } = string.Empty;

    [JsonPropertyName("default")]
    public bool? Default { get; set; }
}

public class CannedResponse
{
    [JsonPropertyName("label")]
    public string Label { get; set; } = string.Empty;

    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;
}

public class CustomLink
{
    [JsonPropertyName("icon")]
    public string? Icon { get; set; }

    [JsonPropertyName("label")]
    public string Label { get; set; } = string.Empty;

    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public string Type { get; set; } = "new-window";
}

public class FlexUILocaleEntry
{
    [JsonPropertyName("shortLabel")]
    public string? ShortLabel { get; set; }

    [JsonPropertyName("label")]
    public string Label { get; set; } = string.Empty;

    [JsonPropertyName("lvsLocale")]
    public string LVSLocale { get; set; } = string.Empty;

    [JsonPropertyName("flexLocale")]
    public string? FlexLocale { get; set; }
}

public class LayoutVersion
{
    [JsonPropertyName("contact")]
    public ContactLayout? Contact { get; set; }

    [JsonPropertyName("case")]
    public CaseLayout? Case { get; set; }

    [JsonPropertyName("thaiCharacterPdfSupport")]
    public bool? ThaiCharacterPdfSupport { get; set; }
}

public class ContactLayout
{
    [JsonPropertyName("callerInformation")]
    public LayoutDefinition? CallerInformation { get; set; }

    [JsonPropertyName("childInformation")]
    public LayoutDefinition? ChildInformation { get; set; }

    [JsonPropertyName("caseInformation")]
    public LayoutDefinition? CaseInformation { get; set; }
}

public class CaseLayout
{
    [JsonPropertyName("overview")]
    public LayoutDefinition? Overview { get; set; }
}

public class LayoutDefinition
{
    [JsonPropertyName("previewFields")]
    public List<string>? PreviewFields { get; set; }

    [JsonPropertyName("splitFormAt")]
    public int? SplitFormAt { get; set; }
}
