using LVS.Core.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace LVS.Maui.App.ViewModels;

public partial class LoginViewModel : ObservableObject
{
    private readonly IAuthService _authService;

    public LoginViewModel(IAuthService authService)
    {
        _authService = authService;
    }

    [ObservableProperty]
    private string? _token;

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private string? _errorMessage;

    [ObservableProperty]
    private bool _isAuthenticated;

    [RelayCommand]
    private async Task LoginAsync()
    {
        try
        {
            IsLoading = true;
            ErrorMessage = null;

            // TODO: Replace with actual Okta/Twilio auth flow
            if (!string.IsNullOrEmpty(Token) && _authService is AuthService auth)
            {
                auth.SetToken(Token);
            }

            IsAuthenticated = await _authService.IsAuthenticatedAsync();

            if (IsAuthenticated)
            {
                await Shell.Current.GoToAsync("//ContactForm");
            }
            else
            {
                ErrorMessage = "Authentication failed. Please check your token.";
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
    private async Task LogoutAsync()
    {
        await _authService.LogoutAsync();
        IsAuthenticated = false;
        Token = null;
    }

    [RelayCommand]
    private async Task CheckAuthAsync()
    {
        IsAuthenticated = await _authService.IsAuthenticatedAsync();
    }
}
