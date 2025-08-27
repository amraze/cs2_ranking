namespace CS2Ranking.Domain.Entities
{
    public class MatchRank : Entity
    {
        public int MatchId { get; set; }
        public int RankId { get; set; }
        public int RankScore { get; set; }

    }

}
