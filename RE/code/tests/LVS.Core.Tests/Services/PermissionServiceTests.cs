using LVS.Core.Models;
using LVS.Core.Services;
using NSubstitute;

namespace LVS.Core.Tests.Services;

public class PermissionServiceTests
{
    [Fact]
    public void CanPerform_WithEveryoneCondition_ReturnsTrue()
    {
        var permissionService = Substitute.For<IPermissionService>();
        permissionService.CanPerform("viewCase", Arg.Any<object?>()).Returns(true);

        Assert.True(permissionService.CanPerform("viewCase"));
    }

    [Fact]
    public void CanPerform_WithNobodyCondition_ReturnsFalse()
    {
        var permissionService = Substitute.For<IPermissionService>();
        permissionService.CanPerform("deleteAllCases", Arg.Any<object?>()).Returns(false);

        Assert.False(permissionService.CanPerform("deleteAllCases"));
    }

    [Fact]
    public void CanPerform_WithSupervisorCondition_ReturnsTrueForSupervisor()
    {
        var permissionService = Substitute.For<IPermissionService>();
        permissionService.CanPerform("editClosedCase", Arg.Any<object?>()).Returns(true);

        Assert.True(permissionService.CanPerform("editClosedCase"));
    }

    [Fact]
    public void HasPermission_ReturnsFalse_ForUnknownAction()
    {
        var permissionService = Substitute.For<IPermissionService>();
        permissionService.HasPermission("unknownAction").Returns(false);

        Assert.False(permissionService.HasPermission("unknownAction"));
    }
}
