namespace CS2Ranking.Domain.Entities
{
    public class Match : Entity
    {
        public int SeasonId { get; private set; }
        public DateTime Datetime { get; private set; }
        public int MapId { get; private set; }
        public int Result { get; private set; }
        public MatchResult? MatchResult { get; private set; }
        public MatchRank? MatchRank { get; private set; }

        public Match(int seasonId, DateTime datetime, int mapId, int result)
        {
            SeasonId = seasonId;
            Datetime = datetime;
            MapId = mapId;
            Result = result;
        }

        public void SetResult(MatchResult result)
        {
            MatchResult = result;
        }

        public void SetRank(MatchRank rank)
        {
            MatchRank = rank;
        }
    }
}
