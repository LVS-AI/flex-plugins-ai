using LVS.Core.Models;

namespace LVS.Core.Services;

public class CSAMReportService : ICSAMReportService
{
    private readonly HrmApiClient _api;

    public CSAMReportService(HrmApiClient api) => _api = api;

    public async Task<CSAMReportEntry> CreateReportAsync(CSAMReportEntry report)
        => await _api.PostAsync<CSAMReportEntry>("csam-reports", report)
           ?? throw new InvalidOperationException("Failed to create CSAM report.");

    public async Task<CSAMReportEntry> UpdateReportAsync(int reportId, CSAMReportEntry report)
        => await _api.PutAsync<CSAMReportEntry>($"csam-reports/{reportId}", report)
           ?? throw new InvalidOperationException("Failed to update CSAM report.");

    public async Task<List<CSAMReportEntry>> GetReportsForContactAsync(int contactId)
        => await _api.GetAsync<List<CSAMReportEntry>>($"contacts/{contactId}/csam-reports") ?? [];
}
