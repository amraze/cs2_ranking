using CS2Ranking.Application.Dtos;
using CS2Ranking.Application.Interfaces.IRepositories;
using CS2Ranking.Application.Interfaces.IServices;
using CS2Ranking.Domain.Entities;

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

        public async Task<RankResponseDto?> GetRankByScoreAsync(int score)
        {
            var ranks = await _rankRepository.FindAsync(r => r.RatingMax >= score && r.RatingMin <= score);
            var rank = ranks.FirstOrDefault();
            if (rank == null) return null;

            return new RankResponseDto
            {
                Id = rank.Id,
                Name = rank.Name,
                RatingMin = rank.RatingMin,
                RatingMax = rank.RatingMax,
                PicturePath = rank.PicturePath
            };
        }
    }
}
