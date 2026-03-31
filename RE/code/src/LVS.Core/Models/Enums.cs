namespace LVS.Core.Models;

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

public enum DateExistsCondition
{
    MUST_EXIST,
    MUST_NOT_EXIST
}

public enum ReferralLookupStatus
{
    NotStarted,
    Pending,
    Found,
    NotFound
}

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
