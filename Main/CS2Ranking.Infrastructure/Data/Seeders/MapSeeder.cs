using CS2Ranking.Domain.Factories;
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
                _mapFactory.Create(name: "de_anubis", picturePath: "https://app.scope.gg/static/records/de_anubis.webp", logoPath: "https://app.scope.gg/static/records/de_anubis.webp"),
                _mapFactory.Create(name: "de_inferno", picturePath: "https://app.scope.gg/static/records/de_inferno.webp", logoPath: "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_inferno/160854753.svg"),
                _mapFactory.Create(name: "de_mirage", picturePath: "https://app.scope.gg/static/records/de_mirage.webp", logoPath: "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_mirage/2821631066.svg"),
                _mapFactory.Create(name: "de_train", picturePath: "https://app.scope.gg/static/records/de_train.webp", logoPath: "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_train/3451132749.svg"),
                _mapFactory.Create(name: "de_dust2", picturePath: "https://app.scope.gg/static/records/de_dust2.webp", logoPath: "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_dust2/1271333759.svg"),
                _mapFactory.Create(name: "de_nuke", picturePath: "https://app.scope.gg/static/records/de_nuke.webp", logoPath: "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_nuke/3113460509.svg"),
                _mapFactory.Create(name: "de_overpass", picturePath: "https://app.scope.gg/static/records/de_overpass.webp", logoPath: "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_overpass/4249751265.svg"),
                _mapFactory.Create(name: "de_ancient", picturePath: "https://app.scope.gg/static/records/de_ancient.webp", logoPath: "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_ancient/2150053253.svg"),
            };

            _context.Map.AddRange(maps);
            _context.SaveChanges();
        }
    }
}
