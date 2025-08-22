namespace CS2Ranking.Application.Dtos
{
    public class MatchDto
    {
        public int Id { get; set; }
        public int Result { get; set; }
        public int MapId { get; set; }
        public int SeasonId { get; set; }
        public DateTime Datetime { get; set; }
    }
}
