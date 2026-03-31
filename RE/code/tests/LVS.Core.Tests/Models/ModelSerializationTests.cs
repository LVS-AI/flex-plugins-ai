using System.Text.Json;
using LVS.Core.Models;

namespace LVS.Core.Tests.Models;

public class ModelSerializationTests
{
    [Fact]
    public void Contact_RoundTrips_Json()
    {
        var contact = new Contact
        {
            Id = 42,
            HelplineCode = "AS",
            Channel = ChannelTypes.Web,
            TimeOfContact = new DateTime(2024, 1, 15, 12, 0, 0, DateTimeKind.Utc)
        };

        var json = JsonSerializer.Serialize(contact);
        var deserialized = JsonSerializer.Deserialize<Contact>(json);

        Assert.NotNull(deserialized);
        Assert.Equal(42, deserialized!.Id);
        Assert.Equal("AS", deserialized.HelplineCode);
    }

    [Fact]
    public void Case_RoundTrips_Json()
    {
        var caseObj = new Case
        {
            Id = "10",
            Status = "open",
            HelplineCode = "AS",
            Info = new CaseInfo { Summary = "Test summary" }
        };

        var json = JsonSerializer.Serialize(caseObj);
        var deserialized = JsonSerializer.Deserialize<Case>(json);

        Assert.NotNull(deserialized);
        Assert.Equal("10", deserialized!.Id);
        Assert.Equal("Test summary", deserialized.Info?.Summary);
    }

    [Fact]
    public void FeatureFlags_DefaultsAreFalse()
    {
        var flags = new FeatureFlags();

        Assert.False(flags.EnableCaseManagement);
        Assert.False(flags.EnableExternalRecordings);
    }

    [Fact]
    public void FormItemDefinition_Deserializes_Options()
    {
        var json = """
        {
            "name": "gender",
            "label": "Gender",
            "type": "Select",
            "options": [
                { "value": "male", "label": "Male" },
                { "value": "female", "label": "Female" }
            ]
        }
        """;

        var definition = JsonSerializer.Deserialize<FormItemDefinition>(json);

        Assert.NotNull(definition);
        Assert.Equal("gender", definition!.Name);
        Assert.Equal(2, definition.Options?.Count);
    }

    [Fact]
    public void ConversationMedia_Polymorphic_Deserialization()
    {
        var s3Media = new S3StoredMedia
        {
            StoreType = "S3",
            StoreTypeSpecificData = new S3Location { Bucket = "test-bucket", Key = "test-key" }
        };

        var json = JsonSerializer.Serialize<ConversationMedia>(s3Media);

        Assert.Contains("S3", json);
        Assert.Contains("test-bucket", json);
    }
}
