using LVS.Core.Models;

namespace LVS.Core.Services;

public class PermissionService : IPermissionService
{
    private readonly HrmApiClient _api;
    private readonly WorkerInfo _workerInfo;
    private PermissionRules? _rules;

    public PermissionService(HrmApiClient api, WorkerInfo workerInfo)
    {
        _api = api;
        _workerInfo = workerInfo;
    }

    public async Task<PermissionRules> GetRulesAsync()
    {
        _rules ??= await _api.GetAsync<PermissionRules>("permissions/rules")
            ?? new PermissionRules();
        return _rules;
    }

    public bool CanPerform(string action, object? target = null)
    {
        if (_rules?.Rules == null || !_rules.Rules.TryGetValue(action, out var conditionSets))
            return false;

        return conditionSets.Any(conditionSet =>
            conditionSet.All(condition => EvaluateCondition(condition, target)));
    }

    public bool HasPermission(string permission) => CanPerform(permission);

    private bool EvaluateCondition(PermissionCondition condition, object? target)
    {
        return condition.Type switch
        {
            "everyone" => true,
            "nobody" => false,
            "isSupervisor" => _workerInfo.IsSupervisor,
            _ => false
        };
    }
}
