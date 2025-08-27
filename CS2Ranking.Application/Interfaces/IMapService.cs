using CS2Ranking.Application.Dtos;

namespace CS2Ranking.Application.Interfaces
{
    public interface IMapService
    {
        Task<IEnumerable<MapResponseDto>> GetAllMapsAsync();
    }
}
