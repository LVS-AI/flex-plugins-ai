namespace LVS.Core.Services;

public interface IAuthService
{
    Task<string> GetTokenAsync();
    Task<string> RefreshTokenAsync();
    Task<bool> IsAuthenticatedAsync();
    Task LogoutAsync();
}
