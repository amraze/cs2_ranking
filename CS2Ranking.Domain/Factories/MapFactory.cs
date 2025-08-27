using Bogus;
using CS2Ranking.Domain.Entities;

namespace CS2Ranking.Domain.Factories
{
    public class MapFactory
    {
        private readonly Faker _faker = new Faker();
        public Map Create(string? name = null, string? picturePath = null)
        {
            return new Map
            {
                Name = name ?? _faker.Address.City(),      
                PicturePath = picturePath ?? _faker.Image.PicsumUrl()
            };
        }
    }
}
