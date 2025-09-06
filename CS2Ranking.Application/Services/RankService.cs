using CS2Ranking.Application.Dtos;
using CS2Ranking.Application.Interfaces;
using CS2Ranking.Domain.Interfaces;

namespace CS2Ranking.Application.Services
{
    public class RankService(IRankRepository rankRepository) : IRankService
    {
        private readonly IRankRepository _rankRepository = rankRepository;

        public async Task<IEnumerable<RankResponseDto>> GetAllRanksAsync()
        {
            var ranks = await _rankRepository.GetAllAsync();
            var rankDtos = ranks.Select(rank => new RankResponseDto
            {
                Id = rank.Id,
                Name = rank.Name,
                RatingMin = rank.RatingMin,
                RatingMax = rank.RatingMax,
                PicturePath = rank.PicturePath
            });

            return rankDtos;
        }
    }
}
