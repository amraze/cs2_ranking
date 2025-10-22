using CS2Ranking.Application.Dtos;
using CS2Ranking.Application.Interfaces.IRepositories;
using CS2Ranking.Application.Interfaces.IServices;
using CS2Ranking.Domain.Entities;
using System.Linq.Expressions;

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
                PicturePath = map.PicturePath,
                LogoPath = map.LogoPath
            });

            return mapDtos;
        }

        public async Task<MapResponseDto?> GetMapByNameAsync(string name)
        {
            var maps = await _mapRepository.FindAsync(m => m.Name.Equals(name));
            var map = maps.FirstOrDefault();
            if (map == null) return null;

            return new MapResponseDto
            {
                Id = map.Id,
                Name = map.Name,
                PicturePath = map.PicturePath,
                LogoPath = map.LogoPath
            };
        }
    }
}
