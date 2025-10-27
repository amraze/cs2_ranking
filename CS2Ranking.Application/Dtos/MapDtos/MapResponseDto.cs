namespace CS2Ranking.Application.Dtos.MapDtos
{
    public class MapResponseDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string PicturePath { get; set; }
        public required string LogoPath { get; set; }
    }
}
