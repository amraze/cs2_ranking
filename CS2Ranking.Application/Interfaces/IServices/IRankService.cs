using CS2Ranking.Application.Dtos;

namespace CS2Ranking.Application.Interfaces.IServices
{
    public interface IRankService
    {
        Task<IEnumerable<RankResponseDto>> GetAllRanksAsync();
    }
}
