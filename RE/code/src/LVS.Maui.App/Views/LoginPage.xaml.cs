using LVS.Maui.App.ViewModels;

namespace LVS.Maui.App.Views;

public partial class LoginPage : ContentPage
{
    public LoginPage(LoginViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is LoginViewModel vm)
        {
            await vm.CheckAuthCommand.ExecuteAsync(null);
            if (vm.IsAuthenticated)
            {
                await Shell.Current.GoToAsync("//ContactForm");
            }
        }
    }
}
