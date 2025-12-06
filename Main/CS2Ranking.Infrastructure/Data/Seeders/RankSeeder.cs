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
            _context.Rank.ExecuteDelete();
            var ranks = new List<Rank>
            {
                _rankFactory.Create(name: "Common", ratingMin : 0, picturePath: "https://static.csstats.gg/images/ranks/cs2/rating.common.png"),
                _rankFactory.Create(name: "Uncommon", ratingMin : 5000, picturePath: "https://static.csstats.gg/images/ranks/cs2/rating.uncommon.png"),
                _rankFactory.Create(name: "Rare", ratingMin : 10000, picturePath: "https://static.csstats.gg/images/ranks/cs2/rating.rare.png"),
                _rankFactory.Create(name: "Mythical", ratingMin : 15000, picturePath: "https://static.csstats.gg/images/ranks/cs2/rating.mythical.png"),
                _rankFactory.Create(name: "Legendary", ratingMin : 20000, picturePath: "https://static.csstats.gg/images/ranks/cs2/rating.legendary.png"),
                _rankFactory.Create(name: "Ancient", ratingMin : 25000, picturePath: "https://static.csstats.gg/images/ranks/cs2/rating.ancient.png"),
                _rankFactory.Create(name: "Unusual", ratingMin : 30000, picturePath: "https://static.csstats.gg/images/ranks/cs2/rating.unusual.png"),
            };

            _context.Rank.AddRange(ranks);
            _context.SaveChanges();
        }
    }
}
