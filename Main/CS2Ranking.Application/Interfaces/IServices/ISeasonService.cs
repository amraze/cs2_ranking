using CS2Ranking.Application.Dtos.SeasonDtos;

namespace CS2Ranking.Application.Interfaces.IServices
{
    public interface ISeasonService
    {
        Task<IEnumerable<SeasonResponseDto>> GetAllSeasonsAsync();
    }
}
