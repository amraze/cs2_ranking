namespace CS2Ranking.Application.Dtos.MatchDtos
{
    public class EvolutionResponseDto
    {
        public DateTime MatchDate { get; set; }
        public int Adr{ get; set; }
        public int? Rank{ get; set; }
        public int Kills { get; set; }
        public int Deaths { get; set; }
        public double Hltv { get; set; }
        public int Total { get; set; }
    }
}
