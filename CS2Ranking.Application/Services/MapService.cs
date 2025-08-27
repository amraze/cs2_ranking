using CS2Ranking.Application.Dtos;
using CS2Ranking.Application.Interfaces;
using CS2Ranking.Domain.Interfaces;

namespace CS2Ranking.Application.Services
{
    public class MapService(IMapRepository mapRepository) : IMapService
    {
        private readonly IMapRepository _mapRepository = mapRepository;

        public async Task<IEnumerable<MapResponseDto>> GetAllMapsAsync()
        {
            var maps = await _mapRepository.GetAllAsync();
            var mapDtos = maps.Select(map => new MapResponseDto
            {
                Id = map.Id,
                Name = map.Name,
                PicturePath = map.PicturePath
            });

            return mapDtos;
        }
    }
}
