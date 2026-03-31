using System.Net.Http.Json;
using LVS.Core.Models;

namespace LVS.Core.Services;

public class ServerlessService : IServerlessService
{
    private readonly HttpClient _httpClient;
    private readonly AppConfiguration _config;

    public ServerlessService(HttpClient httpClient, AppConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    private string BaseUrl => _config.ServerlessBaseUrl;

    public async Task<object> TransferStartAsync(string mode, string targetSid, string taskSid)
    {
        var response = await _httpClient.PostAsJsonAsync(
            $"{BaseUrl}/transferStart",
            new { mode, targetSid, taskSid });
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<object>()
               ?? new { };
    }

    public async Task<List<CounselorEntry>> PopulateCounselorsAsync()
        => await _httpClient.GetFromJsonAsync<List<CounselorEntry>>($"{BaseUrl}/populateCounselors")
           ?? [];

    public async Task<object> GetWorkerAttributesAsync(string workerSid)
        => await _httpClient.GetFromJsonAsync<object>(
               $"{BaseUrl}/getWorkerAttributes?workerSid={Uri.EscapeDataString(workerSid)}")
           ?? new { };

    public async Task CompleteTaskAsync(string taskSid)
    {
        var response = await _httpClient.PostAsJsonAsync(
            $"{BaseUrl}/completeTask",
            new { taskSid });
        response.EnsureSuccessStatusCode();
    }

    public async Task CancelTaskAsync(string taskSid)
    {
        var response = await _httpClient.PostAsJsonAsync(
            $"{BaseUrl}/cancelTask",
            new { taskSid });
        response.EnsureSuccessStatusCode();
    }
}
