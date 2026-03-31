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
