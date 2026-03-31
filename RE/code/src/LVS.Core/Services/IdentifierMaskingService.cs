namespace LVS.Core.Services;

public class IdentifierMaskingService
{
    private readonly IPermissionService _permissions;

    public IdentifierMaskingService(IPermissionService permissions)
    {
        _permissions = permissions;
    }

    public bool ShouldMask => !_permissions.HasPermission("VIEW_IDENTIFIERS");

    public string MaskIfNeeded(string? value)
    {
        if (!ShouldMask || string.IsNullOrEmpty(value))
            return value ?? string.Empty;
        return "***";
    }
}
