namespace LVS.Core.Services;

public class LocalizationService : ILocalizationService
{
    private readonly Dictionary<string, Dictionary<string, string>> _translations = new();
    private string _currentLocale = "en";

    public string CurrentLocale => _currentLocale;

    public IReadOnlyList<string> AvailableLocales => _translations.Keys.ToList().AsReadOnly();

    public string GetString(string key)
    {
        if (_translations.TryGetValue(_currentLocale, out var localeStrings)
            && localeStrings.TryGetValue(key, out var localized))
            return localized;

        if (_translations.TryGetValue("en", out var enStrings)
            && enStrings.TryGetValue(key, out var english))
            return english;

        return key;
    }

    public Task SetLocaleAsync(string locale)
    {
        if (_translations.ContainsKey(locale))
            _currentLocale = locale;
        return Task.CompletedTask;
    }

    public void LoadTranslations(string locale, Dictionary<string, string> strings)
    {
        _translations[locale] = strings;
    }
}
