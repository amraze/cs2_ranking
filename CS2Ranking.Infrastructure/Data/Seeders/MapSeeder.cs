using CS2Ranking.Infrastructure.Data.Factories;
using CS2Ranking.Domain.Entities;

namespace CS2Ranking.Infrastructure.Data.Seeders
{
    public class MapSeeder(MapFactory mapFactory, AppDbContext context)
    {
        private readonly MapFactory _mapFactory = mapFactory;
        private readonly AppDbContext _context = context;

        public void Seed()
        {
            var maps = new List<Map>
            {
                _mapFactory.Create(name: "Anubis", picturePath: "https://app.scope.gg/static/records/de_anubis.webp"),
                _mapFactory.Create(name: "Inferno", picturePath: "https://app.scope.gg/static/records/de_inferno.webp"),
                _mapFactory.Create(name: "Mirage", picturePath: "https://app.scope.gg/static/records/de_mirage.webp"),
                _mapFactory.Create(name: "Train", picturePath: "https://app.scope.gg/static/records/de_train.webp"),
                _mapFactory.Create(name: "Dust II", picturePath: "https://app.scope.gg/static/records/de_dust2.webp"),
                _mapFactory.Create(name: "Nuke", picturePath: "https://app.scope.gg/static/records/de_nuke.webp"),
                _mapFactory.Create(name: "Overpass", picturePath: "https://app.scope.gg/static/records/de_overpass.webp"),
                _mapFactory.Create(name: "Ancient", picturePath: "https://app.scope.gg/static/records/de_ancient.webp"),
            };

            _context.Map.AddRange(maps);
            _context.SaveChanges();
        }
    }
}
