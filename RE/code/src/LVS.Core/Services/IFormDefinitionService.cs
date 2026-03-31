using LVS.Core.Models;

namespace LVS.Core.Services;

public interface IFormDefinitionService
{
    Task<DefinitionVersion> GetDefinitionAsync(string helplineCode, string version);
}
