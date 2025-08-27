using CS2Ranking.Domain.Factories;
using CS2Ranking.Domain.Entities;

namespace CS2Ranking.Infrastructure.Data.Seeders
{
    public class SeasonSeeder(SeasonFactory seasonFactory, AppDbContext context)
    {
        private readonly SeasonFactory _seasonFactory = seasonFactory;
        private readonly AppDbContext _context = context;

        public void Seed()
        {
            var seasons = new List<Season>
            {
                _seasonFactory.Create( name: "Season 1", start_date: new DateTime(2023, 9, 1), end_date: new DateTime(2025, 1, 31)),
                _seasonFactory.Create( name: "Season 2", start_date: new DateTime(2025, 1, 29), end_date: new DateTime(2025, 7, 14)),
                _seasonFactory.Create( name: "Season 3", start_date: new DateTime(2025, 7, 15), end_date: null )
            };

            _context.Season.AddRange(seasons);
            _context.SaveChanges();
        }
    }
}
