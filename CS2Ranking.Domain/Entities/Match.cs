namespace CS2Ranking.Domain.Entities
{
    public class Match : Entity
    {
        // Domain attributes
        public int SeasonId { get; private set; }
        public DateTime Datetime { get; private set; }
        public int MapId { get; private set; }
        public int Outcome { get; private set; }
        public string Gamemode { get; private set; }
        public string Score { get; private set; }
        public MatchResult? MatchResult { get; private set; }
        public MatchRank? MatchRank { get; private set; }

        // Required by EF Core for materialization
        private Match() { }

        // Domain constructor 
        public Match(int seasonId, DateTime datetime, int mapId, int outcome, string score, string gamemode)
        {
            SeasonId = seasonId;
            Datetime = datetime;
            MapId = mapId;
            Outcome = outcome;
            Score = score;
            Gamemode = gamemode;
        }

        // Aggregate root creates its dependent entities
        public void SetResult(int kills, int assists, int deaths, double hltv, int adr)
        {
            MatchResult = new MatchResult(this, kills, assists, deaths, hltv, adr);
        }
        public void SetRank(int rankId, int? rankScore)
        {
            MatchRank = new MatchRank(this, rankId, rankScore);
        }
    }
}
