using System.Text.Json.Serialization;

namespace LVS.Core.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
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

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ListCasesSortBy
{
    ID,
    CREATED_AT,
    UPDATED_AT,
    LABEL,
    FOLLOW_UP_DATE
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SortDirection
{
    ASC,
    DESC
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum DateExistsCondition
{
    MUST_EXIST,
    MUST_NOT_EXIST
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ReferralLookupStatus
{
    NotStarted,
    Pending,
    Found,
    NotFound
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ProfilesListSortBy
{
    ID,
    NAME
}

public enum OperatingStatus
{
    Open,
    Closed,
    Holiday
}

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
