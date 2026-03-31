using LVS.Core.Models;

namespace LVS.Core.Services;

public interface IPermissionService
{
    Task<PermissionRules> GetRulesAsync();
    bool CanPerform(string action, object? target = null);
    bool HasPermission(string permission);
}
