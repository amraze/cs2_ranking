using CS2Ranking.Application.Dtos.MapDtos;
using CS2Ranking.Domain.Entities;

namespace CS2Ranking.Application.Interfaces.IServices
{
    public interface IMapService
    {
        Task<IEnumerable<MapResponseDto>> GetAllMapsAsync();
        Task<IEnumerable<MapPerformanceResponseDto>> GetAllMapPerformanceAsync(DateTime? start, DateTime? end);
        Task<MapResponseDto?> GetMapByNameAsync(string name);
    }
}
