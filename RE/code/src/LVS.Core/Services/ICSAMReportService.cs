using LVS.Core.Models;

namespace LVS.Core.Services;

public interface ICSAMReportService
{
    Task<CSAMReportEntry> CreateReportAsync(CSAMReportEntry report);
    Task<CSAMReportEntry> UpdateReportAsync(int reportId, CSAMReportEntry report);
    Task<List<CSAMReportEntry>> GetReportsForContactAsync(string contactId);
}
