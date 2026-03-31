using LVS.Core.Models;
using LVS.Core.Services;
using NSubstitute;

namespace LVS.Core.Tests.Services;

public class PermissionServiceTests
{
    [Fact]
    public void CanPerform_WithEveryoneCondition_ReturnsTrue()
    {
        var rules = new PermissionRules
        {
            Rules = new Dictionary<string, List<PermissionCondition>>
            {
                ["viewCase"] =
                [
                    new PermissionCondition { Condition = "everyone" }
                ]
            }
        };

        var permissionService = Substitute.For<IPermissionService>();
        permissionService.CanPerform("viewCase", Arg.Any<bool>()).Returns(true);

        Assert.True(permissionService.CanPerform("viewCase", false));
    }

    [Fact]
    public void CanPerform_WithNobodyCondition_ReturnsFalse()
    {
        var permissionService = Substitute.For<IPermissionService>();
        permissionService.CanPerform("deleteAllCases", Arg.Any<bool>()).Returns(false);

        Assert.False(permissionService.CanPerform("deleteAllCases", false));
    }

    [Fact]
    public void CanPerform_WithSupervisorCondition_ReturnsTrueForSupervisor()
    {
        var permissionService = Substitute.For<IPermissionService>();
        permissionService.CanPerform("editClosedCase", true).Returns(true);
        permissionService.CanPerform("editClosedCase", false).Returns(false);

        Assert.True(permissionService.CanPerform("editClosedCase", true));
        Assert.False(permissionService.CanPerform("editClosedCase", false));
    }

    [Fact]
    public void HasPermission_ReturnsFalse_ForUnknownAction()
    {
        var permissionService = Substitute.For<IPermissionService>();
        permissionService.HasPermission("unknownAction").Returns(false);

        Assert.False(permissionService.HasPermission("unknownAction"));
    }
}
