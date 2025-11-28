namespace CS2Ranking.Application.Models
{
    public class MapPerformance
    {
        public int Id { get; set; }
        public int Matches { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }
        public int Draws { get; set; }
        public int Kills { get; set; }
        public int Assists { get; set; }
        public int Deaths { get; set; }
        public double Adr { get; set; }
        public double Hltv { get; set; }
    }
}
