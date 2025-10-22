namespace CS2Ranking.Domain.Entities
{
    public class MatchResult : Entity
    {
        // Domain Attributes
        public int MatchId { get; set; }
        public int Kills { get; set; }
        public int Assists { get; set; }
        public int Deaths { get; set; }
        public double Hltv { get; set; }
        public int Adr { get; set; }
        // Required by EF Core for materialization
        private MatchResult() { }

        // Domain constructor 
        internal MatchResult(Match match, int kills, int assists, int deaths, double hltv, int adr)
        {
            Kills = kills;
            Assists = assists;
            Deaths = deaths;
            Hltv = hltv;
            Adr = adr;
        }
    }
}
