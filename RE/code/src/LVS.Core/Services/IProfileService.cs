using LVS.Core.Models;

namespace LVS.Core.Services;

public interface IProfileService
{
    Task<Profile> GetProfileAsync(int profileId);
    Task<(int Count, List<Profile> Profiles)> ListProfilesAsync(
        ProfilesListSort? sort = null,
        ProfilesListFilters? filters = null,
        List<int>? profileFlagIds = null,
        int limit = 20,
        int offset = 0);
    Task<(int Count, List<Contact> Contacts)> GetProfileContactsAsync(int profileId, int limit = 20, int offset = 0);
    Task<(int Count, List<Case> Cases)> GetProfileCasesAsync(int profileId, int limit = 20, int offset = 0);
    Task<ProfileSection> CreateProfileSectionAsync(int profileId, string sectionType, string content);
    Task<ProfileSection> UpdateProfileSectionAsync(int profileId, int sectionId, string content);
    Task<ProfileFlagAssociation> AddProfileFlagAsync(int profileId, int flagId, DateTime? validUntil = null);
    Task RemoveProfileFlagAsync(int profileId, int flagId);
    Task<Identifier> GetIdentifierAsync(int identifierId);
    Task<List<ProfileFlag>> ListProfileFlagsAsync();
}
