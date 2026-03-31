using System.Text.Json.Serialization;

namespace LVS.Core.Models;

public class Profile
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("definitionVersion")]
    public string? DefinitionVersion { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime? CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }

    [JsonPropertyName("identifiers")]
    public List<Identifier> Identifiers { get; set; } = [];

    [JsonPropertyName("profileFlags")]
    public List<ProfileFlagAssociation> ProfileFlags { get; set; } = [];

    [JsonPropertyName("profileSections")]
    public List<ProfileSection> ProfileSections { get; set; } = [];

    [JsonPropertyName("hasContacts")]
    public bool? HasContacts { get; set; }
}

public class Identifier
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("identifier")]
    public string IdentifierValue { get; set; } = string.Empty;

    [JsonPropertyName("accountSid")]
    public string? AccountSid { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime? CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }

    [JsonPropertyName("profiles")]
    public List<Profile>? Profiles { get; set; }
}

public class ProfileSection
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("sectionType")]
    public string SectionType { get; set; } = string.Empty;

    [JsonPropertyName("content")]
    public string? Content { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime? CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}

public class ProfileFlag
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("createdAt")]
    public DateTime? CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }

    [JsonPropertyName("validUntil")]
    public DateTime? ValidUntil { get; set; }
}

public class ProfileFlagAssociation
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("validUntil")]
    public DateTime? ValidUntil { get; set; }
}

public class ProfilesListSort
{
    [JsonPropertyName("sortBy")]
    public ProfilesListSortBy? SortBy { get; set; }

    [JsonPropertyName("sortDirection")]
    public SortDirection? SortDirection { get; set; }
}

public class ProfilesListFilters
{
    [JsonPropertyName("statuses")]
    public List<string>? Statuses { get; set; }
}
