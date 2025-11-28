namespace CS2Ranking.Domain.Entities
{
    public class Rank : Entity
    {
        public required string Name { get; set; }
        public int RatingMin { get; set; }
        public int RatingMax { get; set; }
        public required string PicturePath { get; set; }
    }
}
