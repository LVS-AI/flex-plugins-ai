namespace LVS.Core.Models;

public static class ChannelTypes
{
    public const string Voice = "voice";
    public const string Sms = "sms";
    public const string Facebook = "facebook";
    public const string WhatsApp = "whatsapp";
    public const string Web = "web";
    public const string Telegram = "telegram";
    public const string Instagram = "instagram";
    public const string Line = "line";
    public const string Messenger = "messenger";
    public const string Modica = "modica";
    public const string Default = "default";

    public static readonly string[] ChatChannels =
    [
        WhatsApp, Facebook, Messenger, Web, Modica, Sms, Telegram, Instagram, Line
    ];

    public static readonly string[] AllChannels =
    [
        Voice, Sms, Facebook, WhatsApp, Web, Telegram, Instagram, Line, Messenger, Modica
    ];
}
