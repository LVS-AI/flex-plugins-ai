using LVS.Maui.App.ViewModels;

namespace LVS.Maui.App.Views;

public partial class SearchPage : ContentPage
{
    public SearchPage(SearchViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    private void OnShowContactsClicked(object? sender, EventArgs e)
    {
        if (BindingContext is SearchViewModel vm)
            vm.ShowContactResults = true;
    }

    private void OnShowCasesClicked(object? sender, EventArgs e)
    {
        if (BindingContext is SearchViewModel vm)
            vm.ShowContactResults = false;
    }
}
