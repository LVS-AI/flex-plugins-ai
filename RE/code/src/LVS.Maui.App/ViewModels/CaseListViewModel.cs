using LVS.Core.Models;
using LVS.Core.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace LVS.Maui.App.ViewModels;

public partial class CaseListViewModel : ObservableObject
{
    private readonly ICaseService _caseService;

    public CaseListViewModel(ICaseService caseService)
    {
        _caseService = caseService;
    }

    [ObservableProperty]
    private List<Case> _cases = [];

    [ObservableProperty]
    private int _totalCount;

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private string? _errorMessage;

    [ObservableProperty]
    private int _currentPage;

    [ObservableProperty]
    private int _pageSize = 20;

    // Filter values
    [ObservableProperty]
    private string? _filterCounselor;

    [ObservableProperty]
    private string? _filterStatus;

    [ObservableProperty]
    private ListCasesSortBy _sortBy = ListCasesSortBy.CREATED_AT;

    [ObservableProperty]
    private SortDirection _sortDirection = SortDirection.DESC;

    [RelayCommand]
    private async Task LoadCasesAsync()
    {
        try
        {
            IsLoading = true;
            ErrorMessage = null;

            var filters = new ListCasesFilters
            {
                Counsellors = string.IsNullOrEmpty(FilterCounselor) ? null : [FilterCounselor],
                Statuses = string.IsNullOrEmpty(FilterStatus) ? null : [FilterStatus]
            };

            var sort = new ListCasesSort
            {
                SortBy = SortBy,
                SortDirection = SortDirection
            };

            var result = await _caseService.SearchCasesAsync(
                filters, sort, PageSize, CurrentPage * PageSize);

            Cases = result.Cases;
            TotalCount = result.Count;
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
    private async Task NextPageAsync()
    {
        if ((CurrentPage + 1) * PageSize < TotalCount)
        {
            CurrentPage++;
            await LoadCasesAsync();
        }
    }

    [RelayCommand]
    private async Task PreviousPageAsync()
    {
        if (CurrentPage > 0)
        {
            CurrentPage--;
            await LoadCasesAsync();
        }
    }

    [RelayCommand]
    private async Task NavigateToCaseAsync(string caseId)
    {
        await Shell.Current.GoToAsync($"CaseHome?caseId={caseId}");
    }
}
