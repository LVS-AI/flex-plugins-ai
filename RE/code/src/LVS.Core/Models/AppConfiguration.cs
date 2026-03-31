namespace LVS.Core.Models;

public class AppConfiguration
{
    public string HrmBaseUrl { get; set; } = string.Empty;
    public string ServerlessBaseUrl { get; set; } = string.Empty;
    public string ResourcesBaseUrl { get; set; } = string.Empty;
    public string LambdaBaseUrl { get; set; } = string.Empty;
    public string AssistantBaseUrl { get; set; } = string.Empty;
    public string AccountSid { get; set; } = string.Empty;
    public string HelplineCode { get; set; } = string.Empty;
    public string WorkerSid { get; set; } = string.Empty;
    public FeatureFlags FeatureFlags { get; set; } = new();
}

public class WorkerInfo
{
    public string Sid { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public int ChatChannelCapacity { get; set; }
    public bool IsSupervisor { get; set; }
    public List<string> Roles { get; set; } = [];
}

public class CounselorEntry
{
    public string Sid { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
}
