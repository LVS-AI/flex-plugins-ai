using LVS.Core.Models;

namespace LVS.Core.Services;

public class ProfileService : IProfileService
{
    private readonly HrmApiClient _api;

    public ProfileService(HrmApiClient api) => _api = api;

    public async Task<Profile> GetProfileAsync(int profileId)
        => await _api.GetAsync<Profile>($"profiles/{profileId}")
           ?? throw new InvalidOperationException($"Profile {profileId} not found.");

    public async Task<(int Count, List<Profile> Profiles)> ListProfilesAsync(
        ProfilesListSort? sort = null,
        ProfilesListFilters? filters = null,
        List<int>? profileFlagIds = null,
        int limit = 20,
        int offset = 0)
    {
        var query = $"profiles?limit={limit}&offset={offset}";
        if (sort is not null)
            query += $"&sortBy={sort.SortBy}&sortDirection={sort.SortDirection}";
        var result = await _api.GetAsync<ProfileListResult>(query);
        return (result?.Count ?? 0, result?.Profiles ?? []);
    }

    public async Task<(int Count, List<Contact> Contacts)> GetProfileContactsAsync(int profileId, int limit = 20, int offset = 0)
    {
        var result = await _api.GetAsync<ProfileContactsResult>($"profiles/{profileId}/contacts?limit={limit}&offset={offset}");
        return (result?.Count ?? 0, result?.Contacts ?? []);
    }

    public async Task<(int Count, List<Case> Cases)> GetProfileCasesAsync(int profileId, int limit = 20, int offset = 0)
    {
        var result = await _api.GetAsync<ProfileCasesResult>($"profiles/{profileId}/cases?limit={limit}&offset={offset}");
        return (result?.Count ?? 0, result?.Cases ?? []);
    }

    public async Task<ProfileSection> CreateProfileSectionAsync(int profileId, string sectionType, string content)
        => await _api.PostAsync<ProfileSection>($"profiles/{profileId}/sections", new { sectionType, content })
           ?? throw new InvalidOperationException("Failed to create profile section.");

    public async Task<ProfileSection> UpdateProfileSectionAsync(int profileId, int sectionId, string content)
        => await _api.PutAsync<ProfileSection>($"profiles/{profileId}/sections/{sectionId}", new { content })
           ?? throw new InvalidOperationException("Failed to update profile section.");

    public async Task<ProfileFlagAssociation> AddProfileFlagAsync(int profileId, int flagId, DateTime? validUntil = null)
        => await _api.PostAsync<ProfileFlagAssociation>($"profiles/{profileId}/flags", new { flagId, validUntil })
           ?? throw new InvalidOperationException("Failed to add profile flag.");

    public async Task RemoveProfileFlagAsync(int profileId, int flagId)
        => await _api.DeleteAsync($"profiles/{profileId}/flags/{flagId}");

    public async Task<Identifier> GetIdentifierAsync(int identifierId)
        => await _api.GetAsync<Identifier>($"profiles/identifiers/{identifierId}")
           ?? throw new InvalidOperationException($"Identifier {identifierId} not found.");

    public async Task<List<ProfileFlag>> ListProfileFlagsAsync()
        => await _api.GetAsync<List<ProfileFlag>>("profiles/flags") ?? [];

    // Internal result DTOs for deserialization
    private class ProfileListResult
    {
        public int Count { get; set; }
        public List<Profile> Profiles { get; set; } = [];
    }

    private class ProfileContactsResult
    {
        public int Count { get; set; }
        public List<Contact> Contacts { get; set; } = [];
    }

    private class ProfileCasesResult
    {
        public int Count { get; set; }
        public List<Case> Cases { get; set; } = [];
    }
}
