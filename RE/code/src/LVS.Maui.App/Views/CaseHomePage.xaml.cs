using LVS.Maui.App.ViewModels;

namespace LVS.Maui.App.Views;

[QueryProperty(nameof(CaseId), "caseId")]
public partial class CaseHomePage : ContentPage
{
    private readonly CaseViewModel _viewModel;

    public CaseHomePage(CaseViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        BindingContext = viewModel;
    }

    public string? CaseId { get; set; }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        if (!string.IsNullOrEmpty(CaseId))
        {
            await _viewModel.LoadCaseCommand.ExecuteAsync(CaseId);
        }
    }
}
