using LVS.Core.Models;

namespace LVS.Core.Services;

public interface IResourceService
{
    Task<(int TotalCount, List<ReferrableResource> Results)> SearchResourcesAsync(
        string? generalSearchTerm = null,
        string? filters = null,
        int start = 0,
        int limit = 20);
    Task<ReferrableResource> GetResourceAsync(string resourceId);
}

public class ReferrableResource
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public Dictionary<string, object?> Attributes { get; set; } = new();
}
