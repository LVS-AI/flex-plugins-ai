using LVS.Core.Models;
using LVS.Core.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace LVS.Maui.App.ViewModels;

public partial class ProfileViewModel : ObservableObject
{
    private readonly IProfileService _profileService;

    public ProfileViewModel(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [ObservableProperty]
    private Profile? _currentProfile;

    [ObservableProperty]
    private List<Profile> _profilesList = [];

    [ObservableProperty]
    private int _profilesCount;

    [ObservableProperty]
    private List<Contact> _profileContacts = [];

    [ObservableProperty]
    private List<Case> _profileCases = [];

    [ObservableProperty]
    private List<ProfileFlag> _availableFlags = [];

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private string? _errorMessage;

    [ObservableProperty]
    private int _selectedTabIndex;

    [RelayCommand]
    private async Task LoadProfileAsync(int profileId)
    {
        try
        {
            IsLoading = true;
            ErrorMessage = null;
            CurrentProfile = await _profileService.GetProfileAsync(profileId);
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
    private async Task LoadProfilesListAsync()
    {
        try
        {
            IsLoading = true;
            ErrorMessage = null;
            var (count, profiles) = await _profileService.ListProfilesAsync();
            ProfilesList = profiles;
            ProfilesCount = count;
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
    private async Task LoadProfileContactsAsync(int profileId)
    {
        try
        {
            var (_, contacts) = await _profileService.GetProfileContactsAsync(profileId);
            ProfileContacts = contacts;
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
    }

    [RelayCommand]
    private async Task LoadProfileCasesAsync(int profileId)
    {
        try
        {
            var (_, cases) = await _profileService.GetProfileCasesAsync(profileId);
            ProfileCases = cases;
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
    }

    [RelayCommand]
    private async Task AddFlagAsync((int ProfileId, int FlagId) args)
    {
        try
        {
            await _profileService.AddProfileFlagAsync(args.ProfileId, args.FlagId);
            await LoadProfileAsync(args.ProfileId);
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
    }

    [RelayCommand]
    private async Task RemoveFlagAsync((int ProfileId, int FlagId) args)
    {
        try
        {
            await _profileService.RemoveProfileFlagAsync(args.ProfileId, args.FlagId);
            await LoadProfileAsync(args.ProfileId);
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
    }
}
