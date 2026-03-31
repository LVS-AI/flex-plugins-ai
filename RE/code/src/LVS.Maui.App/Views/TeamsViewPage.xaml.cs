using LVS.Maui.App.ViewModels;

namespace LVS.Maui.App.Views;

public partial class TeamsViewPage : ContentPage
{
    public TeamsViewPage(TeamsViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is TeamsViewModel vm)
        {
            await vm.LoadAgentsCommand.ExecuteAsync(null);
        }
    }
}
