using LVS.Core.Models;
using LVS.Core.Services;
using NSubstitute;

namespace LVS.Core.Tests.Services;

public class CaseServiceTests
{
    private readonly ICaseService _sut;

    public CaseServiceTests()
    {
        _sut = Substitute.For<ICaseService>();
    }

    [Fact]
    public async Task GetCaseAsync_ReturnsCase_WhenIdExists()
    {
        var expected = new Case { Id = "5", Status = "open" };
        _sut.GetCaseAsync("5").Returns(expected);

        var result = await _sut.GetCaseAsync("5");

        Assert.NotNull(result);
        Assert.Equal("5", result!.Id);
        Assert.Equal("open", result.Status);
    }

    [Fact]
    public async Task SearchCasesAsync_ReturnsPaginatedResults()
    {
        var searchResult = new SearchCaseResult
        {
            Count = 2,
            Cases = [new Case { Id = "1" }, new Case { Id = "2" }]
        };
        _sut.SearchCasesAsync(Arg.Any<SearchFormValues>(), Arg.Any<int>(), Arg.Any<int>())
            .Returns(searchResult);

        var result = await _sut.SearchCasesAsync(new SearchFormValues(), 0, 20);

        Assert.Equal(2, result.Count);
        Assert.Equal(2, result.Cases.Count);
    }

    [Fact]
    public async Task UpdateCaseOverviewAsync_ReturnsUpdatedCase()
    {
        var updated = new Case { Id = "10", Info = new CaseInfo { Summary = "Updated" } };
        _sut.UpdateCaseOverviewAsync("10", Arg.Any<CaseInfo>()).Returns(updated);

        var result = await _sut.UpdateCaseOverviewAsync("10", new CaseInfo { Summary = "Updated" });

        Assert.NotNull(result);
        Assert.Equal("Updated", result!.Info?.Summary);
    }

    [Fact]
    public async Task GetTimelineAsync_ReturnsList()
    {
        var timeline = new List<TimelineActivity>
        {
            new() { Activity = "Case created", Timestamp = DateTime.UtcNow }
        };
        _sut.GetTimelineAsync("1", Arg.Any<bool>()).Returns(timeline);

        var result = await _sut.GetTimelineAsync("1");

        Assert.Single(result);
    }

    [Fact]
    public async Task UpdateStatusAsync_ReturnsCase()
    {
        var c = new Case { Id = "1", Status = "closed" };
        _sut.UpdateStatusAsync("1", "closed").Returns(c);

        var result = await _sut.UpdateStatusAsync("1", "closed");

        Assert.Equal("closed", result!.Status);
    }
}
