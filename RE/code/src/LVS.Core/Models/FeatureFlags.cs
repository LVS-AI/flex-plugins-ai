namespace LVS.Core.Models;

public class FeatureFlags
{
    public bool EnableCsamReport { get; set; }
    public bool EnableCsamClcReport { get; set; }
    public bool EnableCannedResponses { get; set; }
    public bool EnableEmojiPicker { get; set; }
    public bool EnableDualWrite { get; set; }
    public bool EnableExternalTranscripts { get; set; }
    public bool EnableTwilioTranscripts { get; set; }
    public bool EnableVoiceRecordings { get; set; }
    public bool EnableFullstoryMonitoring { get; set; }
    public bool EnableLanguageSelector { get; set; }
    public bool EnableSaveInsights { get; set; }
    public bool EnablePostSurvey { get; set; }
    public bool EnablePreviousContacts { get; set; }
    public bool EnableSwitchboarding { get; set; }
    public bool EnableSwitchboardingMoveTasks { get; set; }
    public bool EnableManualPulling { get; set; }
    public bool EnableSelectAgentsTeamsView { get; set; }
    public bool EnableAssignedSkillTeamsViewFilters { get; set; }
    public bool EnableCustomLinks { get; set; }
    public bool EnableConferenceStatusEventHandler { get; set; }
    public bool EnableConfirmOnBrowserClose { get; set; }
    public bool EnableLastCaseStatusUpdateInfo { get; set; }
    public bool EnableLlmSummary { get; set; }
    public bool EnableRegionResourceSearch { get; set; }
    public bool EnableResourcesUpdates { get; set; }
    public bool UsePrepopulateMappings { get; set; }
    public bool UseTwilioLambdaForConferenceFunctions { get; set; }
    public bool UseTwilioLambdaForConversationDuration { get; set; }
    public bool UseTwilioLambdaForIwfReporting { get; set; }
    public bool UseTwilioLambdaForOfflineContactTasks { get; set; }
    public bool UseTwilioLambdaForRecordingsLookup { get; set; }
    public bool UseTwilioLambdaForWorkerEndpoints { get; set; }
    public bool UseTwilioLambdaToIssueSyncToken { get; set; }
    public bool UseTwilioLambdaToSendMessages { get; set; }
    public bool UseTwilioLambdaToTransitionParticipants { get; set; }
    public bool UseTwilioLambdaTransfers { get; set; }
}
