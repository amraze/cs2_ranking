using CS2Ranking.Domain.Entities;
using Bogus;

namespace CS2Ranking.Domain.Factories
{
    public class RankFactory
    {
        private readonly Faker _faker = new Faker();

        public Rank Create(
            string? name = null,
            int? ratingMin = null,
            string? picturePath = null
        )
        {
            int min = ratingMin ?? _faker.Random.Int(0, 25000);
            int max = min + 4999;

            return new Rank
            {
                Name = name ?? $"Rank {min / 1000}",
                RatingMin = min,
                RatingMax = max,
                PicturePath = picturePath ?? _faker.Image.PicsumUrl()
            };
        }
    }
}
