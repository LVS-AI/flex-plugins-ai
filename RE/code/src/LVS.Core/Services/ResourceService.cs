using LVS.Core.Models;

namespace LVS.Core.Services;

public class ResourceService : IResourceService
{
    private readonly HrmApiClient _api;

    public ResourceService(HrmApiClient api) => _api = api;

    public async Task<(int TotalCount, List<ReferrableResource> Results)> SearchResourcesAsync(
        string? generalSearchTerm = null,
        string? filters = null,
        int start = 0,
        int limit = 20)
    {
        var query = $"resources?start={start}&limit={limit}";
        if (!string.IsNullOrEmpty(generalSearchTerm))
            query += $"&generalSearchTerm={Uri.EscapeDataString(generalSearchTerm)}";
        if (!string.IsNullOrEmpty(filters))
            query += $"&filters={Uri.EscapeDataString(filters)}";

        var result = await _api.GetAsync<ResourceSearchResult>(query);
        return (result?.TotalCount ?? 0, result?.Results ?? []);
    }

    public async Task<ReferrableResource> GetResourceAsync(string resourceId)
        => await _api.GetAsync<ReferrableResource>($"resources/{Uri.EscapeDataString(resourceId)}")
           ?? throw new InvalidOperationException($"Resource {resourceId} not found.");

    private class ResourceSearchResult
    {
        public int TotalCount { get; set; }
        public List<ReferrableResource> Results { get; set; } = [];
    }
}
