using Bogus;
using CS2Ranking.Domain.Entities;

namespace CS2Ranking.Domain.Factories
{
    public class SeasonFactory
    {
        private readonly Faker _faker = new Faker();

        public Season Create(
            string? name = null,
            DateTime? start_date = null,
            DateTime? end_date = null
        )
        {
            var startDate = start_date ?? _faker.Date.Past(2);
            var endDate = end_date ?? _faker.Date.Between(startDate, DateTime.UtcNow.AddYears(1));

            return new Season
            {
                Name = name ?? $"Season {_faker.IndexFaker + 1}",
                StartDate = start_date ?? startDate,
                EndDate = end_date ?? endDate,
            };
        }
    }
}
