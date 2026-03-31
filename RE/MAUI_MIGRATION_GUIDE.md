# .NET MAUI Migration Guide

## Aselo Platform — Migration Strategy from React/Twilio Flex to .NET MAUI

**Source:** Reverse-engineered from `techmatters/flex-plugins`  
**Date:** 2026-03-30

---

## 1. Migration Overview

### What Changes

| Aspect | Current (React/Flex) | Target (MAUI) |
|--------|---------------------|---------------|
| **UI Framework** | React 17 + Material-UI + Emotion | .NET MAUI + Community Toolkit |
| **State Management** | Redux + redux-promise-middleware | CommunityToolkit.Mvvm (MVVM) |
| **Language** | TypeScript | C# |
| **Agent Desktop** | Twilio Flex Plugin system | Standalone native app |
| **Webchat Widget** | React SPA embedded in webpage | MAUI Blazor Hybrid or separate web app |
| **Build System** | Webpack / CRA | dotnet build / MSBuild |
| **Package Manager** | npm | NuGet |
| **Testing** | Jest + Playwright | xUnit + NUnit + MAUI Test |

### What Stays The Same

| Aspect | Details |
|--------|---------|
| **Lambda APIs** | All REST endpoints remain unchanged |
| **HRM API** | Backend API contracts are identical |
| **Data Models** | Same JSON schemas and data structures |
| **Twilio Platform** | TaskRouter, Conversations, Voice still used |
| **AWS Infrastructure** | S3, SSM, Lambda, ALB unchanged |
| **Social Channels** | Webhook handlers remain server-side |
| **Business Logic** | Permission rules, workflows, form definitions |

---

## 2. Architecture Mapping

### 2.1 React → MAUI Pattern Mapping

| React Pattern | MAUI Equivalent | Package |
|--------------|----------------|---------|
| React Component | `ContentView` / `ContentPage` | MAUI built-in |
| `useState` | `ObservableProperty` attribute | CommunityToolkit.Mvvm |
| `useEffect` | Property change handlers / `OnAppearing` | Built-in |
| `useContext` | Dependency Injection | `Microsoft.Extensions.DependencyInjection` |
| Redux Store | `ObservableObject` ViewModels + DI | CommunityToolkit.Mvvm |
| Redux Actions | `RelayCommand` / `AsyncRelayCommand` | CommunityToolkit.Mvvm |
| Redux Selectors | Computed properties / `WeakReferenceMessenger` | CommunityToolkit.Mvvm |
| Redux Middleware | `IMessenger` (pub/sub) | CommunityToolkit.Mvvm |
| React Router | `Shell` navigation | MAUI built-in |
| Emotion CSS | `Style` / `ResourceDictionary` / XAML | MAUI built-in |
| Material-UI | .NET MAUI Community Toolkit | NuGet |
| `fetch()` | `HttpClient` | System.Net.Http |
| localStorage | `SecureStorage` / `Preferences` | MAUI Essentials |
| react-hook-form | Data binding + `INotifyDataErrorInfo` | Built-in |

### 2.2 Suggested Project Structure

```
Aselo.Maui/
├── Aselo.Maui.sln
├── src/
│   ├── Aselo.Core/                     # Shared logic (no UI)
│   │   ├── Models/                     # Data models (from DATA_MODELS.md)
│   │   │   ├── Contact.cs
│   │   │   ├── Case.cs
│   │   │   ├── Profile.cs
│   │   │   ├── CaseSection.cs
│   │   │   ├── FormDefinitions.cs
│   │   │   └── ...
│   │   ├── Services/                   # API clients
│   │   │   ├── IContactService.cs
│   │   │   ├── ContactService.cs
│   │   │   ├── ICaseService.cs
│   │   │   ├── CaseService.cs
│   │   │   ├── IProfileService.cs
│   │   │   ├── IServerlessService.cs
│   │   │   ├── IResourceService.cs
│   │   │   └── ...
│   │   ├── Auth/                       # Authentication
│   │   │   ├── IAuthService.cs
│   │   │   ├── TwilioTokenService.cs
│   │   │   └── OktaAuthService.cs
│   │   ├── Permissions/                # Permission engine
│   │   │   ├── PermissionRules.cs
│   │   │   └── PermissionEvaluator.cs
│   │   ├── Configuration/              # Config management
│   │   │   ├── AppConfiguration.cs
│   │   │   ├── FeatureFlags.cs
│   │   │   └── DefinitionVersionLoader.cs
│   │   └── Twilio/                     # Twilio SDK wrappers
│   │       ├── ConversationsClient.cs
│   │       ├── TaskRouterClient.cs
│   │       └── SyncClient.cs
│   ├── Aselo.Maui.App/                # MAUI Application
│   │   ├── App.xaml / App.xaml.cs
│   │   ├── AppShell.xaml / AppShell.cs
│   │   ├── MauiProgram.cs             # DI registration
│   │   ├── Views/                      # XAML pages
│   │   │   ├── ContactForm/
│   │   │   │   ├── ContactFormPage.xaml
│   │   │   │   ├── CallerInfoTab.xaml
│   │   │   │   ├── ChildInfoTab.xaml
│   │   │   │   ├── CaseInfoTab.xaml
│   │   │   │   └── CategoriesTab.xaml
│   │   │   ├── Case/
│   │   │   │   ├── CaseHomePage.xaml
│   │   │   │   ├── CaseTimelinePage.xaml
│   │   │   │   ├── CaseSectionEditPage.xaml
│   │   │   │   └── CaseListPage.xaml
│   │   │   ├── Search/
│   │   │   │   ├── SearchPage.xaml
│   │   │   │   └── SearchResultsPage.xaml
│   │   │   ├── Profile/
│   │   │   │   ├── ProfilePage.xaml
│   │   │   │   └── ProfileEditPage.xaml
│   │   │   ├── Chat/
│   │   │   │   ├── ChatPage.xaml
│   │   │   │   └── MessageBubble.xaml
│   │   │   ├── Teams/
│   │   │   │   └── TeamsViewPage.xaml
│   │   │   └── Settings/
│   │   │       └── SettingsPage.xaml
│   │   ├── ViewModels/                 # MVVM ViewModels
│   │   │   ├── ContactFormViewModel.cs
│   │   │   ├── CaseViewModel.cs
│   │   │   ├── CaseListViewModel.cs
│   │   │   ├── SearchViewModel.cs
│   │   │   ├── ProfileViewModel.cs
│   │   │   ├── ChatViewModel.cs
│   │   │   ├── TeamsViewModel.cs
│   │   │   └── MainViewModel.cs
│   │   ├── Controls/                   # Reusable controls
│   │   │   ├── DynamicFormRenderer.cs  # Key: renders forms from JSON definitions
│   │   │   ├── CategoryGrid.cs
│   │   │   ├── TimelineView.cs
│   │   │   ├── StatusBadge.cs
│   │   │   └── NavigableHeader.cs
│   │   ├── Converters/                 # Value converters
│   │   ├── Resources/                  # Styles, colors, fonts
│   │   │   ├── Styles.xaml
│   │   │   ├── Colors.xaml
│   │   │   └── Themes/
│   │   └── Platforms/                  # Platform-specific code
│   │       ├── Android/
│   │       ├── iOS/
│   │       └── Windows/
│   └── Aselo.Webchat/                  # Webchat (see options below)
├── tests/
│   ├── Aselo.Core.Tests/
│   └── Aselo.Maui.Tests/
└── docs/
```

---

## 3. Key Implementation Guides

### 3.1 Dynamic Form Renderer (Critical Component)

The most important component to get right. Forms are defined by JSON schemas, not hardcoded.

```csharp
public class DynamicFormRenderer : ContentView
{
    public static readonly BindableProperty FormDefinitionProperty =
        BindableProperty.Create(nameof(FormDefinition), typeof(List<FormItemDefinition>), 
            typeof(DynamicFormRenderer), propertyChanged: OnFormDefinitionChanged);

    public static readonly BindableProperty FormDataProperty =
        BindableProperty.Create(nameof(FormData), typeof(Dictionary<string, object>), 
            typeof(DynamicFormRenderer));

    public List<FormItemDefinition> FormDefinition { get; set; }
    public Dictionary<string, object> FormData { get; set; }

    private static void OnFormDefinitionChanged(BindableObject bindable, object oldValue, object newValue)
    {
        var renderer = (DynamicFormRenderer)bindable;
        renderer.RenderForm();
    }

    private void RenderForm()
    {
        var layout = new VerticalStackLayout { Spacing = 8 };
        
        foreach (var field in FormDefinition)
        {
            var control = field.Type switch
            {
                FormInputType.Input => CreateTextInput(field),
                FormInputType.Textarea => CreateTextArea(field),
                FormInputType.Select => CreatePicker(field),
                FormInputType.RadioInput => CreateRadioGroup(field),
                FormInputType.Checkbox => CreateCheckbox(field),
                FormInputType.DateInput => CreateDatePicker(field),
                FormInputType.TimeInput => CreateTimePicker(field),
                FormInputType.NumericInput => CreateNumericInput(field),
                FormInputType.Email => CreateEmailInput(field),
                FormInputType.DependentSelect => CreateDependentPicker(field),
                FormInputType.ListboxMultiselect => CreateMultiSelect(field),
                FormInputType.FileUpload => CreateFilePicker(field),
                _ => CreateTextInput(field) // Fallback
            };
            
            layout.Children.Add(CreateFieldWrapper(field, control));
        }
        
        Content = layout;
    }
}
```

### 3.2 Per-Task Navigation (Critical Pattern)

Each active task needs its own navigation stack. When the agent switches tasks, the UI shows that task's navigation state.

```csharp
public class TaskNavigationService
{
    private readonly Dictionary<string, Stack<string>> _taskRoutes = new();
    private string _activeTaskId;

    public void SetActiveTask(string taskId)
    {
        _activeTaskId = taskId;
        if (!_taskRoutes.ContainsKey(taskId))
            _taskRoutes[taskId] = new Stack<string>();
        
        // Navigate to top of this task's route stack
        var currentRoute = _taskRoutes[taskId].Peek();
        Shell.Current.GoToAsync(currentRoute);
    }

    public async Task PushRoute(string route)
    {
        _taskRoutes[_activeTaskId].Push(route);
        await Shell.Current.GoToAsync(route);
    }

    public async Task PopRoute()
    {
        _taskRoutes[_activeTaskId].Pop();
        await Shell.Current.GoToAsync("..");
    }
}
```

### 3.3 API Service Layer

```csharp
public class HrmApiClient
{
    private readonly HttpClient _httpClient;
    private readonly IAuthService _authService;
    private readonly string _baseUrl;
    private readonly string _accountSid;

    public HrmApiClient(HttpClient httpClient, IAuthService authService, 
        IConfiguration config)
    {
        _httpClient = httpClient;
        _authService = authService;
        _baseUrl = config["HrmBaseUrl"];
        _accountSid = config["AccountSid"];
    }

    public async Task<T> GetAsync<T>(string path)
    {
        var token = await _authService.GetTokenAsync();
        _httpClient.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", token);
        
        var response = await _httpClient.GetAsync(
            $"{_baseUrl}/v0/accounts/{_accountSid}/{path}");
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<T>();
    }

    public async Task<T> PostAsync<T>(string path, object body)
    {
        var token = await _authService.GetTokenAsync();
        _httpClient.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", token);
        
        var response = await _httpClient.PostAsJsonAsync(
            $"{_baseUrl}/v0/accounts/{_accountSid}/{path}", body);
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<T>();
    }
}
```

### 3.4 Permission Evaluation Engine

```csharp
public class PermissionEvaluator
{
    private readonly PermissionRules _rules;
    private readonly string _currentWorkerSid;
    private readonly bool _isSupervisor;

    public bool CanPerform(string action, object target)
    {
        if (!_rules.Rules.TryGetValue(action, out var conditionSets))
            return false;

        // OR across condition sets, AND within each set
        return conditionSets.Any(conditionSet => 
            conditionSet.All(condition => EvaluateCondition(condition, target)));
    }

    private bool EvaluateCondition(PermissionCondition condition, object target)
    {
        return condition switch
        {
            EveryoneCondition => true,
            NobodyCondition => false,
            IsSupervisorCondition => _isSupervisor,
            IsOwnerCondition => IsOwner(target),
            CreatedHoursAgoCondition c => WithinHours(target, c.Hours),
            CreatedDaysAgoCondition c => WithinDays(target, c.Days),
            _ => false
        };
    }
}
```

### 3.5 Real-Time Chat Integration

```csharp
public class TwilioConversationService
{
    private ConversationsClient _client;
    private Conversation _activeConversation;

    public async Task InitializeAsync(string token)
    {
        _client = await ConversationsClient.CreateAsync(token);
        _client.MessageAdded += OnMessageReceived;
        _client.TypingStarted += OnTypingStarted;
    }

    public async Task JoinConversation(string conversationSid)
    {
        _activeConversation = await _client.GetConversationAsync(conversationSid);
        var messages = await _activeConversation.GetMessagesAsync();
        // Load messages into ViewModel
    }

    public async Task SendMessage(string body, Stream attachment = null)
    {
        var builder = _activeConversation.PrepareMessage().SetBody(body);
        if (attachment != null)
            builder.AddMedia(attachment);
        await builder.BuildAndSendAsync();
    }
}
```

### 3.6 Localization System

**Current:** Custom i18n with 3-tier override (base → locale → definition strings) + Handlebars templates.

```csharp
/// <summary>Replaces Handlebars.js template system used in layout definitions.</summary>
public class LocalizationService
{
    private readonly Dictionary<string, Dictionary<string, string>> _translations;
    private string _currentLocale;
    
    /// <summary>Resolve string with 3-tier fallback: definition custom → locale → base English.</summary>
    public string GetString(string key, DefinitionVersion definition = null)
    {
        // 1. Check definition-version custom strings
        if (definition?.CustomStrings?.TryGetValue(key, out var custom) == true)
            return custom;
        
        // 2. Check locale-specific
        if (_translations.TryGetValue(_currentLocale, out var localeStrings) 
            && localeStrings.TryGetValue(key, out var localized))
            return localized;
        
        // 3. Fallback to English
        if (_translations.TryGetValue("en", out var enStrings) 
            && enStrings.TryGetValue(key, out var english))
            return english;
        
        return key; // Return key as fallback
    }
    
    /// <summary>Process layout template codes (replaces Handlebars.js).</summary>
    public string ProcessTemplate(string templateCode, Dictionary<string, object> data)
    {
        // Replace {{fieldName}} with data values
        foreach (var kvp in data)
            templateCode = templateCode.Replace($"{{{{{kvp.Key}}}}}", kvp.Value?.ToString() ?? "");
        return templateCode;
    }
}
```

**For MAUI:** Use `Microsoft.Extensions.Localization` for base infrastructure, but layer the 3-tier definition override on top. Webchat supports 7 languages: en, es, fr, hu, mt, ru, ukr.

### 3.7 Notification System

**Current:** Flex notification system with audio (bell, ringtone).

```csharp
public class NotificationService
{
    private readonly IAudioPlayer _audioPlayer;
    private CancellationTokenSource _ringtoneLoop;
    
    /// <summary>New message notification — plays bell once.</summary>
    public async Task NotifyNewMessage()
    {
        await _audioPlayer.PlayAsync("bell.wav");
    }
    
    /// <summary>Reserved task notification — ringtone repeats every 3 seconds.</summary>
    public async Task NotifyReservedTask(CancellationToken cancellationToken)
    {
        _ringtoneLoop = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        while (!_ringtoneLoop.Token.IsCancellationRequested)
        {
            await _audioPlayer.PlayAsync("ringtone.wav");
            await Task.Delay(3000, _ringtoneLoop.Token);
        }
    }
    
    public void StopRingtone() => _ringtoneLoop?.Cancel();
}
```

### 3.8 Identifier Masking System

**Current:** Permission-based PII masking (VIEW_IDENTIFIERS permission).

```csharp
public class IdentifierMaskingService
{
    private readonly IPermissionService _permissions;
    
    public bool ShouldMask => !_permissions.HasPermission("VIEW_IDENTIFIERS");
    
    /// <summary>Mask phone numbers, emails, and other PII in display strings.</summary>
    public string MaskIfNeeded(string value)
    {
        if (!ShouldMask || string.IsNullOrEmpty(value)) return value;
        return "***";
    }
    
    /// <summary>Apply masking to channel identity (phone numbers etc).</summary>
    public string MaskChannelIdentity(string identity) => MaskIfNeeded(identity);
}
```

### 3.9 Contact Save Frequency Pattern

**Current:** Two modes configurable per helpline.

```csharp
public class ContactSaveService
{
    private readonly string _saveFrequency; // "onTabChange" or "onFinalSaveAndTransfer"
    
    /// <summary>Called when agent switches between form tabs.</summary>
    public async Task OnTabChanged(Contact contact)
    {
        if (_saveFrequency == "onTabChange")
            await SaveDraft(contact); // PATCH /contacts/{id}?finalize=false
    }
    
    /// <summary>Called on task wrapup/complete.</summary>
    public async Task OnFinalSave(Contact contact)
    {
        await Finalize(contact); // PATCH /contacts/{id}?finalize=true
    }
}
```

### 3.10 Garbage Collection Pattern

**Current:** Removes stale contacts/cases from Redux after task completion.

```csharp
public class StateGarbageCollector
{
    private const int StaleThresholdMinutes = 120;
    
    /// <summary>Run after each task completion. Remove contacts/cases older than 120 min with no active drafts.</summary>
    public void CollectStaleEntries(AppStateManager state)
    {
        var cutoff = DateTime.UtcNow.AddMinutes(-StaleThresholdMinutes);
        
        foreach (var contact in state.Contacts)
        {
            if (contact.LoadedAt < cutoff && !contact.HasActiveDraft)
                state.RemoveContact(contact.Id);
        }
        
        foreach (var caseEntry in state.Cases)
        {
            if (caseEntry.LoadedAt < cutoff && !caseEntry.HasActiveDraft)
                state.RemoveCase(caseEntry.Id);
        }
    }
}
```

### 3.11 Result Monad Pattern (C# Equivalent)

**Current (TypeScript):** `ErrorResult<TError>` / `OkResult<T>` with `unwrap()`.

```csharp
/// <summary>C# equivalent of the Lambda Result monad pattern.</summary>
public abstract class Result<TError, TData>
{
    public abstract bool IsOk { get; }
    public abstract TData Unwrap(); // Throws if error
}

public class OkResult<TError, TData> : Result<TError, TData>
{
    public TData Data { get; }
    public override bool IsOk => true;
    public override TData Unwrap() => Data;
    public OkResult(TData data) => Data = data;
}

public class ErrorResult<TError, TData> : Result<TError, TData>
{
    public TError Error { get; }
    public override bool IsOk => false;
    public override TData Unwrap() => throw new InvalidOperationException($"Result is error: {Error}");
    public ErrorResult(TError error) => Error = error;
}

// Usage pattern in API service layer:
public async Task<Result<ApiError, Contact>> GetContactAsync(string id)
{
    try
    {
        var contact = await _httpClient.GetFromJsonAsync<Contact>($"contacts/{id}");
        return new OkResult<ApiError, Contact>(contact);
    }
    catch (HttpRequestException ex)
    {
        return new ErrorResult<ApiError, Contact>(new ApiError(ex.Message));
    }
}
```

### 3.12 Operating Hours Shift Logic (C# Equivalent)

```csharp
/// <summary>Port of operating hours shift-based logic.</summary>
public class OperatingHoursService
{
    public OperatingStatus CheckOperatingHours(
        HelplineOperatingHours config, string channel, string officeName = null)
    {
        // 1. Resolve office config (specific office or root default)
        var officeInfo = officeName != null && config.Offices.ContainsKey(officeName)
            ? config.Offices[officeName]
            : config.Default;
        
        // 2. Get current time in office timezone
        var tz = TimeZoneInfo.FindSystemTimeZoneById(officeInfo.Timezone);
        var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);
        
        // 3. Check holidays ("MM/DD/YYYY" format)
        var dateKey = now.ToString("MM/dd/yyyy");
        if (officeInfo.Holidays.ContainsKey(dateKey))
            return OperatingStatus.Holiday;
        
        // 4. Check shifts for channel + day
        var dayName = now.DayOfWeek.ToString(); // "Monday", "Tuesday", etc.
        if (officeInfo.OperatingHours.TryGetValue(channel, out var channelHours)
            && channelHours.TryGetValue(dayName, out var shifts))
        {
            var currentHHMM = now.Hour * 100 + now.Minute;
            foreach (var shift in shifts)
            {
                if (currentHHMM >= shift.Open && currentHHMM < shift.Close)
                    return OperatingStatus.Open;
            }
        }
        
        return OperatingStatus.Closed;
    }
}

public enum OperatingStatus { Open, Closed, Holiday }
```

### 3.13 PDF Generation Migration

**Current:** `@react-pdf/renderer` 3.4.4 with 12 components.

**MAUI Equivalent:** Use `QuestPDF` (recommended) or `iText7`.

```csharp
/// <summary>Port of CasePrintView using QuestPDF.</summary>
public class CasePdfGenerator
{
    private const int MaxSections = 100;  // Performance guard from original
    
    public byte[] GenerateCasePdf(Case caseData, List<Contact> contacts, 
        DefinitionVersion definition)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(50);
                
                // Fixed header (helpline logo + case ID + print date)
                page.Header().Element(ComposeHeader);
                
                // Content: summary, categories, contacts (max 100), sections
                page.Content().Element(container => ComposeContent(
                    container, caseData, contacts.Take(MaxSections), definition));
                
                // Fixed footer (page numbers)
                page.Footer().Element(ComposeFooter);
            });
        });
        
        return document.GeneratePdf();
    }
    
    // Thai font support: check definition.LayoutVersion.ThaiCharacterPdfSupport
    // If true, register Thai font family (e.g., Noto Sans Thai)
}
```

### 3.14 Prepopulate Mapping Migration

```csharp
/// <summary>Port of prepopulate 2-strategy system.</summary>
public class PrepopulateService
{
    private readonly bool _useMappings; // Feature flag: use_prepopulate_mappings
    
    public Dictionary<string, object> Prepopulate(
        Dictionary<string, object> preEngagementData, 
        DefinitionVersion definition)
    {
        if (_useMappings && definition.PrepopulateMappings != null)
            return ApplyMappings(preEngagementData, definition.PrepopulateMappings);
        
        if (definition.PrepopulateKeys != null)
            return ApplyKeys(preEngagementData, definition.PrepopulateKeys);
        
        return new Dictionary<string, object>();
    }
    
    /// <summary>Legacy: simple 1:1 key mapping.</summary>
    private Dictionary<string, object> ApplyKeys(
        Dictionary<string, object> data, PrepopulateKeys keys)
    {
        var result = new Dictionary<string, object>();
        foreach (var mapping in keys.Mappings)
        {
            if (data.TryGetValue(mapping.Key, out var value))
                result[mapping.Value] = value;
        }
        return result;
    }
    
    /// <summary>New: 2D AND/OR logic — outer array is OR, inner is AND.</summary>
    private Dictionary<string, object> ApplyMappings(
        Dictionary<string, object> data, PrepopulateMappings mappings)
    {
        var result = new Dictionary<string, object>();
        foreach (var orGroup in mappings.Mappings)
        {
            var allMatch = orGroup.All(entry => 
                data.ContainsKey(entry.Source));
            
            if (allMatch)
            {
                foreach (var entry in orGroup)
                {
                    var value = data[entry.Source];
                    if (entry.Transform == "checkbox")
                        value = value?.ToString()?.ToLower() == "yes";
                    result[entry.Target] = value;
                }
                break; // First matching OR group wins
            }
        }
        return result;
    }
}
```

### 3.15 Form Definitions Caching Migration

```csharp
/// <summary>Port of S3-based form definitions cache.</summary>
public class FormDefinitionService
{
    private readonly ConcurrentDictionary<string, DefinitionVersion> _cache = new();
    private readonly HttpClient _httpClient;
    
    /// <summary>Load form definition with in-memory caching.</summary>
    public async Task<DefinitionVersion> GetDefinitionAsync(
        string helplineCode, string version)
    {
        var cacheKey = $"{helplineCode}/{version}";
        
        if (_cache.TryGetValue(cacheKey, out var cached))
            return cached;
        
        // Fetch from backend (which proxies to S3)
        var definition = await _httpClient.GetFromJsonAsync<DefinitionVersion>(
            $"form-definitions/{helplineCode}/{version}");
        
        _cache.TryAdd(cacheKey, definition);
        return definition;
    }
}
```

### 3.16 FullStory Migration

**Current:** FullStory JS SDK with `init`, `setUserVars`, `setVars`, `recordEvent`, `recordFormValidationError`, `recordBackendError`, `recordingErrorHandler` HOC.

**MAUI:** Use FullStory Mobile SDK or replace with App Center Analytics / Firebase Analytics.

```csharp
/// <summary>Analytics abstraction — port of FullStory event recording patterns.</summary>
public interface IAnalyticsService
{
    void SetUserContext(string helplineCode, string accountSid, string displayName, 
        string email, string workerSid, string environment);
    void SetPageContext(string flexVersion, string helplineCode, string pluginUrl, string pluginVersion);
    void RecordEvent(string eventName, Dictionary<string, object> properties);
    void RecordFormValidationError(string formName, string field, string error);
    void RecordBackendError(string endpoint, int statusCode, string error);
}
```

### 3.17 Conversation Listener Management (C# Equivalent)

**Current:** `addAseloListener` / `deactivateAseloListeners` / `reactivateAseloListeners` for managing Twilio SDK conversation event handlers.

```csharp
/// <summary>Port of conversation listener management pattern.</summary>
public class ConversationListenerManager
{
    private readonly List<ListenerRegistration> _activeListeners = new();
    private bool _isDeactivated;

    public void AddListener(string conversationSid, string eventName, 
        Action<object> handler)
    {
        var registration = new ListenerRegistration(conversationSid, eventName, handler);
        _activeListeners.Add(registration);
        
        if (!_isDeactivated)
            registration.Attach();
    }

    /// <summary>Temporarily deactivate all listeners (e.g., during bot capture).</summary>
    public void DeactivateAll()
    {
        _isDeactivated = true;
        foreach (var listener in _activeListeners)
            listener.Detach();
    }

    /// <summary>Re-enable all listeners after bot capture release.</summary>
    public void ReactivateAll()
    {
        _isDeactivated = false;
        foreach (var listener in _activeListeners)
            listener.Attach();
    }
}
```

### 3.18 Bot Channel Capture Flow (C# Equivalent)

**Current:** 3-phase lifecycle: capture → bot interaction → release (with `CapturedChannelAttributes`).

```csharp
/// <summary>Port of bot channel capture lifecycle.</summary>
public class BotChannelCaptureService
{
    private readonly IAnalyticsService _analytics;
    private readonly ConversationListenerManager _listenerManager;

    /// <summary>Phase 1: Capture channel for bot.</summary>
    public async Task CaptureChannelAsync(string taskSid, string channelSid, 
        CapturedChannelAttributes captured)
    {
        // Deactivate human-facing listeners
        _listenerManager.DeactivateAll();
        
        // Store captured attributes for restoration
        await SaveCapturedAttributesAsync(taskSid, captured);
        
        // Trigger Studio flow for bot interaction
        await TriggerStudioFlowAsync(channelSid, captured.ReleaseType);
    }

    /// <summary>Phase 2: Bot callback — interaction complete.</summary>
    public async Task OnBotCallbackAsync(string taskSid, 
        Dictionary<string, object> botResults)
    {
        // Store bot results in contact attributes
        await UpdateContactWithBotResultsAsync(taskSid, botResults);
    }

    /// <summary>Phase 3: Release — restore channel.</summary>
    public async Task ReleaseChannelAsync(string taskSid)
    {
        var captured = await GetCapturedAttributesAsync(taskSid);
        
        // Restore original channel attributes
        await RestoreChannelAttributesAsync(taskSid, captured);
        
        // Reactivate human-facing listeners
        _listenerManager.ReactivateAll();
    }
}

public record CapturedChannelAttributes(
    string ReleaseType,         // "triggerStudioFlow" or "postSurveyComplete"
    string MemorySid,
    string FlexFlowSid,
    string StudioFlowSid,
    string ChatServiceSid,
    string PreEngagementData);
```

### 3.19 Testing Migration

| Current | MAUI Equivalent |
|---------|----------------|
| Jest (2-min timeout, snapshots) | `xUnit` + `Moq` + `FluentAssertions` |
| Enzyme (React 17 shallow/mount) | N/A — test ViewModels directly |
| Playwright (5 suites + 3 UI) | `Appium` or `MAUI.Testing` |
| AXE accessibility (UI tests) | `Accessibility Insights` or `axe-core/playwright` on web targets |
| Cypress (webchat E2E) | Keep Cypress for webchat (Option B recommended) |
| Docker Playwright container | Docker Appium grid or cloud device farms |

**Key patterns to preserve:**
- Test isolation: each test gets fresh state (mock Redux store → mock DI container)
- Form validation tests with real helpline definitions
- API mock factory pattern → `HttpMessageHandler` mock factory
- Permission-gated UI tests (render with/without specific permissions)
- Multi-task scenario tests (3+ simultaneous tasks)

---

## 4. NuGet Package Recommendations

| Purpose | Current (npm) | Recommended (NuGet) |
|---------|--------------|-------------------|
| MVVM Framework | redux, react-redux | `CommunityToolkit.Mvvm` |
| UI Controls | @material-ui/core | `CommunityToolkit.Maui` |
| HTTP Client | fetch API | `System.Net.Http.Json` |
| JSON | Built-in | `System.Text.Json` |
| Date/Time | date-fns | Built-in `DateTime` / `NodaTime` |
| PDF Generation | @react-pdf/renderer | `QuestPDF` or `iText7` |
| Emoji | emoji-mart | Custom or `EmojiSharp` |
| Rich Text | slate | Custom `Editor` control |
| Localization | Custom i18n | `Microsoft.Extensions.Localization` |
| Secure Storage | localStorage | `SecureStorage` (MAUI Essentials) |
| File Picker | HTML File API | `FilePicker` (MAUI Essentials) |
| Testing | jest | `xUnit` + `Moq` + `FluentAssertions` |
| E2E Testing | playwright | `Appium` or `MAUI Testing` |
| Analytics | FullStory JS SDK | FullStory Mobile SDK / App Center Analytics |
| Result Monad | Custom ErrorResult/OkResult | `OneOf` or custom (see 3.11) |
| Timezone | Intl.DateTimeFormat | `NodaTime` |
| Caching | In-memory Map | `Microsoft.Extensions.Caching.Memory` |

---

## 5. Migration Phases

### Phase 1: Foundation (Weeks 1-3)
- [ ] Create solution structure
- [ ] Implement data models (all types from DATA_MODELS.md)
- [ ] Create API service layer (HRM, Serverless, Resources)
- [ ] Implement authentication (Okta + token management)
- [ ] Set up dependency injection
- [ ] Create base navigation (Shell)
- [ ] Implement Dynamic Form Renderer

### Phase 2: Core Contact Flow (Weeks 4-6)
- [ ] Call type selection page
- [ ] Tabbed contact forms (Caller, Child, Case Info)
- [ ] Category grid component
- [ ] Contact save workflow
- [ ] Per-task navigation state
- [ ] Basic search (contacts + cases)

### Phase 3: Case Management (Weeks 7-8)
- [ ] Case creation from contact
- [ ] Case home view with overview
- [ ] Case sections (add/edit/view)
- [ ] Case timeline
- [ ] Case list with filters and sorting
- [ ] Case status transitions

### Phase 4: Real-Time Features (Weeks 9-10)
- [ ] Twilio Conversations integration (chat)
- [ ] Twilio TaskRouter integration (task management)
- [ ] Transfer operations (warm/cold)
- [ ] Notifications (new message, reserved task)
- [ ] Queue status display

### Phase 5: Advanced Features (Weeks 11-13)
- [ ] Profile management
- [ ] CSAM reporting
- [ ] Resource referrals
- [ ] Conference calling
- [ ] Voice recording playback
- [ ] Transcript viewing

### Phase 6: Configuration & Polish (Weeks 14-15)
- [ ] Feature flag system
- [ ] Multi-language support
- [ ] Permission engine
- [ ] Theme support (light/dark)
- [ ] Canned responses
- [ ] Emoji picker
- [ ] Custom sidebar links

### Phase 7: Webchat Widget (Weeks 16-17)
- [ ] MAUI Blazor Hybrid webchat or standalone web app
- [ ] Pre-engagement form
- [ ] Real-time messaging
- [ ] File attachments
- [ ] Session persistence
- [ ] Operating hours check

### Phase 8: Testing & Deployment (Weeks 18-20)
- [ ] Unit tests for all services and ViewModels
- [ ] Integration tests for API layer
- [ ] E2E tests with Appium
- [ ] Performance testing
- [ ] Platform-specific testing (iOS, Android, Windows)
- [ ] CI/CD pipeline setup

---

## 6. Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Twilio Conversations .NET SDK maturity | May lack features vs JS SDK | Use REST API fallback; check SDK feature parity early |
| Dynamic form complexity | Forms are fully config-driven, 17 input types | Invest heavily in DynamicFormRenderer; test with real helpline configs |
| Per-task navigation | Core UX pattern; agents multi-task | Design TaskNavigationService early; prototype with 3+ tasks |
| Real-time performance | Chat, typing indicators, queue updates | Use async/await throughout; background thread for Twilio events |
| Offline support | Contactless tasks need offline capability | SQLite local cache; sync on reconnect |
| Cross-platform chat | Different Twilio SDK behavior per platform | Test on all target platforms early |
| Permission complexity | 30+ actions × multiple condition types | Port permission engine as-is; comprehensive unit tests |
| Form definition loading | Large JSON schemas loaded at startup | Lazy loading + caching; show loading state |
| Localization 3-tier override | Definition → locale → base fallback not standard | Custom `IStringLocalizer` implementation wrapping override chain |
| Identifier masking | Global PII redaction based on permission | Implement as data binding converter; apply consistently |
| Dual-write retry queue | Must not lose data on SaferNet failure | SQLite queue with background retry service |
| Contact save frequency | Two modes affect data loss risk | Implement both modes; default to `onTabChange` for safety |
| Security headers (webchat) | Bot fingerprinting must match exactly | Replicate header generation in MAUI webchat |
| Garbage collection timing | 120-minute threshold may need tuning | Make configurable; test with realistic multi-task scenarios |
| Operating hours complexity | 14+ countries, multi-office, shift-based with holidays | Port OperatingHoursService exactly (see 3.12); use NodaTime for timezone safety |
| Bot channel capture lifecycle | 3-phase flow with listener deactivation/reactivation | Port ConversationListenerManager (3.17) + BotChannelCaptureService (3.18) as unit |
| USCR dispatch integration | Helpline-specific feature (South Africa only) | Feature-flag guard; clean interface boundary for customization |
| Chat capacity management | Incremental capacity changes during wrapup | Implement increment/decrement with maxMessageCapacity cap; race condition testing |
| Notification retry backoff | 10-retry exponential backoff for message alerts | Port AudioPlayerManager with configurable retry; handle platform audio differences |
| Prepopulate 2-strategy system | Legacy keys vs new 2D AND/OR mappings | Port both strategies (3.14); feature flags control which is active |
| Conversation listener semantics | Register/deactivate/reactivate not standard pattern | Custom event manager (3.17); critical for bot capture correctness |
| FullStory mobile SDK parity | JS SDK has session replay; mobile may differ | Abstract behind IAnalyticsService (3.16); evaluate mobile SDK features early |
| PDF Thai font support | Special font registration for Thai characters | Bundle Noto Sans Thai in MAUI assets; test with QuestPDF early |

---

## 7. Webchat Strategy

For the end-user facing webchat widget, there are three options:

### Option A: MAUI Blazor Hybrid (Recommended for web)
- Keep webchat as a web application using Blazor
- Can share C# models and services with MAUI app
- Deploy to same CDN/hosting

### Option B: Standalone Web App (React or Blazor WASM)
- Keep existing React webchat or rewrite in Blazor WebAssembly
- Embedded in customer websites via `<script>` tag
- Independent deployment

### Option C: MAUI Embedded WebView
- Embed in-app chat using `WebView` with Blazor page
- For mobile-first helpline apps where callers use a native app

**Recommendation:** Option B (keep existing webchat widget) since it's embedded in third-party websites and doesn't need to be a native app. Focus MAUI effort on the agent desktop.

---

## 8. File Manifest — All RE Artifacts

| File | Content |
|------|---------|
| [PRD.md](PRD.md) | Product Requirements Document — all functional and non-functional requirements |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture — components, data flows, deployment, patterns |
| [DATA_MODELS.md](DATA_MODELS.md) | Complete C# data models — all types, enums, schemas |
| [API_CONTRACTS.md](API_CONTRACTS.md) | Full API surface — 85+ endpoints with request/response shapes |
| [UI_COMPONENTS.md](UI_COMPONENTS.md) | Component inventory — 50+ components mapped to MAUI equivalents |
| [FEATURES.md](FEATURES.md) | Feature inventory — 20 core + 35 flagged features with workflows |
| [INTEGRATIONS.md](INTEGRATIONS.md) | Integration map — 20+ third-party services with migration notes |
| [MAUI_MIGRATION_GUIDE.md](MAUI_MIGRATION_GUIDE.md) | This file — migration strategy, code examples, phase plan |
