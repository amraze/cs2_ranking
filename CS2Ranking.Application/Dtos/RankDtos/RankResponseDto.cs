namespace CS2Ranking.Application.Dtos.RankDtos
{
    public class RankResponseDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int RatingMin { get; set; }
        public int RatingMax { get; set; }
        public required string PicturePath { get; set; }
    }
}
