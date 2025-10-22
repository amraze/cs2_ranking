namespace CS2Ranking.Domain.Entities
{
    public class Map : Entity
    {
        public required string Name { get; set; }
        public required string PicturePath { get; set; }
        public required string LogoPath { get; set; }
    }
}
