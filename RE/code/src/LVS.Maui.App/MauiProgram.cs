using LVS.Core.Models;
using LVS.Core.Services;
using CommunityToolkit.Maui;
using Microsoft.Extensions.Logging;

namespace LVS.Maui.App;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .UseMauiCommunityToolkit()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

#if DEBUG
        builder.Logging.AddDebug();
#endif

        // Configuration
        var appConfig = new AppConfiguration
        {
            HrmBaseUrl = "https://hrm.example.com",
            ServerlessBaseUrl = "https://serverless.example.com",
            ResourcesBaseUrl = "https://resources.example.com",
            LambdaBaseUrl = "https://lambda.example.com",
            AccountSid = "",
            HelplineCode = "",
            WorkerSid = "",
            FeatureFlags = new FeatureFlags()
        };
        builder.Services.AddSingleton(appConfig);

        var workerInfo = new WorkerInfo();
        builder.Services.AddSingleton(workerInfo);

        // HTTP Client
        builder.Services.AddSingleton<HttpClient>();

        // Core Services
        builder.Services.AddSingleton<HrmApiClient>();
        builder.Services.AddSingleton<IAuthService, AuthService>();
        builder.Services.AddSingleton<IContactService, ContactService>();
        builder.Services.AddSingleton<ICaseService, CaseService>();
        builder.Services.AddSingleton<IFormDefinitionService, FormDefinitionService>();
        builder.Services.AddSingleton<IPermissionService, PermissionService>();
        builder.Services.AddSingleton<ILocalizationService, LocalizationService>();
        builder.Services.AddSingleton<IProfileService, ProfileService>();
        builder.Services.AddSingleton<ICSAMReportService, CSAMReportService>();
        builder.Services.AddSingleton<IResourceService, ResourceService>();
        builder.Services.AddSingleton<IServerlessService, ServerlessService>();
        builder.Services.AddSingleton<IdentifierMaskingService>();

        // ViewModels
        builder.Services.AddTransient<ViewModels.LoginViewModel>();
        builder.Services.AddTransient<ViewModels.ContactFormViewModel>();
        builder.Services.AddTransient<ViewModels.CaseViewModel>();
        builder.Services.AddTransient<ViewModels.CaseListViewModel>();
        builder.Services.AddTransient<ViewModels.SearchViewModel>();
        builder.Services.AddTransient<ViewModels.ProfileViewModel>();
        builder.Services.AddTransient<ViewModels.TeamsViewModel>();
        builder.Services.AddTransient<ViewModels.SettingsViewModel>();

        // Pages
        builder.Services.AddTransient<Views.LoginPage>();
        builder.Services.AddTransient<Views.ContactFormPage>();
        builder.Services.AddTransient<Views.CaseHomePage>();
        builder.Services.AddTransient<Views.CaseListPage>();
        builder.Services.AddTransient<Views.SearchPage>();
        builder.Services.AddTransient<Views.ProfilePage>();
        builder.Services.AddTransient<Views.TeamsViewPage>();
        builder.Services.AddTransient<Views.SettingsPage>();

        return builder.Build();
    }
}
