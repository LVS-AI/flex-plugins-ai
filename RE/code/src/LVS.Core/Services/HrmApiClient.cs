using System.Net.Http.Headers;
using System.Net.Http.Json;
using LVS.Core.Models;

namespace LVS.Core.Services;

public class HrmApiClient
{
    private readonly HttpClient _httpClient;
    private readonly IAuthService _authService;
    private readonly AppConfiguration _config;

    public HrmApiClient(HttpClient httpClient, IAuthService authService, AppConfiguration config)
    {
        _httpClient = httpClient;
        _authService = authService;
        _config = config;
    }

    private string BaseUrl => $"{_config.HrmBaseUrl}/v0/accounts/{_config.AccountSid}";

    private async Task SetAuthHeaderAsync()
    {
        var token = await _authService.GetTokenAsync();
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    public async Task<T?> GetAsync<T>(string path)
    {
        await SetAuthHeaderAsync();
        var response = await _httpClient.GetAsync($"{BaseUrl}/{path}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<T>();
    }

    public async Task<T?> PostAsync<T>(string path, object body)
    {
        await SetAuthHeaderAsync();
        var response = await _httpClient.PostAsJsonAsync($"{BaseUrl}/{path}", body);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<T>();
    }

    public async Task<T?> PatchAsync<T>(string path, object body)
    {
        await SetAuthHeaderAsync();
        var content = JsonContent.Create(body);
        var request = new HttpRequestMessage(HttpMethod.Patch, $"{BaseUrl}/{path}") { Content = content };
        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<T>();
    }

    public async Task<T?> PutAsync<T>(string path, object body)
    {
        await SetAuthHeaderAsync();
        var response = await _httpClient.PutAsJsonAsync($"{BaseUrl}/{path}", body);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<T>();
    }

    public async Task DeleteAsync(string path)
    {
        await SetAuthHeaderAsync();
        var response = await _httpClient.DeleteAsync($"{BaseUrl}/{path}");
        response.EnsureSuccessStatusCode();
    }
}
