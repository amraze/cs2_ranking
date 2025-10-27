using CS2Ranking.Application.Dtos.RankDtos;

namespace CS2Ranking.Application.Interfaces.IServices
{
    public interface IRankService
    {
        Task<IEnumerable<RankResponseDto>> GetAllRanksAsync();
        Task<RankResponseDto?> GetRankByScoreAsync(int rank);
    }
}
