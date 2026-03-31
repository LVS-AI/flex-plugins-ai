using LVS.Core.Services;
using NSubstitute;

namespace LVS.Core.Tests.Services;

public class IdentifierMaskingServiceTests
{
    [Fact]
    public void MaskIfNeeded_ReturnsMasked_WhenNoPermission()
    {
        var permService = Substitute.For<IPermissionService>();
        permService.HasPermission("VIEW_IDENTIFIERS").Returns(false);

        var service = new IdentifierMaskingService(permService);
        var result = service.MaskIfNeeded("john@example.com");

        Assert.Equal("***", result);
    }

    [Fact]
    public void MaskIfNeeded_ReturnsOriginal_WhenHasPermission()
    {
        var permService = Substitute.For<IPermissionService>();
        permService.HasPermission("VIEW_IDENTIFIERS").Returns(true);

        var service = new IdentifierMaskingService(permService);
        var result = service.MaskIfNeeded("john@example.com");

        Assert.Equal("john@example.com", result);
    }
}
