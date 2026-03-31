using System.Text.Json.Serialization;

namespace LVS.Core.Models;

[JsonDerivedType(typeof(TwilioStoredMedia), "twilio")]
[JsonDerivedType(typeof(S3StoredMedia), "S3")]
public abstract class ConversationMedia
{
    [JsonPropertyName("storeType")]
    public string StoreType { get; set; } = string.Empty;
}

public class TwilioStoredMedia : ConversationMedia
{
    [JsonPropertyName("reservationSid")]
    public string? ReservationSid { get; set; }
}

public class S3StoredMedia : ConversationMedia
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("location")]
    public S3Location Location { get; set; } = new();
}

public class S3Location
{
    [JsonPropertyName("bucket")]
    public string Bucket { get; set; } = string.Empty;

    [JsonPropertyName("key")]
    public string Key { get; set; } = string.Empty;
}
