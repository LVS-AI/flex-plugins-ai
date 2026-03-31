namespace LVS.Core.Services;

public interface ILocalizationService
{
    string GetString(string key);
    string CurrentLocale { get; }
    Task SetLocaleAsync(string locale);
    IReadOnlyList<string> AvailableLocales { get; }
}
