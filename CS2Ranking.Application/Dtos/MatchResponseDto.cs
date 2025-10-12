using CS2Ranking.Domain.Entities;

namespace CS2Ranking.Application.Dtos
{
    public class MatchResponseDto
    {
        public DateTime Datetime { get; set; }
        public int Outcome { get; set; }
        public MatchResult? MatchResult { get; set; }
        public MatchRank? MatchRank { get; set; }
    }
}
