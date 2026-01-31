using CS2Ranking.Domain.Entities;
using CS2Ranking.Domain.Factories;
using Microsoft.EntityFrameworkCore;

namespace CS2Ranking.Infrastructure.Data.Seeders
{
    public class SeasonSeeder(SeasonFactory seasonFactory, AppDbContext context)
    {
        private readonly SeasonFactory _seasonFactory = seasonFactory;
        private readonly AppDbContext _context = context;

        public void Seed()
        {
            var seasonsToSeed = new List<(string name, DateTime start_date, DateTime? end_date)>
            {
                ("Season 1", new DateTime(2023, 9, 1, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 1, 31, 0, 0, 0, DateTimeKind.Utc)),
                ("Season 2", new DateTime(2025, 1, 29, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 7, 14, 0, 0, 0, DateTimeKind.Utc)),
                ("Season 3", new DateTime(2025, 7, 15, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 1, 19, 0, 0, 0, DateTimeKind.Utc)),
                ("Season 4", new DateTime(2026, 1, 21, 0, 0, 0, DateTimeKind.Utc), null)
            };

            var existingSeasonNames = _context.Season.Select(s => s.Name).ToHashSet();
            
            var newSeasons = seasonsToSeed
                .Where(s => !existingSeasonNames.Contains(s.name))
                .Select(s => _seasonFactory.Create(name: s.name, start_date: s.start_date, end_date: s.end_date))
                .ToList();

            if (newSeasons.Any())
            {
                _context.Season.AddRange(newSeasons);
                _context.SaveChanges();
            }
        }
    }
}