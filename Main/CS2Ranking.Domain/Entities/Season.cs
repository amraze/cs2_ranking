namespace CS2Ranking.Domain.Entities
{
    public class Season : Entity
    {
        public required string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
