namespace CS2Ranking.Domain.Entities
{
    public class MatchResult : Entity
    {
        // Domain Attributes
        public int MatchId { get; set; }
        public int Kills { get; set; }
        public int Assists { get; set; }
        public int Deaths { get; set; }
        public int Mvps { get; set; }
        public double Hsp { get; set; }
        public int Score { get; set; }
        public int Adr { get; set; }
        public Match Match { get; private set; }
        // Required by EF Core for materialization
        private MatchResult() { }

        // Domain constructor 
        internal MatchResult(Match match, int kills, int assists, int deaths, int mvps, double hsp, int score, int adr)
        {
            Match = match ?? throw new ArgumentNullException(nameof(match));
            Kills = kills;
            Assists = assists;
            Deaths = deaths;
            Mvps = mvps;
            Hsp = hsp;
            Score = score;
            Adr = adr;
        }
    }
}
