namespace CS2Ranking.Domain.Entities
{
    public class MatchRank : Entity
    {
        // Domain Attributes
        public int MatchId { get; set; }
        public int RankId { get; set; }
        public int RankScore { get; set; }
        public Match Match { get; private set; }

        // Required by EF Core for materialization
        private MatchRank() { }

        // Domain constructor 
        internal MatchRank(Match match, int rankId, int rankScore)
        {
            Match = match ?? throw new ArgumentNullException(nameof(match));
            RankScore = rankScore;
            RankId = rankId;
        }
    }
}


