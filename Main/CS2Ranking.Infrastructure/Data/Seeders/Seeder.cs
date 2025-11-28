using CS2Ranking.Domain.Factories;

namespace CS2Ranking.Infrastructure.Data.Seeders
{
    public static class Seeder
    {
        public static void Run(AppDbContext context)
        {
            // Maps Seeding
            var mapFactory = new MapFactory();
            var mapSeeder = new MapSeeder(mapFactory, context);
            mapSeeder.Seed();

            // Ranks Seeding
            var rankFactory = new RankFactory();
            var rankSeeder = new RankSeeder(rankFactory, context);
            rankSeeder.Seed();

            // Seasons Seeding
            var seasonFactory = new SeasonFactory();
            var seasonSeeder = new SeasonSeeder(seasonFactory, context);
            seasonSeeder.Seed();
        }
    }
}