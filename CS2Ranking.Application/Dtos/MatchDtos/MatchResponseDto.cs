using CS2Ranking.Domain.Entities;

namespace CS2Ranking.Application.Dtos.MatchDtos
{
    public class MatchResponseDto
    {
        public DateTime Datetime { get; set; }
        public int Outcome { get; set; }
        public string Gamemode{ get; set; }
        public string Score { get; set; }
        public int MapId { get; set; }
        public MatchResult? MatchResult { get; set; }
        public MatchRank? MatchRank { get; set; }
    }
}
