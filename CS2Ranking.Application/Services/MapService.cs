using CS2Ranking.Application.Dtos.MapDtos;
using CS2Ranking.Application.Interfaces.IRepositories;
using CS2Ranking.Application.Interfaces.IServices;

namespace CS2Ranking.Application.Services
{
    public class MapService(IMapRepository mapRepository, IMatchRepository matchRepository) : IMapService
    {
        private readonly IMapRepository _mapRepository = mapRepository;
        private readonly IMatchRepository _matchRepository = matchRepository;

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

        public async Task<IEnumerable<MapPerformanceResponseDto>> GetAllMapPerformanceAsync()
        {
            var performance = await _matchRepository.GetAllMapPerformanceAsync();

            return performance.Select(p => new MapPerformanceResponseDto
            {
                Id = p.Id,
                Matches = p.Matches,
                Wins = p.Wins,
                Losses = p.Losses,
                Draws = p.Draws,
                Kills = p.Kills,
                Assists = p.Assists,
                Deaths = p.Deaths,
                Adr = p.Adr,
                Hltv = p.Hltv
            }).ToList();
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
