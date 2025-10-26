using CS2Ranking.Application.Dtos;

namespace CS2Ranking.Application.Interfaces.IRepositories
{
    public interface IScopeGGService
    {
        Task<List<ScopeGGResponseDto>> GetScopeGGDataAsync();
    }
}
