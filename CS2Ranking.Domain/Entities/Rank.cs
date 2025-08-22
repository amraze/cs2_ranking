namespace CS2Ranking.Domain.Entities
{
    public class Rank
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int RatingMin { get; set; }
        public int RatingMax { get; set; }
        public required string PicturePath { get; set; }
    }
}
