using System.Collections.Concurrent;
using LVS.Core.Models;

namespace LVS.Core.Services;

public class FormDefinitionService : IFormDefinitionService
{
    private readonly ConcurrentDictionary<string, DefinitionVersion> _cache = new();
    private readonly HrmApiClient _api;

    public FormDefinitionService(HrmApiClient api)
    {
        _api = api;
    }

    public async Task<DefinitionVersion> GetDefinitionAsync(string helplineCode, string version)
    {
        var cacheKey = $"{helplineCode}/{version}";

        if (_cache.TryGetValue(cacheKey, out var cached))
            return cached;

        var definition = await _api.GetAsync<DefinitionVersion>(
            $"form-definitions/{Uri.EscapeDataString(helplineCode)}/{Uri.EscapeDataString(version)}")
            ?? throw new InvalidOperationException($"Failed to load definition version: {cacheKey}");

        definition.Version ??= version;

        _cache.TryAdd(cacheKey, definition);
        return definition;
    }
}
