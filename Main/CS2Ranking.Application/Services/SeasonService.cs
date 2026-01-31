using CS2Ranking.Application.Dtos.RankDtos;
using CS2Ranking.Application.Dtos.SeasonDtos;
using CS2Ranking.Application.Interfaces.IRepositories;
using CS2Ranking.Application.Interfaces.IServices;

namespace CS2Ranking.Application.Services
{
    public class SeasonService(ISeasonRepository seasonRepository) : ISeasonService
    {
        private readonly ISeasonRepository _seasonRepository = seasonRepository;

        public async Task<IEnumerable<SeasonResponseDto>> GetAllSeasonsAsync()
        {
            var seasons = (await _seasonRepository.GetAllAsync())
                .OrderBy(s => s.StartDate)
                .ToList();
            var seasonDtos = seasons.Select(season => new SeasonResponseDto
            {
                Id = season.Id,
                StartDate = season.StartDate,
                EndDate = season.EndDate
            });

            return seasonDtos;
        }
    }
}
