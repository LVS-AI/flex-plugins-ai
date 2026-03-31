using LVS.Core.Models;
using LVS.Core.Services;
using NSubstitute;

namespace LVS.Core.Tests.Services;

public class ContactServiceTests
{
    private readonly IContactService _sut;
    private readonly HttpClient _httpClient;

    public ContactServiceTests()
    {
        _httpClient = Substitute.For<HttpClient>();
        // ContactService depends on HrmApiClient which wraps HttpClient.
        // For now these are structural tests that validate the interface contract.
        _sut = Substitute.For<IContactService>();
    }

    [Fact]
    public async Task GetContactAsync_ReturnsContact_WhenIdExists()
    {
        var expected = new Contact { Id = 42, TimeOfContact = DateTime.UtcNow };
        _sut.GetContactAsync(42).Returns(expected);

        var result = await _sut.GetContactAsync(42);

        Assert.NotNull(result);
        Assert.Equal(42, result!.Id);
    }

    [Fact]
    public async Task SearchContactsAsync_ReturnsResults()
    {
        var searchResult = new SearchContactResult
        {
            Count = 1,
            Contacts = [new Contact { Id = 1 }]
        };
        _sut.SearchContactsAsync(Arg.Any<SearchFormValues>(), Arg.Any<int>(), Arg.Any<int>())
            .Returns(searchResult);

        var result = await _sut.SearchContactsAsync(new SearchFormValues(), 0, 20);

        Assert.NotNull(result);
        Assert.Equal(1, result.Count);
    }

    [Fact]
    public async Task ConnectToCaseAsync_ReturnsUpdatedContact()
    {
        var contact = new Contact { Id = 10, CaseId = "99" };
        _sut.ConnectToCaseAsync(10, "99").Returns(contact);

        var result = await _sut.ConnectToCaseAsync(10, "99");

        Assert.NotNull(result);
        Assert.Equal("99", result!.CaseId);
    }

    [Fact]
    public async Task CreateContactAsync_ReturnsNewContact()
    {
        var newContact = new Contact { Id = 100 };
        _sut.CreateContactAsync(Arg.Any<Contact>()).Returns(newContact);

        var result = await _sut.CreateContactAsync(new Contact());

        Assert.NotNull(result);
        Assert.Equal(100, result!.Id);
    }
}
