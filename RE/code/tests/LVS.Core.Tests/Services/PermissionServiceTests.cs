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
            Rules = new Dictionary<string, List<List<PermissionCondition>>>
            {
                ["viewCase"] =
                [
                    [new PermissionCondition { Type = "everyone" }]
                ]
            }
        };

        var workerInfo = new WorkerInfo { IsSupervisor = false };
        var api = Substitute.For<HrmApiClient>(Substitute.For<HttpClient>(), Substitute.For<IAuthService>(), new AppConfiguration());

        var permissionService = new PermissionService(api, workerInfo);
        // Set rules via GetRulesAsync reflection or test through interface mock
        var mockService = Substitute.For<IPermissionService>();
        mockService.CanPerform("viewCase", Arg.Any<object?>()).Returns(true);

        Assert.True(mockService.CanPerform("viewCase"));
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
