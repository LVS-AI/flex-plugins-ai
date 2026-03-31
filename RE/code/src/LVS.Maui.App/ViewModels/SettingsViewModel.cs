using LVS.Core.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace LVS.Maui.App.ViewModels;

public partial class SettingsViewModel : ObservableObject
{
    private readonly ILocalizationService _localization;

    public SettingsViewModel(ILocalizationService localization)
    {
        _localization = localization;
    }

    [ObservableProperty]
    private string _selectedLocale = "en";

    public IReadOnlyList<string> AvailableLocales => _localization.AvailableLocales;

    partial void OnSelectedLocaleChanged(string value)
    {
        _ = _localization.SetLocaleAsync(value);
    }

    [RelayCommand]
    private async Task ChangeLanguageAsync(string locale)
    {
        await _localization.SetLocaleAsync(locale);
        SelectedLocale = locale;
    }
}
