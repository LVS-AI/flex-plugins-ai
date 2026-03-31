using LVS.Maui.App.ViewModels;

namespace LVS.Maui.App.Views;

public partial class CaseListPage : ContentPage
{
    public CaseListPage(CaseListViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is CaseListViewModel vm)
        {
            await vm.LoadCasesCommand.ExecuteAsync(null);
        }
    }
}
