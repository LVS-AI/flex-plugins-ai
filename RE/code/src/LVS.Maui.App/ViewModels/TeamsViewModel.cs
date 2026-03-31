using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace LVS.Maui.App.ViewModels;

public partial class TeamsViewModel : ObservableObject
{
    [ObservableProperty]
    private List<AgentInfo> _agents = [];

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private string? _errorMessage;

    [ObservableProperty]
    private string? _skillFilter;

    [ObservableProperty]
    private string? _statusFilter;

    [RelayCommand]
    private Task LoadAgentsAsync()
    {
        // TODO: Implement via ServerlessService.PopulateCounselorsAsync()
        // and TaskRouter worker status queries
        return Task.CompletedTask;
    }
}

public class AgentInfo
{
    public string Sid { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = [];
    public int ActiveTasks { get; set; }
    public string SkillsSummary => Skills.Count > 0 ? string.Join(", ", Skills) : "None";
}
