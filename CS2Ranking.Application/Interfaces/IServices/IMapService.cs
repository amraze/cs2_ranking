using CS2Ranking.Application.Dtos;

namespace CS2Ranking.Application.Interfaces.IServices
{
    public interface IMapService
    {
        Task<IEnumerable<MapResponseDto>> GetAllMapsAsync();
        Task<MapResponseDto?> GetMapByNameAsync(string name);
    }
}
