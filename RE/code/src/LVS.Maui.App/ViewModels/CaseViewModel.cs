using LVS.Core.Models;
using LVS.Core.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace LVS.Maui.App.ViewModels;

public partial class CaseViewModel : ObservableObject
{
    private readonly ICaseService _caseService;
    private readonly IContactService _contactService;

    public CaseViewModel(ICaseService caseService, IContactService contactService)
    {
        _caseService = caseService;
        _contactService = contactService;
    }

    [ObservableProperty]
    private Case? _currentCase;

    [ObservableProperty]
    private List<TimelineActivity> _timelineActivities = [];

    [ObservableProperty]
    private List<CaseSection> _sections = [];

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private string? _errorMessage;

    // Working copy fields
    [ObservableProperty]
    private string? _summary;

    [ObservableProperty]
    private DateTime? _followUpDate;

    [ObservableProperty]
    private bool _childIsAtRisk;

    [RelayCommand]
    private async Task LoadCaseAsync(string caseId)
    {
        try
        {
            IsLoading = true;
            ErrorMessage = null;

            CurrentCase = await _caseService.GetCaseAsync(caseId);
            Summary = CurrentCase.Info.Summary;
            FollowUpDate = CurrentCase.Info.FollowUpDate;
            ChildIsAtRisk = CurrentCase.Info.ChildIsAtRisk ?? false;

            await LoadTimelineAsync(caseId);
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
    private async Task LoadTimelineAsync(string caseId)
    {
        try
        {
            TimelineActivities = await _caseService.GetCaseTimelineAsync(caseId);
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
    }

    [RelayCommand]
    private async Task SaveOverviewAsync()
    {
        if (CurrentCase is null) return;

        try
        {
            IsLoading = true;
            ErrorMessage = null;

            var info = new CaseInfo
            {
                Summary = Summary,
                FollowUpDate = FollowUpDate,
                ChildIsAtRisk = ChildIsAtRisk
            };

            CurrentCase = await _caseService.UpdateCaseOverviewAsync(CurrentCase.Id, info);
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
    private async Task UpdateStatusAsync(string newStatus)
    {
        if (CurrentCase is null) return;

        try
        {
            IsLoading = true;
            ErrorMessage = null;
            CurrentCase = await _caseService.UpdateCaseStatusAsync(
                CurrentCase.Id, newStatus, CurrentCase.TwilioWorkerId);
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
    private async Task AddSectionAsync((string SectionType, CaseSection Section) args)
    {
        if (CurrentCase is null) return;

        try
        {
            IsLoading = true;
            ErrorMessage = null;
            var added = await _caseService.AddCaseSectionAsync(CurrentCase.Id, args.SectionType, args.Section);
            Sections = [.. Sections, added];
            await LoadTimelineAsync(CurrentCase.Id);
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
}
