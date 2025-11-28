using CS2Ranking.Application.Dtos.ExternalDtos;

namespace CS2Ranking.Application.Interfaces.IRepositories
{
    public interface IScopeGGService
    {
        Task<List<ScopeGGResponseDto>> GetScopeGGDataAsync();
    }
}
