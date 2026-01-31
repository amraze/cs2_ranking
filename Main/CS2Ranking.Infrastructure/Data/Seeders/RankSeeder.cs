using CS2Ranking.Domain.Entities;
using CS2Ranking.Domain.Factories;
using Microsoft.EntityFrameworkCore;

namespace CS2Ranking.Infrastructure.Data.Seeders
{
    public class RankSeeder(RankFactory rankFactory, AppDbContext context)
    {
        private readonly RankFactory _rankFactory = rankFactory;
        private readonly AppDbContext _context = context;

        public void Seed()
        {
            var ranksToSeed = new List<(string name, int ratingMin, string picturePath)>
            {
                ("Common", 0, "https://static.csstats.gg/images/ranks/cs2/rating.common.png"),
                ("Uncommon", 5000, "https://static.csstats.gg/images/ranks/cs2/rating.uncommon.png"),
                ("Rare", 10000, "https://static.csstats.gg/images/ranks/cs2/rating.rare.png"),
                ("Mythical", 15000, "https://static.csstats.gg/images/ranks/cs2/rating.mythical.png"),
                ("Legendary", 20000, "https://static.csstats.gg/images/ranks/cs2/rating.legendary.png"),
                ("Ancient", 25000, "https://static.csstats.gg/images/ranks/cs2/rating.ancient.png"),
                ("Unusual", 30000, "https://static.csstats.gg/images/ranks/cs2/rating.unusual.png"),
            };

            var existingRankNames = _context.Rank.Select(r => r.Name).ToHashSet();
            
            var newRanks = ranksToSeed
                .Where(r => !existingRankNames.Contains(r.name))
                .Select(r => _rankFactory.Create(name: r.name, ratingMin: r.ratingMin, picturePath: r.picturePath))
                .ToList();

            if (newRanks.Any())
            {
                _context.Rank.AddRange(newRanks);
                _context.SaveChanges();
            }
        }
    }
}