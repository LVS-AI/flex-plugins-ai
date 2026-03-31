using LVS.Core.Models;
using LVS.Core.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace LVS.Maui.App.ViewModels;

public partial class ContactFormViewModel : ObservableObject
{
    private readonly IContactService _contactService;
    private readonly ICaseService _caseService;
    private readonly IFormDefinitionService _definitionService;

    public ContactFormViewModel(
        IContactService contactService,
        ICaseService caseService,
        IFormDefinitionService definitionService)
    {
        _contactService = contactService;
        _caseService = caseService;
        _definitionService = definitionService;
    }

    [ObservableProperty]
    private Contact? _contact;

    [ObservableProperty]
    private DefinitionVersion? _definition;

    [ObservableProperty]
    private string? _selectedCallType;

    [ObservableProperty]
    private int _selectedTabIndex;

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private string? _errorMessage;

    [ObservableProperty]
    private Dictionary<string, object?> _callerInfo = new();

    [ObservableProperty]
    private Dictionary<string, object?> _childInfo = new();

    [ObservableProperty]
    private Dictionary<string, object?> _caseInfo = new();

    [ObservableProperty]
    private Dictionary<string, List<string>> _selectedCategories = new();

    public bool IsDataCallType =>
        SelectedCallType == CallTypes.Child || SelectedCallType == CallTypes.Caller;

    [RelayCommand]
    private async Task LoadDefinitionAsync(string version)
    {
        try
        {
            IsLoading = true;
            ErrorMessage = null;
            Definition = await _definitionService.GetDefinitionAsync("default", version);
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private void SelectCallType(string callType)
    {
        SelectedCallType = callType;
        OnPropertyChanged(nameof(IsDataCallType));
    }

    [RelayCommand]
    private async Task SaveContactAsync()
    {
        if (Contact is null) return;

        try
        {
            IsLoading = true;
            ErrorMessage = null;

            Contact.RawJson = new ContactRawJson
            {
                CallType = SelectedCallType,
                CallerInformation = CallerInfo,
                ChildInformation = ChildInfo,
                CaseInformation = CaseInfo,
                Categories = SelectedCategories,
                DefinitionVersion = Definition?.CaseStatus.Keys.FirstOrDefault()
            };

            if (string.IsNullOrEmpty(Contact.Id))
            {
                Contact = await _contactService.CreateContactAsync(Contact);
            }
            else
            {
                Contact = await _contactService.UpdateContactAsync(Contact.Id, Contact, finalize: false);
            }
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private async Task FinalizeContactAsync()
    {
        if (Contact is null || string.IsNullOrEmpty(Contact.Id)) return;

        try
        {
            IsLoading = true;
            ErrorMessage = null;
            Contact = await _contactService.UpdateContactAsync(Contact.Id, Contact, finalize: true);
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private async Task CreateCaseAsync()
    {
        if (Contact is null) return;

        try
        {
            IsLoading = true;
            ErrorMessage = null;

            var newCase = new Case
            {
                Status = "open",
                Helpline = Contact.Helpline,
                TwilioWorkerId = Contact.TwilioWorkerId,
                Info = new CaseInfo()
            };

            var createdCase = await _caseService.CreateCaseAsync(newCase);

            if (!string.IsNullOrEmpty(Contact.Id))
            {
                Contact = await _contactService.ConnectToCaseAsync(Contact.Id, createdCase.Id);
            }
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
        finally
        {
            IsLoading = false;
        }
    }

    public void UpdateFormField(string tab, string fieldName, object? value)
    {
        switch (tab)
        {
            case "caller":
                CallerInfo[fieldName] = value;
                break;
            case "child":
                ChildInfo[fieldName] = value;
                break;
            case "case":
                CaseInfo[fieldName] = value;
                break;
        }
    }

    public void ToggleCategory(string category, string subcategory)
    {
        if (!SelectedCategories.TryGetValue(category, out var subs))
        {
            subs = [];
            SelectedCategories[category] = subs;
        }

        if (subs.Contains(subcategory))
            subs.Remove(subcategory);
        else
            subs.Add(subcategory);

        OnPropertyChanged(nameof(SelectedCategories));
    }
}
