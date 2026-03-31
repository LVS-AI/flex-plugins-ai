using LVS.Core.Services;

namespace LVS.Maui.App;

/// <summary>Placeholder auth service — replace with Okta/Twilio token auth.</summary>
public class AuthService : IAuthService
{
    private string? _token;

    public Task<string> GetTokenAsync()
    {
        return Task.FromResult(_token ?? string.Empty);
    }

    public Task<string> RefreshTokenAsync()
    {
        // TODO: Implement Twilio Flex token refresh
        return Task.FromResult(_token ?? string.Empty);
    }

    public Task<bool> IsAuthenticatedAsync()
    {
        return Task.FromResult(!string.IsNullOrEmpty(_token));
    }

    public Task LogoutAsync()
    {
        _token = null;
        return Task.CompletedTask;
    }

    public void SetToken(string token) => _token = token;
}
