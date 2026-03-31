using LVS.Core.Models;

namespace LVS.Core.Services;

public interface ICaseService
{
    Task<Case> CreateCaseAsync(Case newCase);
    Task<Case> GetCaseAsync(string caseId);
    Task<Case> UpdateCaseAsync(string caseId, Case updatedCase);
    Task<Case> UpdateCaseOverviewAsync(string caseId, CaseInfo info);
    Task<Case> UpdateCaseStatusAsync(string caseId, string status, string updatedBy);
    Task<SearchCaseResult> SearchCasesAsync(ListCasesFilters? filters, ListCasesSort? sort, int limit = 20, int offset = 0);
    Task<List<TimelineActivity>> GetCaseTimelineAsync(string caseId, string? sectionTypes = null, bool includeContacts = true, int limit = 20, int offset = 0);
    Task<CaseSection> AddCaseSectionAsync(string caseId, string sectionType, CaseSection section);
    Task<CaseSection> UpdateCaseSectionAsync(string caseId, string sectionType, string sectionId, CaseSection section);
    Task<List<CaseSection>> GetCaseSectionsAsync(string caseId, string sectionType);
}
