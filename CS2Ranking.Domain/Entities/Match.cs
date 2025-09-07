namespace CS2Ranking.Domain.Entities
{
    public class Match : Entity
    {
        // Domain attributes
        public int SeasonId { get; private set; }
        public DateTime Datetime { get; private set; }
        public int MapId { get; private set; }
        public int Result { get; private set; }
        public MatchResult? MatchResult { get; private set; }
        public MatchRank? MatchRank { get; private set; }

        // Required by EF Core for materialization
        private Match() { }

        // Domain constructor 
        public Match(int seasonId, DateTime datetime, int mapId, int result)
        {
            SeasonId = seasonId;
            Datetime = datetime;
            MapId = mapId;
            Result = result;
        }

        // Aggregate root creates its dependent entities
        public void SetResult(int kills, int assists, int deaths, int mvps, double hsp, int score, int adr)
        {
            MatchResult = new MatchResult(this, kills, assists, deaths, mvps, hsp, score, adr);
        }
        public void SetRank(int rankScore, int rankId)
        {
            MatchRank = new MatchRank(this, rankId, rankScore);
        }
    }
}
