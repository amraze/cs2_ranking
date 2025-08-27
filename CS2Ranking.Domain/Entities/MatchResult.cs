namespace CS2Ranking.Domain.Entities
{
    public class MatchResult : Entity
    {
        public int MatchId { get; set; }
        public int Kills { get; set; }
        public int Assists { get; set; }
        public int Deaths { get; set; }
        public int Mvps { get; set; }
        public double Hsp { get; set; }
        public int Score { get; set; }
        public int Adr { get; set; }

    }

}
