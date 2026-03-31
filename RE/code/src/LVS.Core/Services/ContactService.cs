using LVS.Core.Models;

namespace LVS.Core.Services;

public class ContactService : IContactService
{
    private readonly HrmApiClient _api;

    public ContactService(HrmApiClient api)
    {
        _api = api;
    }

    public async Task<Contact> CreateContactAsync(Contact contact)
    {
        return await _api.PostAsync<Contact>("contacts", contact)
            ?? throw new InvalidOperationException("Failed to create contact");
    }

    public async Task<Contact> UpdateContactAsync(string contactId, Contact contact, bool finalize = false)
    {
        var query = finalize ? "?finalize=true" : "?finalize=false";
        return await _api.PatchAsync<Contact>($"contacts/{Uri.EscapeDataString(contactId)}{query}", contact)
            ?? throw new InvalidOperationException("Failed to update contact");
    }

    public async Task<Contact> GetContactAsync(string contactId)
    {
        return await _api.GetAsync<Contact>($"contacts/{Uri.EscapeDataString(contactId)}")
            ?? throw new InvalidOperationException("Contact not found");
    }

    public async Task<Contact?> GetContactByTaskSidAsync(string taskSid)
    {
        return await _api.GetAsync<Contact>($"contacts/byTaskSid/{Uri.EscapeDataString(taskSid)}");
    }

    public async Task<Contact> ConnectToCaseAsync(string contactId, string caseId)
    {
        return await _api.PatchAsync<Contact>(
            $"contacts/{Uri.EscapeDataString(contactId)}/connectToCase",
            new { caseId })
            ?? throw new InvalidOperationException("Failed to connect contact to case");
    }

    public async Task<Contact> DisconnectFromCaseAsync(string contactId)
    {
        await _api.DeleteAsync($"contacts/{Uri.EscapeDataString(contactId)}/connectToCase");
        return await GetContactAsync(contactId);
    }

    public async Task<SearchContactResult> SearchContactsAsync(SearchFormValues searchParams, int limit = 20, int offset = 0)
    {
        var body = new
        {
            firstName = searchParams.FirstName,
            lastName = searchParams.LastName,
            counselor = searchParams.Counselor,
            phoneNumber = searchParams.PhoneNumber,
            dateFrom = searchParams.DateFrom,
            dateTo = searchParams.DateTo,
            contactNumber = searchParams.ContactNumber,
            helpline = searchParams.Helpline,
            onlyDataContacts = searchParams.OnlyDataContacts,
            limit,
            offset
        };

        return await _api.PostAsync<SearchContactResult>("contacts/search", body)
            ?? new SearchContactResult();
    }

    public async Task<Contact> AddConversationMediaAsync(string contactId, List<ConversationMedia> media)
    {
        return await _api.PostAsync<Contact>(
            $"contacts/{Uri.EscapeDataString(contactId)}/conversationMedia",
            media)
            ?? throw new InvalidOperationException("Failed to add conversation media");
    }
}
