# Data Models & Schemas

## Aselo Platform — Complete Type Definitions for .NET MAUI Rebuild

**Source:** Reverse-engineered from `techmatters/flex-plugins`  
**Date:** 2026-03-30

---

## 1. Core Identity Types (Branded SIDs)

These are Twilio-specific string identifiers with prefix validation:

```csharp
// C# equivalents for branded Twilio SID types
public record AccountSID(string Value); // Format: "AC" + 32 hex chars
public record WorkspaceSID(string Value); // Format: "WS..."
public record WorkerSID(string Value); // Format: "WK..."
public record TaskSID(string Value); // Format: "WT..." or "offline-contact-task-..."
public record ChatServiceSID(string Value); // Format: "IS..."
public record WorkflowSID(string Value); // Format: "WW..."
public record ConversationSID(string Value); // Format: "CH..."
public record CallSid(string Value); // Format: "CA..."
public record ConferenceSid(string Value); // Format: "CF..."
```

Special task SID values:
- `"standalone-task-sid"` — used for standalone (non-task) views
- `"offline-contact-task-{uuid}"` — used for offline/contactless entries

---

## 2. Contact Model

### Contact (Primary Entity)

```csharp
public class Contact
{
    public string Id { get; set; }
    public string AccountSid { get; set; } // "AC..."
    public string TwilioWorkerId { get; set; } // "WK..."
    public string Number { get; set; } // Caller phone/identifier
    public int ConversationDuration { get; set; } // Seconds
    public List<CSAMReportEntry> CsamReports { get; set; }
    public List<ResourceReferral> Referrals { get; set; }
    public List<ConversationMedia> ConversationMedia { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; }
    public string Helpline { get; set; }
    public string TaskId { get; set; } // "WT..." or offline
    public int? ProfileId { get; set; }
    public int? IdentifierId { get; set; }
    public string Channel { get; set; } // ChannelType enum value
    public string UpdatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? FinalizedAt { get; set; }
    public ContactRawJson RawJson { get; set; }
    public DateTime TimeOfContact { get; set; }
    public string QueueName { get; set; }
    public string ChannelSid { get; set; }
    public string ServiceSid { get; set; }
    public string CaseId { get; set; }
    public string DefinitionVersion { get; set; }
}
```

### ContactRawJson (Form Data)

```csharp
public class ContactRawJson
{
    public string DefinitionVersion { get; set; }
    public string CallType { get; set; } // "Child calling about self", "Someone calling about a child", or custom
    public string HangUpBy { get; set; } // "Agent", "Customer", "Consult", "Cold Transfer", "Warm Transfer", etc.
    public Dictionary<string, object> ChildInformation { get; set; }
    public Dictionary<string, object> CallerInformation { get; set; }
    public Dictionary<string, object> CaseInformation { get; set; }
    public Dictionary<string, List<string>> Categories { get; set; } // { "category": ["subcategory1", "subcategory2"] }
    public ContactlessTask ContactlessTask { get; set; }
    public Dictionary<string, List<string>> LlmSupportedEntries { get; set; } // Optional AI-filled fields
}

public class ContactlessTask
{
    public string Channel { get; set; }
    public string CreatedOnBehalfOf { get; set; } // "WK..." or ""
    // Additional dynamic fields
    public Dictionary<string, object> AdditionalData { get; set; }
}
```

### Search Contact Result

```csharp
public class SearchContactResult
{
    public int Count { get; set; }
    public List<Contact> Contacts { get; set; }
}
```

---

## 3. Case Model

### Case (Primary Entity)

```csharp
public class Case
{
    public string AccountSid { get; set; }
    public string Id { get; set; }
    public string DefinitionVersion { get; set; }
    public string Label { get; set; }
    public string Status { get; set; } // Configurable: "open", "closed", etc.
    public string Helpline { get; set; }
    public string TwilioWorkerId { get; set; }
    public CaseInfo Info { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string UpdatedBy { get; set; }
    public DateTime? StatusUpdatedAt { get; set; }
    public string StatusUpdatedBy { get; set; }
    public string PreviousStatus { get; set; }
}
```

### CaseInfo

```csharp
public class CaseInfo
{
    public DateTime? FollowUpDate { get; set; }
    public bool? ChildIsAtRisk { get; set; }
    public string Summary { get; set; }
    public string DefinitionVersion { get; set; }
    public string OfflineContactCreator { get; set; }
    // Additional dynamic fields per helpline
    public Dictionary<string, object> AdditionalData { get; set; }
}
```

### Case Section

```csharp
public class CaseSection
{
    public string SectionType { get; set; } // e.g., "note", "referral", "incident", "document"
    public string SectionId { get; set; }
    public Dictionary<string, object> SectionTypeSpecificData { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } // WorkerSID
    public DateTime? UpdatedAt { get; set; }
    public string UpdatedBy { get; set; }
    public DateTime EventTimestamp { get; set; }
}
```

### Case List Filters & Sorting

```csharp
public enum ListCasesSortBy
{
    ID,
    CREATED_AT,
    UPDATED_AT,
    LABEL,
    FOLLOW_UP_DATE
}

public enum SortDirection
{
    ASC,
    DESC
}

public class ListCasesSort
{
    public ListCasesSortBy? SortBy { get; set; }
    public SortDirection? SortDirection { get; set; }
}

public class ListCasesFilters
{
    public List<string> Counsellors { get; set; }
    public List<string> Statuses { get; set; }
    public bool IncludeOrphans { get; set; }
    public DateFilterValue CreatedAt { get; set; }
    public DateFilterValue UpdatedAt { get; set; }
    public DateFilterValue FollowUpDate { get; set; }
    public List<CategoryFilter> Categories { get; set; }
    public Dictionary<string, object> CaseInfoFilters { get; set; }
}

public class CategoryFilter
{
    public string Category { get; set; }
    public string Subcategory { get; set; }
}

public enum DateExistsCondition
{
    MUST_EXIST,
    MUST_NOT_EXIST
}

public class DateFilterValue
{
    public string Option { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public DateExistsCondition? Exists { get; set; }
}
```

### Search Case Result

```csharp
public class SearchCaseResult
{
    public int Count { get; set; }
    public List<Case> Cases { get; set; }
}
```

---

## 4. Profile Model

```csharp
public class Profile
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string DefinitionVersion { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<Identifier> Identifiers { get; set; }
    public List<ProfileFlagAssociation> ProfileFlags { get; set; }
    public List<ProfileSection> ProfileSections { get; set; }
    public bool? HasContacts { get; set; }
}

public class Identifier
{
    public int Id { get; set; }
    public string IdentifierValue { get; set; } // Phone, email, etc.
    public string AccountSid { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<Profile> Profiles { get; set; }
}

public class ProfileSection
{
    public int Id { get; set; }
    public string SectionType { get; set; }
    public string Content { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class ProfileFlag
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ValidUntil { get; set; }
}

public class ProfileFlagAssociation
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime? ValidUntil { get; set; }
}

public enum ProfilesListSortBy
{
    ID,
    NAME
}

public class ProfilesListSort
{
    public ProfilesListSortBy? SortBy { get; set; }
    public SortDirection? SortDirection { get; set; }
}

public class ProfilesListFilters
{
    public List<string> Statuses { get; set; }
}
```

---

## 5. CSAM Report Model

```csharp
public class CSAMReportEntry
{
    public string CsamReportId { get; set; }
    public int Id { get; set; }
    public string ReportType { get; set; } // "counsellor-generated" or "self-generated"
    public bool Acknowledged { get; set; }
    public int? ContactId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string UpdatedBy { get; set; }
    public string TwilioWorkerId { get; set; }
}
```

---

## 6. Resource Referral Model

```csharp
public class ResourceReferral
{
    public string ResourceId { get; set; }
    public DateTime ReferredAt { get; set; }
    public string ResourceName { get; set; }
}

public enum ReferralLookupStatus
{
    NotStarted,
    Pending,
    Found,
    NotFound
}

public class DraftResourceReferralState
{
    public string ResourceReferralIdToAdd { get; set; }
    public ReferralLookupStatus LookupStatus { get; set; }
}
```

---

## 7. Conversation Media Model

```csharp
public abstract class ConversationMedia
{
    public string StoreType { get; set; } // "twilio" or "S3"
}

public class TwilioStoredMedia : ConversationMedia
{
    public string ReservationSid { get; set; }
}

public class S3StoredMedia : ConversationMedia
{
    public string Type { get; set; } // "transcript" or "recording"
    public S3Location Location { get; set; }
}

public class S3Location
{
    public string Bucket { get; set; }
    public string Key { get; set; }
}

public class GenerateSignedUrlParams
{
    public string Method { get; set; } // "getObject", "putObject", "deleteObject"
    public string ObjectType { get; set; } // "case" or "contact"
    public string ObjectId { get; set; }
    public string FileType { get; set; } // "recording", "transcript", "document"
    public S3Location Location { get; set; }
}
```

---

## 8. Channel Types

```csharp
public static class ChannelTypes
{
    // Default channels
    public const string Voice = "voice";
    public const string Sms = "sms";
    public const string Facebook = "facebook";
    public const string WhatsApp = "whatsapp";
    public const string Web = "web";
    
    // Custom channels
    public const string Telegram = "telegram";
    public const string Instagram = "instagram";
    public const string Line = "line";
    public const string Messenger = "messenger";
    public const string Modica = "modica";
    
    // Default/fallback
    public const string Default = "default";
    
    public static readonly string[] ChatChannels = {
        WhatsApp, Facebook, Messenger, Web, Modica, Sms, Telegram, Instagram, Line
    };
    
    public static readonly string[] AllChannels = {
        Voice, Sms, Facebook, WhatsApp, Web, Telegram, Instagram, Line, Messenger, Modica
    };
}
```

---

## 9. Call Types

```csharp
public static class CallTypes
{
    public const string Child = "Child calling about self";
    public const string Caller = "Someone calling about a child";
    
    // Non-data types are configurable per helpline via CallTypeButtons definitions
}
```

---

## 10. Transfer Types

```csharp
public static class TransferModes
{
    public const string Cold = "COLD";
    public const string Warm = "WARM";
}

public static class TransferStatuses
{
    public const string Transferring = "transferring";
    public const string Accepted = "accepted";
    public const string Rejected = "rejected";
}
```

---

## 11. HangUpBy Types

```csharp
public static class HangUpBy
{
    public const string Agent = "Agent";
    public const string Customer = "Customer";
    public const string Consult = "Consult";
    public const string ColdTransfer = "Cold Transfer";
    public const string WarmTransfer = "Warm Transfer";
    public const string ExternalColdTransfer = "External Cold Transfer";
    public const string ExternalWarmTransfer = "External Warm Transfer";
}
```

---

## 12. Form Definition Schema

These schemas define the dynamic, configurable forms used throughout the system.

### Form Input Types

```csharp
public enum FormInputType
{
    Input,
    SearchInput,
    NumericInput,
    Email,
    RadioInput,
    ListboxMultiselect,
    Select,
    DependentSelect,
    Checkbox,
    MixedCheckbox,
    Textarea,
    DateInput,
    TimeInput,
    FileUpload,
    Button,
    CopyTo,
    CustomContactComponent
}
```

### Form Item Definition

```csharp
public class FormItemDefinition
{
    public string Name { get; set; }
    public string Label { get; set; }
    public FormInputType Type { get; set; }
    public FormItemDescription Description { get; set; }
    public string Placeholder { get; set; }
    public Dictionary<string, object> Metadata { get; set; }
    public bool? IsPII { get; set; }
    
    // Validation rules
    public ValidationRule Required { get; set; }
    public NumericValidationRule Min { get; set; }
    public NumericValidationRule Max { get; set; }
    public NumericValidationRule MinLength { get; set; }
    public NumericValidationRule MaxLength { get; set; }
    
    // Type-specific properties
    public List<SelectOption> Options { get; set; } // For Select, Radio, Listbox
    public string DefaultValue { get; set; }
    public Dictionary<string, List<SelectOption>> DependentOptions { get; set; } // For DependentSelect
    public string InitialChecked { get; set; } // For Checkbox: "true", "false", "mixed"
}

public class FormItemDescription
{
    public string Title { get; set; }
    public string Content { get; set; }
}

public class ValidationRule
{
    public bool Value { get; set; }
    public string Message { get; set; }
}

public class NumericValidationRule
{
    public int Value { get; set; }
    public string Message { get; set; }
}

public class SelectOption
{
    public string Value { get; set; }
    public string Label { get; set; }
}
```

### Categories Definition

```csharp
public class CategoriesDefinition
{
    public Dictionary<string, CategoryEntry> Categories { get; set; }
    public int? MaxSelections { get; set; }
}

public class CategoryEntry
{
    public string Color { get; set; }
    public List<SubcategoryEntry> Subcategories { get; set; }
}

public class SubcategoryEntry
{
    public string Label { get; set; }
    public string ToolkitUrl { get; set; }
}
```

### Case Status Definition

```csharp
public class StatusInfo
{
    public string Value { get; set; }
    public string Label { get; set; }
    public string Color { get; set; }
    public List<string> Transitions { get; set; } // Allowed next statuses
}
```

### Case Section Type Definition

```csharp
public class CaseSectionTypeEntry
{
    public string Label { get; set; }
    public List<FormItemDefinition> Form { get; set; }
}
```

### Case Overview Definition

```csharp
public class CaseOverviewTypeEntry
{
    public string Name { get; set; }
    public string Label { get; set; }
    public string Type { get; set; }
    public List<FormItemDefinition> Form { get; set; }
}
```

### Case Filters Definition

```csharp
public enum CaseFilterType
{
    MultiSelect,
    DateInput
}

public enum CaseFilterPosition
{
    Left,
    Right
}

public class CaseFilterConfig
{
    public bool? Searchable { get; set; }
    public CaseFilterType? Type { get; set; }
    public bool? AllowFutureDates { get; set; }
    public string Component { get; set; }
    public CaseFilterPosition Position { get; set; }
}
```

---

## 13. Definition Version (Master Schema)

This is the top-level configuration object that defines all forms, categories, and behavior for a helpline.

```csharp
public class DefinitionVersion
{
    // Case configuration
    public Dictionary<string, StatusInfo> CaseStatus { get; set; }
    public Dictionary<string, CaseOverviewTypeEntry> CaseOverview { get; set; }
    public Dictionary<string, CaseFilterConfig> CaseFilters { get; set; }
    public Dictionary<string, CaseSectionTypeEntry> CaseSectionTypes { get; set; }
    
    // Contact forms (tabbed)
    public TabbedForms TabbedForms { get; set; }
    
    // Call type buttons
    public List<CallTypeButtonEntry> CallTypeButtons { get; set; }
    
    // Layout configuration
    public LayoutVersion LayoutVersion { get; set; }
    
    // Helpline info
    public HelplineDefinitions HelplineInformation { get; set; }
    
    // Optional features
    public List<CannedResponse> CannedResponses { get; set; }
    public InsightsConfig Insights { get; set; }
    public PrepopulateConfig PrepopulateKeys { get; set; }
    public PrepopulateMappings PrepopulateMappings { get; set; }
    public Dictionary<string, object> ReferenceData { get; set; }
    public List<string> BlockedEmojis { get; set; }
    public ProfileForms ProfileForms { get; set; }
    public CustomStrings CustomStrings { get; set; }
    public List<FlexUILocaleEntry> FlexUiLocales { get; set; }
    public List<CustomLink> CustomLinks { get; set; }
}

public class TabbedForms
{
    public List<FormItemDefinition> CallerInformationTab { get; set; }
    public List<FormItemDefinition> CaseInformationTab { get; set; }
    public List<FormItemDefinition> ChildInformationTab { get; set; }
    public CategoriesDefinition IssueCategorizationTab { get; set; } // Per helpline
    public ContactlessTaskConfig ContactlessTaskTab { get; set; }
}

public class ContactlessTaskConfig
{
    public List<string> OfflineChannels { get; set; }
}

public class CallTypeButtonEntry
{
    public string Type { get; set; } // "button"
    public string Name { get; set; }
    public string Label { get; set; }
    public string Category { get; set; } // "data" or "non-data"
}

public class HelplineDefinitions
{
    public string Label { get; set; }
    public List<HelplineEntry> Helplines { get; set; }
}

public class HelplineEntry
{
    public string Label { get; set; }
    public string Value { get; set; }
    public bool? Default { get; set; }
    public string KmsUrl { get; set; }
    public HelplineManager Manager { get; set; }
}

public class HelplineManager
{
    public string Name { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
}

public class CannedResponse
{
    public string Label { get; set; }
    public string Text { get; set; }
}

public class CustomLink
{
    public string Icon { get; set; }
    public string Label { get; set; }
    public string Url { get; set; }
    public string Type { get; set; } // "embedded" or "new-window"
}

public class FlexUILocaleEntry
{
    public string ShortLabel { get; set; }
    public string Label { get; set; }
    public string AseloLocale { get; set; }
    public string FlexLocale { get; set; }
}
```

---

## 14. Layout Version

```csharp
public class LayoutVersion
{
    public ContactLayout Contact { get; set; }
    public CaseLayout Case { get; set; }
    public bool? ThaiCharacterPdfSupport { get; set; }
}

public class ContactLayout
{
    public LayoutDefinition CallerInformation { get; set; }
    public LayoutDefinition ChildInformation { get; set; }
    public LayoutDefinition CaseInformation { get; set; }
}

public class CaseLayout
{
    public bool? HideCounselorDetails { get; set; }
    public Dictionary<string, LayoutDefinition> SectionTypes { get; set; }
}

public class LayoutDefinition
{
    public List<string> PreviewFields { get; set; }
    public Dictionary<string, LayoutValue> Layout { get; set; }
    public int? SplitFormAt { get; set; }
    public int? CaseHomeOrder { get; set; }
    public int? PrintOrder { get; set; }
    public string CaseHomeLocation { get; set; } // "list", "timeline", "hidden"
    public string PrintFormat { get; set; } // "tabular", "list", "hidden"
    public string TimelineIcon { get; set; }
}

public class LayoutValue
{
    public bool IncludeLabel { get; set; }
    public string Format { get; set; } // "date", "string", "file", "timestamp", "duration-from-seconds"
    public string ValueTemplateCode { get; set; }
    public string LabelTemplateCode { get; set; }
    public double? WidthRatio { get; set; }
}
```

---

## 15. Feature Flags

```csharp
public class FeatureFlags
{
    public bool EnableAssignedSkillTeamsViewFilters { get; set; }
    public bool EnableCannedResponses { get; set; }
    public bool EnableConferenceStatusEventHandler { get; set; }
    public bool EnableConfirmOnBrowserClose { get; set; }
    public bool EnableCsamClcReport { get; set; }
    public bool EnableCsamReport { get; set; }
    public bool EnableCustomLinks { get; set; }
    public bool EnableDualWrite { get; set; }
    public bool EnableEmojiPicker { get; set; }
    public bool EnableExternalTranscripts { get; set; }
    public bool EnableFullstoryMonitoring { get; set; }
    public bool EnableLanguageSelector { get; set; }
    public bool EnableLastCaseStatusUpdateInfo { get; set; }
    public bool EnableLlmSummary { get; set; }
    public bool EnableManualPulling { get; set; }
    public bool EnablePostSurvey { get; set; }
    public bool EnablePreviousContacts { get; set; }
    public bool EnableRegionResourceSearch { get; set; }
    public bool EnableResourcesUpdates { get; set; }
    public bool EnableSaveInsights { get; set; }
    public bool EnableSelectAgentsTeamsView { get; set; }
    public bool EnableSwitchboarding { get; set; }
    public bool EnableSwitchboardingMoveTasks { get; set; }
    public bool EnableTwilioTranscripts { get; set; }
    public bool EnableVoiceRecordings { get; set; }
    public bool UsePrepopulateMappings { get; set; }
    public bool UseTwilioLambdaForConferenceFunctions { get; set; }
    public bool UseTwilioLambdaForConversationDuration { get; set; }
    public bool UseTwilioLambdaForIwfReporting { get; set; }
    public bool UseTwilioLambdaForOfflineContactTasks { get; set; }
    public bool UseTwilioLambdaForRecordingsLookup { get; set; }
    public bool UseTwilioLambdaForWorkerEndpoints { get; set; }
    public bool UseTwilioLambdaToIssueSyncToken { get; set; }
    public bool UseTwilioLambdaToSendMessages { get; set; }
    public bool UseTwilioLambdaToTransitionParticipants { get; set; }
    public bool UseTwilioLambdaTransfers { get; set; }
}
```

---

## 16. Permission / Authorization Types

```csharp
public enum TargetKind
{
    Case,
    Contact,
    ContactField,
    Profile,
    ProfileSection,
    PostSurvey,
    ViewIdentifiers
}

// Actions
public static class CaseActions
{
    public const string ViewCase = "viewCase";
    public const string CloseCase = "closeCase";
    public const string ReopenCase = "reopenCase";
    public const string CaseStatusTransition = "caseStatusTransition";
    public const string AddCaseSection = "addCaseSection";
    public const string EditCaseSection = "editCaseSection";
    public const string EditCaseOverview = "editCaseOverview";
    public const string UpdateCaseContacts = "updateCaseContacts";
}

public static class ContactActions
{
    public const string ViewContact = "viewContact";
    public const string EditContact = "editContact";
    public const string EditInProgressContact = "editInProgressContact";
    public const string ViewExternalTranscript = "viewExternalTranscript";
    public const string ViewRecording = "viewRecording";
    public const string AddContactToCase = "addContactToCase";
    public const string RemoveContactFromCase = "removeContactFromCase";
}

public static class ProfileActions
{
    public const string ViewProfile = "viewProfile";
    public const string FlagProfile = "flagProfile";
    public const string UnflagProfile = "unflagProfile";
    public const string CreateProfileSection = "createProfileSection";
    public const string ViewProfileSection = "viewProfileSection";
    public const string EditProfileSection = "editProfileSection";
}

// Condition types for permission rules
public abstract class PermissionCondition { }
public class EveryoneCondition : PermissionCondition { }
public class NobodyCondition : PermissionCondition { }
public class IsSupervisorCondition : PermissionCondition { }
public class IsOwnerCondition : PermissionCondition { }
public class IsCreatorCondition : PermissionCondition { }
public class IsCaseOpenCondition : PermissionCondition { }
public class IsCaseContactOwnerCondition : PermissionCondition { }
public class CreatedHoursAgoCondition : PermissionCondition { public int Hours { get; set; } }
public class CreatedDaysAgoCondition : PermissionCondition { public int Days { get; set; } }
public class FieldCondition : PermissionCondition { public string Field { get; set; } }
public class SectionTypeCondition : PermissionCondition { public string SectionType { get; set; } }

// Permission rule: action → array of condition-sets (OR of ANDs)
public class PermissionRules
{
    public Dictionary<string, List<List<PermissionCondition>>> Rules { get; set; }
}
```

---

## 17. Routing Types

```csharp
public enum TabbedFormSubroute
{
    ContactlessTask,
    CallerInformation,
    ChildInformation,
    Categories,
    CaseInformation,
    Profile,
    ProfileEdit
}

public enum CaseItemAction
{
    Add,
    Edit,
    View
}

public enum ChangeRouteMode
{
    Push,
    Replace,
    ResetModal,
    ResetRoute
}

// Route types (discriminated union — use inheritance or tagged union in C#)
public abstract class AppRoute
{
    public string RouteType { get; set; }
}

public class TabbedFormRoute : AppRoute { public TabbedFormSubroute Subroute { get; set; } }
public class SearchRoute : AppRoute { /* search form state */ }
public class CaseListRoute : AppRoute { }
public class ProfileListRoute : AppRoute { }
public class CaseRoute : AppRoute { public string CaseId { get; set; } public CaseItemAction Action { get; set; } }
public class ContactRoute : AppRoute { public string ContactId { get; set; } }
public class ProfileRoute : AppRoute { public int ProfileId { get; set; } public string Tab { get; set; } }
public class CSAMReportRoute : AppRoute { }
```

---

## 18. Webchat Session Types

```csharp
public class WebchatInitRequest
{
    public string CustomerFriendlyName { get; set; }
    public string PreEngagementData { get; set; } // JSON string
    public string DeploymentKey { get; set; }
}

public class WebchatInitResponse
{
    public string Token { get; set; } // JWT
    public string ConversationSid { get; set; }
    public string Identity { get; set; }
    public DateTime Expiration { get; set; }
}

public class WebchatConfig
{
    public string DeploymentKey { get; set; }
    public string HelplineCode { get; set; }
    public string Region { get; set; }
    public bool AlwaysOpen { get; set; }
    public string DefaultLocale { get; set; }
    public string CurrentLocale { get; set; }
    public WebchatTheme Theme { get; set; }
    public Dictionary<string, Dictionary<string, string>> Translations { get; set; }
    public List<FormItemDefinition> PreEngagementFormDefinition { get; set; }
    public FileAttachmentConfig FileAttachment { get; set; }
}

public class FileAttachmentConfig
{
    public bool Enabled { get; set; }
    public int MaxFileSize { get; set; }
    public List<string> AcceptedExtensions { get; set; }
}

public class WebchatTheme
{
    public bool IsLight { get; set; }
}
```

---

## 19. Search Form Types

```csharp
public class SearchFormValues
{
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string Counselor { get; set; } = "";
    public string PhoneNumber { get; set; } = "";
    public string DateFrom { get; set; } = "";
    public string DateTo { get; set; } = "";
    public string ContactNumber { get; set; } = "";
    public SelectOption Helpline { get; set; }
    public string SearchTerm { get; set; } = "";
    public bool OnlyDataContacts { get; set; } = false;
}
```

---

## 20. Timeline Activity Types

```csharp
public abstract class TimelineActivity
{
    public DateTime Timestamp { get; set; }
    public string ActivityType { get; set; } // "case-section", "contact", "contact-id", "case-section-id"
}

public class ContactTimelineActivity : TimelineActivity
{
    public string ContactId { get; set; }
}

public class CaseSectionTimelineActivity : TimelineActivity
{
    public string SectionType { get; set; }
    public string SectionId { get; set; }
}
```

---

## 21. Counselor Type

```csharp
public class Counselor
{
    public string Sid { get; set; } // WorkerSID
    public string FullName { get; set; }
}
```

---

## 22. External Recording Types

```csharp
/// <summary>Discriminated union for external recording lookup result.</summary>
public abstract class ExternalRecordingInfo
{
    public string Status { get; set; }
}

public class ExternalRecordingInfoSuccess : ExternalRecordingInfo
{
    // Status = "success"
    public string RecordingSid { get; set; }
    public string Bucket { get; set; }
    public string Key { get; set; }
}

public class ExternalRecordingInfoFailure : ExternalRecordingInfo
{
    // Status = "failure"
    public string Name { get; set; }
    public string Error { get; set; }
}
```

---

## 23. Insights Attribute Mappings

```csharp
/// <summary>Maps contact fields to Twilio Flex Insights attribute slots.</summary>
public class InsightsAttributes
{
    public Dictionary<string, object> Conversations { get; set; }
    public Dictionary<string, object> Customers { get; set; }
}

/// <summary>Core attribute field map. Multi-value fields use ';' delimiter.</summary>
public static class InsightsFieldMap
{
    // Conversations attributes
    public const string CommunicationChannel = "communication_channel";
    public const string Subcategories = "conversation_attribute_1"; // ';'-delimited
    public const string CallType = "conversation_attribute_2";
    public const string CallerAge = "conversation_attribute_3";
    public const string CallerGender = "conversation_attribute_4";
    public const string Helpline = "conversation_attribute_8";
    public const string Language = "language";
    
    // Customers attributes
    public const string ChildAge = "year_of_birth";
    public const string ChildGender = "gender";
    
    public const string MultiValueDelimiter = ";";
}
```

---

## 24. LLM / AI Assistant Types

```csharp
/// <summary>Transcript entry for LLM summarization.</summary>
public class TranscriptEntry
{
    public string From { get; set; }
    public string Role { get; set; }
    public string Content { get; set; }
}

// TranscriptForLlmAssistant is List<TranscriptEntry>

public class LlmAssistantSummary
{
    public string SummaryText { get; set; }
    public string Id { get; set; }
}
```

---

## 25. Conference Service Types

```csharp
public class ConferenceAddParticipantParams
{
    public string ConferenceSid { get; set; }
    public string To { get; set; }
    public string From { get; set; }
    public string CallStatusSyncDocumentSid { get; set; }
    public string Label { get; set; }
}

public class ConferenceGetParticipantParams
{
    public string ConferenceSid { get; set; }
    public string CallSid { get; set; }
}

public class ConferenceRemoveParticipantParams
{
    public string ConferenceSid { get; set; }
    public string CallSid { get; set; }
}

/// <summary>Valid update keys: endConferenceOnExit, hold, muted (booleans).</summary>
public class ConferenceUpdateParticipantParams
{
    public string ConferenceSid { get; set; }
    public string CallSid { get; set; }
    public Dictionary<string, bool> Updates { get; set; } // Keys: "endConferenceOnExit", "hold", "muted"
}
```

---

## 26. IWF Report Types

```csharp
/// <summary>Counsellor-generated IWF report — sent to IWF API.</summary>
public class IWFReportFields
{
    public string ReportedUrl { get; set; }       // form.webAddress
    public string ReporterDescription { get; set; } // form.description
    public string ReporterAnonymous { get; set; }  // "Y" or "N"
    public string ReporterFirstName { get; set; }
    public string ReporterLastName { get; set; }
    public string ReporterEmailId { get; set; }
}

/// <summary>Child/self-generated IWF report fields.</summary>
public class IWFSelfReportFields
{
    public string UserAgeRange { get; set; }  // form.childAge
    public string CaseNumber { get; set; }
}
```

---

## 27. Switchboard Types

```csharp
public class SwitchboardToggleParams
{
    public string Operation { get; set; }           // "disable" or "enable"
    public string OriginalQueueSid { get; set; }
    public string SupervisorWorkerSid { get; set; }
}
```

---

## 28. API Error Types

```csharp
/// <summary>Base API error with response metadata.</summary>
public class ApiError : Exception
{
    public HttpResponseMessage Response { get; set; }
    public object Body { get; set; }
    
    public ApiError(string message, HttpResponseMessage response = null, object body = null)
        : base(message)
    {
        Response = response;
        Body = body;
    }
}

/// <summary>Error from protected (Twilio Serverless) API calls.</summary>
public class ProtectedApiError : ApiError
{
    public string ServerStack { get; set; }
    
    public ProtectedApiError(string message, HttpResponseMessage response = null, object body = null)
        : base(message, response, body) { }
}

/// <summary>Extended fetch options, mirroring TS FetchOptions.</summary>
public class FetchOptions
{
    public bool ReturnNullFor404 { get; set; }
    public bool? UseTwilioLambda { get; set; }
    public bool? UseJsonEncode { get; set; } // false = URL-encoded body (default for protected API)
}
```

---

## 29. Resource Service Types

```csharp
public class AttributeData<T>
{
    public string Language { get; set; }
    public object Value { get; set; } // string | bool | number
    public T Info { get; set; }
}

public class ReferrableResource
{
    public string Id { get; set; }
    public string Name { get; set; }
    public Dictionary<string, object> Attributes { get; set; } // Nested attribute tree
}

public class ResourceSearchParameters
{
    public string GeneralSearchTerm { get; set; }
    public Dictionary<string, object> Filters { get; set; } // Values: string | string[] | number | bool
}

public class ResourceSearchResult
{
    public int TotalCount { get; set; }
    public List<ReferrableResource> Results { get; set; }
}

public class ListAttributeStringValue
{
    public string Value { get; set; }
    public object Info { get; set; }
    public string Language { get; set; }
}

public class ReferenceAttributeStringValue
{
    public string Value { get; set; }
    public string Id { get; set; }
    public object Info { get; set; }
    public string Language { get; set; }
}
```

---

## 30. Webchat State Types (Modern Webchat)

```csharp
public enum EngagementPhase
{
    PreEngagementForm,
    MessagingCanvas,
    Loading
}

public class PreEngagementDataItem
{
    public object Value { get; set; } // string | bool
    public string Error { get; set; }
    public bool Dirty { get; set; }
}

public class WebchatChatState
{
    public object ConversationsClient { get; set; }
    public object Conversation { get; set; }
    public List<object> Participants { get; set; }
    public List<object> Users { get; set; }
    public List<object> Messages { get; set; }
    public List<object> AttachedFiles { get; set; }
    public string ConversationState { get; set; } // "active" | "inactive" | "closed"
    public Dictionary<string, string> ParticipantNames { get; set; }
}

public class WebchatSessionState
{
    public EngagementPhase CurrentPhase { get; set; }
    public bool Expanded { get; set; }
    public string Token { get; set; }
    public string ConversationSid { get; set; }
    public Dictionary<string, PreEngagementDataItem> PreEngagementData { get; set; }
}

public class WebchatConfigState
{
    public FileAttachmentConfig FileAttachment { get; set; }
    public string DeploymentKey { get; set; }
    public string Region { get; set; }
    public bool? AlwaysOpen { get; set; }
    public WebchatTheme Theme { get; set; }
    public string HelplineCode { get; set; }
    public string AseloBackendUrl { get; set; }
    public string DefinitionVersion { get; set; }
    public string Environment { get; set; }
    public object PreEngagementFormDefinition { get; set; }
    public Dictionary<string, Dictionary<string, string>> Translations { get; set; }
    public string DefaultLocale { get; set; }
    public string CurrentLocale { get; set; }
    public string QuickExitUrl { get; set; } // Must start with "https://"
}

public class WebchatNotification
{
    public bool Dismissible { get; set; }
    public string Id { get; set; }
    public string Message { get; set; }
    public int? Timeout { get; set; }
    public string Type { get; set; } // "error" | "warning" | "neutral" | "success"
}

/// <summary>Complete webchat Redux store shape.</summary>
public class WebchatAppState
{
    public WebchatChatState Chat { get; set; }
    public WebchatConfigState Config { get; set; }
    public WebchatSessionState Session { get; set; }
    public List<WebchatNotification> Notifications { get; set; }
    public WebchatTaskState Task { get; set; }
}
```

---

## 31. Webchat Session Persistence Types

```csharp
/// <summary>Stored in localStorage under key "TWILIO_WEBCHAT_WIDGET".</summary>
public class SessionDataStorage
{
    public string Token { get; set; }
    public string ConversationSid { get; set; }
    public string Identity { get; set; }
    public string Expiration { get; set; }
    public string LoginTimestamp { get; set; }
    public Dictionary<string, string> ParticipantNameMap { get; set; }
}

public class InitWebchatPayload
{
    public string CustomerFriendlyName { get; set; }
    public string PreEngagementData { get; set; } // JSON string
    public string DeploymentKey { get; set; }
    public string Identity { get; set; } // Optional: reuse identity from previous session
}

public class RefreshTokenPayload
{
    public string DeploymentKey { get; set; }
    public string Token { get; set; }
}

public class EndChatPayload
{
    public string ChannelSid { get; set; }
    public string Language { get; set; }
    public string Token { get; set; }
}
```

---

## 32. Security Headers Types (Webchat)

```csharp
/// <summary>Anti-bot/fingerprinting headers sent with every webchat API call.</summary>
public class WebchatSecurityHeaders
{
    public string XTwilioSecUserSettings { get; set; }  // "x-twilio-sec-usersettings" → JSON { language, cookieEnabled, userTimezone }
    public string XTwilioSecWebchatInfo { get; set; }   // "x-twilio-sec-webchatinfo" → JSON { loginTimestamp }
    public string XTwilioSecDecoders { get; set; }      // "x-twilio-sec-decoders" → JSON { audio: MediaCapabilitiesInfo, video: MediaCapabilitiesInfo }
}

/// <summary>Version tracking headers.</summary>
public class MixPanelHeaders
{
    public string UiVersion { get; set; }       // "ui-version"
    public string WebchatVersion { get; set; }  // "webchat-version"
}
```

---

## 33. Region Utilities

```csharp
/// <summary>Region string transformation for different Twilio API contexts.</summary>
public static class RegionUtil
{
    /// <summary>Builds host suffix: prod→"", dev-us1→".dev", stage-us1→".stage"</summary>
    public static string BuildRegionalHost(string region) => region switch
    {
        "prod" or "us1" or "" or null => "",
        "dev-us1" => ".dev",
        "stage-us1" => ".stage",
        _ => $".{region}"
    };

    /// <summary>For Conversations SDK: prod→"us1", dev→"dev-us1", stage→"stage-us1"</summary>
    public static string ParseRegionForConversations(string region) => region switch
    {
        "prod" or "" or null => "us1",
        "dev" => "dev-us1",
        "stage" => "stage-us1",
        _ => region
    };
}
```

---

## 34. Profile List Extended Types

```csharp
/// <summary>Updated sort options including createdAt/updatedAt from ProfileService.</summary>
public enum ProfilesListSortBy
{
    ID,
    NAME,
    CREATED_AT,
    UPDATED_AT
}

public class GetProfilesListParams
{
    public int Offset { get; set; } = 0;
    public int Limit { get; set; } = 10;
    public ProfilesListSortBy SortBy { get; set; } = ProfilesListSortBy.ID;
    public SortDirection? SortDirection { get; set; }
    public List<int> ProfileFlagIds { get; set; } // Filter by flag associations
}
```

---

## 35. Contact Save Flow Types

```csharp
/// <summary>Result of determining conversation media from a Twilio task.</summary>
public class HandleTwilioTaskResponse
{
    public List<ConversationMedia> ConversationMedia { get; set; }
    public ExternalRecordingInfoSuccess ExternalRecordingInfo { get; set; } // null if not found
}

/// <summary>Draft changes that can be applied to a contact.</summary>
public class ContactDraftChanges
{
    public ContactRawJson RawJson { get; set; }
    public string Channel { get; set; }
    // Any partial contact fields
}

// Contact save flow:
// 1. updateContactInHrm(contactId, changes, finalize: false) → saves draft
// 2. updateContactInHrm(contactId, changes, finalize: true) → finalizes contact
// Query param: ?finalize=true|false
// Dual-write: saveContactToHrm + saveContactToExternalBackend (if enable_dual_write)
```

---

## 36. Operating Hours Types

```csharp
/// <summary>Days of the week enum (1-based, Monday=1).</summary>
public enum DaysOfTheWeek
{
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7
}

/// <summary>Operating shift with numeric HHMM format (e.g., 900=9:00AM, 1730=5:30PM).</summary>
public class OperatingShift
{
    public int Open { get; set; }   // e.g., 900
    public int Close { get; set; }  // e.g., 1700
}

/// <summary>Operating info for a single office location.</summary>
public class OfficeOperatingInfo
{
    public string Timezone { get; set; }  // e.g., "Pacific/Auckland"
    public Dictionary<string, string> Holidays { get; set; }  // "MM/DD/YYYY" → holiday name
    public Dictionary<string, Dictionary<string, List<OperatingShift>>> OperatingHours { get; set; }
    // Outer key: channel type (e.g., "web", "voice")
    // Inner key: day name (e.g., "Monday")
    // Value: list of shifts (supports split shifts, e.g., morning + afternoon)
}

/// <summary>Root operating hours config for a helpline — supports multi-office.</summary>
public class HelplineOperatingHours
{
    // Root-level default (used when office not specified)
    public OfficeOperatingInfo Default { get; set; }
    // Per-office overrides
    public Dictionary<string, OfficeOperatingInfo> Offices { get; set; }
}
```

---

## 37. Bot Channel Capture Types

```csharp
/// <summary>Attributes set when a channel is captured by a bot (Lex chatbot).</summary>
public class CapturedChannelAttributes
{
    public string UserId { get; set; }
    public string Environment { get; set; }
    public string HelplineCode { get; set; }
    public string BotLanguage { get; set; }
    public string BotSuffix { get; set; }
    public string ControlTaskSid { get; set; }
    public string ReleaseType { get; set; }  // "triggerStudioFlow" | "postSurveyComplete"
    public string StudioFlowSid { get; set; }
    public string ChannelType { get; set; }
    public bool IsConversation { get; set; }
    public string ChatbotCallbackWebhookSid { get; set; }
}
```

---

## 38. Lambda Request Pipeline Types

```csharp
/// <summary>Parsed HTTP request from ALB event.</summary>
public class HttpRequest
{
    public string Method { get; set; }
    public Dictionary<string, string> Headers { get; set; }
    public string Path { get; set; }
    public Dictionary<string, string> Query { get; set; }
    public object Body { get; set; }
}

/// <summary>Route definition with chained validation pipeline.</summary>
public class FunctionRoute
{
    public List<Func<HttpRequest, Task<Result<HttpError, HttpRequest>>>> RequestPipeline { get; set; }
    public Func<HttpRequest, Task<Result<HttpError, object>>> Handler { get; set; }
}

/// <summary>Token validator response from Flex token validation.</summary>
public class TokenValidatorResponse
{
    public string WorkerSid { get; set; }
    public List<string> Roles { get; set; }
    public string Identity { get; set; }
}
```

---

## 39. Theme & Styling Types

```csharp
/// <summary>Complete HRM theme with 100+ color tokens.</summary>
public class HrmTheme
{
    // Base colors (base1 through base11)
    public string Base1 { get; set; }  // lightest
    public string Base11 { get; set; } // darkest
    
    // Agent display colors
    public List<string> AgentColors { get; set; }
    
    // Button color schemes: 4 variants × 5 states
    public Dictionary<string, ButtonColorScheme> ButtonColors { get; set; }
    
    // Per-severity notification colors
    public Dictionary<string, string> NotificationBackgroundColor { get; set; }
    public Dictionary<string, string> NotificationIconColor { get; set; }
    
    // Category grid colors
    public List<string> CategoryColors { get; set; }
    
    // Links and accents
    public string HyperlinkColor { get; set; }
    public string TabSelectedColor { get; set; }
}

public class ButtonColorScheme
{
    public string Default { get; set; }
    public string Hover { get; set; }
    public string Active { get; set; }
    public string Disabled { get; set; }
    public string Focus { get; set; }
}

/// <summary>Channel-specific display colors.</summary>
public static class ChannelColors
{
    public const string Voice = "#a0a8bd";
    public const string Web = "#737373";
    public const string Facebook = "#4267B2";
    public const string Sms = "#A8C2FC";
    public const string WhatsApp = "#25D366";
    public const string Telegram = "#1DA1F2";
    public const string Instagram = "#833AB4";
    public const string Line = "#00C300";
}
```

---

## 40. Contact Tag & Formatter Types

```csharp
/// <summary>Tag derived from categories for display.</summary>
public class ContactTag
{
    public string Label { get; set; }
    public string Color { get; set; }
    public string FullyQualifiedName { get; set; }  // "category > subcategory"
}

/// <summary>Formatter utilities — define output contracts.</summary>
public static class Formatters
{
    // formatDuration(seconds) → "HH:MM:SS" or "MM:SS"
    // formatName(rawJson) → "FirstName LastName" from childInformation or callerInformation
    // formatAddress(rawJson) → concatenated address fields
    // getContactTags(categories, definitionVersion) → List<ContactTag>
    // formatCategories(categories) → Display string
    // formatStringToDateAndTime(str) → Localized date+time
    // formatFileNameAtAws(key) → Decoded S3 key to friendly filename
}
```

---

## 41. Custom Sidebar Link Types

```csharp
/// <summary>Custom sidebar link configuration.</summary>
public class CustomSideLinkProps
{
    public string Url { get; set; }
    public string LinkType { get; set; }  // "new-window" | "embedded"
    public string IconKey { get; set; }   // "info" → InfoIcon, "map" → MapIcon
    public string LabelKey { get; set; }  // Translation key
}
// "new-window": Opens ConfirmDialog, then window.open(url, '_blank')
// "embedded": Navigates to embedded iframe within the agent desktop
```

---

## 42. HangUpBy State Manager Types

```csharp
/// <summary>Persists HangUpBy state in localStorage per Flex instance.</summary>
public class HangUpByStateManager
{
    // Storage key: "hang_up_by_{flex_service_instance_sid}"
    // Value: JSON Record<TaskSID, HangUpBy>
    public string GetForTask(string taskSid) { /* read from storage */ }
    public void SetForTask(string taskSid, string hangUpBy) { /* write to storage */ }
}
```

---

## 43. Queues Status Types

```csharp
/// <summary>Per-queue task counts by channel.</summary>
public class QueueEntry
{
    public int Facebook { get; set; }
    public int Sms { get; set; }
    public int Voice { get; set; }
    public int Web { get; set; }
    public int WhatsApp { get; set; }
    public int Telegram { get; set; }
    public int Instagram { get; set; }
    public int Line { get; set; }
    public DateTime? LongestWaitingDate { get; set; }
    public bool IsChatPending { get; set; }
}

public class QueuesStatus : Dictionary<string, QueueEntry> { }
```

---

## 44. Prepopulate Mapping Types

```csharp
/// <summary>Legacy: simple key mapping from pre-engagement to form fields.</summary>
public class PrepopulateKeys
{
    public Dictionary<string, string> Mappings { get; set; }
}

/// <summary>New: 2D array with AND/OR logic for complex mappings.</summary>
public class PrepopulateMappings
{
    // Outer array = OR conditions (any row match → populate)
    // Inner array = AND conditions (all columns must match)
    public List<List<PrepopulateMappingEntry>> Mappings { get; set; }
}

public class PrepopulateMappingEntry
{
    public string Source { get; set; }       // Pre-engagement data field path
    public string Target { get; set; }       // Form field path (tab.field)
    public string Transform { get; set; }    // Optional: "checkbox" → yes/no to boolean
}
// Feature flag: use_prepopulate_mappings → false=legacy, true=new 2D logic
```

---

## 45. Case Merging Banner Types

```csharp
public class CaseMergingBannersState
{
    public Dictionary<string, BannerState> Banners { get; set; }
}

// Banner types: AddToCaseBanner, ContactAddedToCaseBanner,
// ContactRemovedFromCaseBanner, CaseCreatedBanner
// All respect permission checks (addContactToCase, removeContactFromCase)
```

---

## 46. Channel Number Extraction Rules

```csharp
/// <summary>Per-channel rules for extracting contact identifiers from task attributes.</summary>
public static class ChannelNumberExtraction
{
    // Voice/SMS: remove spaces and hyphens → "+1234567890"
    // WhatsApp: remove "whatsapp:" prefix → "+1234567890"
    // Facebook: remove "messenger:" prefix → numeric user ID
    // Telegram: format as "@{handle}"
    // Web: extract from preEngagementData.contactIdentifier
    // LINE: extract from task attributes directly
    // Instagram: extract from task attributes directly
}
```
