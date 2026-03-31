using LVS.Core.Models;

namespace LVS.Core.Services;

public interface IContactService
{
    Task<Contact> CreateContactAsync(Contact contact);
    Task<Contact> UpdateContactAsync(string contactId, Contact contact, bool finalize = false);
    Task<Contact> GetContactAsync(string contactId);
    Task<Contact?> GetContactByTaskSidAsync(string taskSid);
    Task<Contact> ConnectToCaseAsync(string contactId, string caseId);
    Task<Contact> DisconnectFromCaseAsync(string contactId);
    Task<SearchContactResult> SearchContactsAsync(SearchFormValues searchParams, int limit = 20, int offset = 0);
    Task<Contact> AddConversationMediaAsync(string contactId, List<ConversationMedia> media);
}
