using LVS.Core.Models;

namespace LVS.Core.Services;

public class CaseService : ICaseService
{
    private readonly HrmApiClient _api;

    public CaseService(HrmApiClient api)
    {
        _api = api;
    }

    public async Task<Case> CreateCaseAsync(Case newCase)
    {
        return await _api.PostAsync<Case>("cases", newCase)
            ?? throw new InvalidOperationException("Failed to create case");
    }

    public async Task<Case> GetCaseAsync(string caseId)
    {
        return await _api.GetAsync<Case>($"cases/{Uri.EscapeDataString(caseId)}")
            ?? throw new InvalidOperationException("Case not found");
    }

    public async Task<Case> UpdateCaseAsync(string caseId, Case updatedCase)
    {
        return await _api.PutAsync<Case>($"cases/{Uri.EscapeDataString(caseId)}", updatedCase)
            ?? throw new InvalidOperationException("Failed to update case");
    }

    public async Task<Case> UpdateCaseOverviewAsync(string caseId, CaseInfo info)
    {
        return await _api.PutAsync<Case>($"cases/{Uri.EscapeDataString(caseId)}/overview", info)
            ?? throw new InvalidOperationException("Failed to update case overview");
    }

    public async Task<Case> UpdateCaseStatusAsync(string caseId, string status, string updatedBy)
    {
        return await _api.PutAsync<Case>(
            $"cases/{Uri.EscapeDataString(caseId)}/status",
            new { status, statusUpdatedBy = updatedBy })
            ?? throw new InvalidOperationException("Failed to update case status");
    }

    public async Task<SearchCaseResult> SearchCasesAsync(
        ListCasesFilters? filters, ListCasesSort? sort, int limit = 20, int offset = 0)
    {
        var body = new { limit, offset, sort, filters };
        return await _api.PostAsync<SearchCaseResult>("cases/search", body)
            ?? new SearchCaseResult();
    }

    public async Task<List<TimelineActivity>> GetCaseTimelineAsync(
        string caseId, string? sectionTypes = null, bool includeContacts = true, int limit = 20, int offset = 0)
    {
        var query = $"?includeContacts={includeContacts}&limit={limit}&offset={offset}";
        if (!string.IsNullOrEmpty(sectionTypes))
            query += $"&sectionTypes={Uri.EscapeDataString(sectionTypes)}";

        return await _api.GetAsync<List<TimelineActivity>>($"cases/{Uri.EscapeDataString(caseId)}/timeline{query}")
            ?? [];
    }

    public async Task<CaseSection> AddCaseSectionAsync(string caseId, string sectionType, CaseSection section)
    {
        return await _api.PostAsync<CaseSection>(
            $"cases/{Uri.EscapeDataString(caseId)}/sections/{Uri.EscapeDataString(sectionType)}",
            section)
            ?? throw new InvalidOperationException("Failed to add case section");
    }

    public async Task<CaseSection> UpdateCaseSectionAsync(
        string caseId, string sectionType, string sectionId, CaseSection section)
    {
        return await _api.PutAsync<CaseSection>(
            $"cases/{Uri.EscapeDataString(caseId)}/sections/{Uri.EscapeDataString(sectionType)}/{Uri.EscapeDataString(sectionId)}",
            section)
            ?? throw new InvalidOperationException("Failed to update case section");
    }

    public async Task<List<CaseSection>> GetCaseSectionsAsync(string caseId, string sectionType)
    {
        return await _api.GetAsync<List<CaseSection>>(
            $"cases/{Uri.EscapeDataString(caseId)}/sections/{Uri.EscapeDataString(sectionType)}")
            ?? [];
    }
}
