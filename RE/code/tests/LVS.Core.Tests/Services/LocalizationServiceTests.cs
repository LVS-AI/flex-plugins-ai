using LVS.Core.Services;

namespace LVS.Core.Tests.Services;

public class LocalizationServiceTests
{
    [Fact]
    public void GetString_ReturnsFallback_WhenKeyNotFound()
    {
        var service = new LocalizationService();
        var result = service.GetString("nonExistentKey");

        Assert.Equal("nonExistentKey", result);
    }

    [Fact]
    public void GetString_ReturnsLocalizedValue_WhenKeyExists()
    {
        var service = new LocalizationService();
        service.LoadTranslations("en", new Dictionary<string, string> { ["greeting"] = "Hello" });
        var result = service.GetString("greeting");

        Assert.Equal("Hello", result);
    }

    [Fact]
    public void CurrentLocale_DefaultsToEn()
    {
        var service = new LocalizationService();
        Assert.Equal("en", service.CurrentLocale);
    }

    [Fact]
    public async Task SetLocaleAsync_ChangesCurrentLocale()
    {
        var service = new LocalizationService();
        service.LoadTranslations("es", new Dictionary<string, string> { ["greeting"] = "Hola" });
        await service.SetLocaleAsync("es");
        Assert.Equal("es", service.CurrentLocale);
    }

    [Fact]
    public void AvailableLocales_ReflectsLoadedTranslations()
    {
        var service = new LocalizationService();
        Assert.Empty(service.AvailableLocales);

        service.LoadTranslations("en", new Dictionary<string, string>());
        Assert.Single(service.AvailableLocales);
    }
}
