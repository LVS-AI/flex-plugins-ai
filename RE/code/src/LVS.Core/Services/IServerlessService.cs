using LVS.Core.Models;

namespace LVS.Core.Services;

public interface IServerlessService
{
    Task<object> TransferStartAsync(string mode, string targetSid, string taskSid);
    Task<List<CounselorEntry>> PopulateCounselorsAsync();
    Task<object> GetWorkerAttributesAsync(string workerSid);
    Task CompleteTaskAsync(string taskSid);
    Task CancelTaskAsync(string taskSid);
}
