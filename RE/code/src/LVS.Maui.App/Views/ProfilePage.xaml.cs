using LVS.Maui.App.ViewModels;

namespace LVS.Maui.App.Views;

public partial class ProfilePage : ContentPage
{
    public ProfilePage(ProfileViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is ProfileViewModel vm)
        {
            await vm.LoadProfilesListCommand.ExecuteAsync(null);
        }
    }

    private void OnBackClicked(object? sender, EventArgs e)
    {
        if (BindingContext is ProfileViewModel vm)
            vm.CurrentProfile = null;
    }

    private void OnProfileContactsClicked(object? sender, EventArgs e)
    {
        ProfileContactsList.IsVisible = true;
        ProfileCasesList.IsVisible = false;
        ProfileDetailsList.IsVisible = false;
    }

    private void OnProfileCasesClicked(object? sender, EventArgs e)
    {
        ProfileContactsList.IsVisible = false;
        ProfileCasesList.IsVisible = true;
        ProfileDetailsList.IsVisible = false;
    }

    private void OnProfileDetailsClicked(object? sender, EventArgs e)
    {
        ProfileContactsList.IsVisible = false;
        ProfileCasesList.IsVisible = false;
        ProfileDetailsList.IsVisible = true;
    }
}
