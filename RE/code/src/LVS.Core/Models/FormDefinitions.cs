using System.Text.Json.Serialization;

namespace LVS.Core.Models;

public class FormItemDefinition
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("label")]
    public string? Label { get; set; }

    [JsonPropertyName("type")]
    public FormInputType Type { get; set; }

    [JsonPropertyName("description")]
    public FormItemDescription? Description { get; set; }

    [JsonPropertyName("placeholder")]
    public string? Placeholder { get; set; }

    [JsonPropertyName("metadata")]
    public Dictionary<string, object?>? Metadata { get; set; }

    [JsonPropertyName("isPII")]
    public bool? IsPII { get; set; }

    [JsonPropertyName("required")]
    public ValidationRule? Required { get; set; }

    [JsonPropertyName("min")]
    public NumericValidationRule? Min { get; set; }

    [JsonPropertyName("max")]
    public NumericValidationRule? Max { get; set; }

    [JsonPropertyName("minLength")]
    public NumericValidationRule? MinLength { get; set; }

    [JsonPropertyName("maxLength")]
    public NumericValidationRule? MaxLength { get; set; }

    [JsonPropertyName("options")]
    public List<SelectOption>? Options { get; set; }

    [JsonPropertyName("defaultValue")]
    public string? DefaultValue { get; set; }

    [JsonPropertyName("dependentOptions")]
    public Dictionary<string, List<SelectOption>>? DependentOptions { get; set; }

    [JsonPropertyName("initialChecked")]
    public string? InitialChecked { get; set; }
}

public class FormItemDescription
{
    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("content")]
    public string? Content { get; set; }
}

public class ValidationRule
{
    [JsonPropertyName("value")]
    public bool Value { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }
}

public class NumericValidationRule
{
    [JsonPropertyName("value")]
    public int Value { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }
}

public class SelectOption
{
    [JsonPropertyName("value")]
    public string Value { get; set; } = string.Empty;

    [JsonPropertyName("label")]
    public string Label { get; set; } = string.Empty;
}
