using LVS.Core.Models;
using LVS.Core.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace LVS.Maui.App.ViewModels;

public partial class SearchViewModel : ObservableObject
{
    private readonly IContactService _contactService;
    private readonly ICaseService _caseService;

    public SearchViewModel(IContactService contactService, ICaseService caseService)
    {
        _contactService = contactService;
        _caseService = caseService;
    }

    // Search form fields
    [ObservableProperty]
    private string? _firstName;

    [ObservableProperty]
    private string? _lastName;

    [ObservableProperty]
    private string? _phoneNumber;

    [ObservableProperty]
    private string? _counselor;

    [ObservableProperty]
    private string? _dateFrom;

    [ObservableProperty]
    private string? _dateTo;

    [ObservableProperty]
    private string? _contactNumber;

    [ObservableProperty]
    private bool _onlyDataContacts;

    // Results
    [ObservableProperty]
    private List<Contact> _contactResults = [];

    [ObservableProperty]
    private int _contactResultCount;

    [ObservableProperty]
    private List<Case> _caseResults = [];

    [ObservableProperty]
    private int _caseResultCount;

    [ObservableProperty]
    private bool _isSearchingContacts;

    [ObservableProperty]
    private bool _isSearchingCases;

    [ObservableProperty]
    private string? _errorMessage;

    [ObservableProperty]
    private bool _showContactResults = true;

    private SearchFormValues BuildSearchValues() => new()
    {
        FirstName = FirstName,
        LastName = LastName,
        PhoneNumber = PhoneNumber,
        Counselor = Counselor,
        DateFrom = DateFrom,
        DateTo = DateTo,
        ContactNumber = ContactNumber,
        OnlyDataContacts = OnlyDataContacts
    };

    [RelayCommand]
    private async Task SearchAsync()
    {
        ErrorMessage = null;
        await Task.WhenAll(SearchContactsAsync(), SearchCasesAsync());
    }

    [RelayCommand]
    private async Task SearchContactsAsync()
    {
        try
        {
            IsSearchingContacts = true;
            var result = await _contactService.SearchContactsAsync(BuildSearchValues());
            ContactResults = result.Contacts;
            ContactResultCount = result.Count;
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
        finally
        {
            IsSearchingContacts = false;
        }
    }

    [RelayCommand]
    private async Task SearchCasesAsync()
    {
        try
        {
            IsSearchingCases = true;
            var filters = new ListCasesFilters
            {
                Counsellors = string.IsNullOrEmpty(Counselor) ? null : [Counselor]
            };
            var result = await _caseService.SearchCasesAsync(filters, null);
            CaseResults = result.Cases;
            CaseResultCount = result.Count;
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
        finally
        {
            IsSearchingCases = false;
        }
    }

    [RelayCommand]
    private void ToggleResultsView()
    {
        ShowContactResults = !ShowContactResults;
    }

    [RelayCommand]
    private void ClearSearch()
    {
        FirstName = null;
        LastName = null;
        PhoneNumber = null;
        Counselor = null;
        DateFrom = null;
        DateTo = null;
        ContactNumber = null;
        OnlyDataContacts = false;
        ContactResults = [];
        CaseResults = [];
        ContactResultCount = 0;
        CaseResultCount = 0;
    }
}
