namespace CS2Ranking.Domain.Entities
{
    public class Match
    {
        public int Id { get; set; }
        public int Result { get; set; }
        public int MapId { get; set; }
        public int SeasonId { get; set; }
        public DateTime Datetime { get; set; }
    }
}
