using CS2Ranking.Application.Dtos.MapDtos;

namespace CS2Ranking.Application.Interfaces.IServices
{
    public interface IMapService
    {
        Task<IEnumerable<MapResponseDto>> GetAllMapsAsync();
        Task<IEnumerable<MapPerformanceResponseDto>> GetAllMapPerformanceAsync();
        Task<MapResponseDto?> GetMapByNameAsync(string name);
    }
}
