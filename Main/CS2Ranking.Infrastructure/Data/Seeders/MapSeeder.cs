using CS2Ranking.Domain.Entities;
using CS2Ranking.Domain.Factories;
using Microsoft.EntityFrameworkCore;

namespace CS2Ranking.Infrastructure.Data.Seeders
{
    public class MapSeeder(MapFactory mapFactory, AppDbContext context)
    {
        private readonly MapFactory _mapFactory = mapFactory;
        private readonly AppDbContext _context = context;

        public void Seed()
        {
            var mapsToSeed = new List<(string name, string picturePath, string logoPath)>
            {
                ("de_anubis", "https://app.scope.gg/static/records/de_anubis.webp", "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_anubis/3199361692.svg"),
                ("de_inferno", "https://app.scope.gg/static/records/de_inferno.webp", "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_inferno/160854753.svg"),
                ("de_mirage", "https://app.scope.gg/static/records/de_mirage.webp", "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_mirage/2821631066.svg"),
                ("de_train", "https://app.scope.gg/static/records/de_train.webp", "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_train/3451132749.svg"),
                ("de_dust2", "https://app.scope.gg/static/records/de_dust2.webp", "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_dust2/1271333759.svg"),
                ("de_nuke", "https://app.scope.gg/static/records/de_nuke.webp", "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_nuke/3113460509.svg"),
                ("de_overpass", "https://app.scope.gg/static/records/de_overpass.webp", "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_overpass/4249751265.svg"),
                ("de_ancient", "https://app.scope.gg/static/records/de_ancient.webp", "https://scope-cs2-radars-dev.s3.eu-central-1.amazonaws.com/de_ancient/2150053253.svg"),
            };

            var existingMapNames = _context.Map.Select(m => m.Name).ToHashSet();
            
            var newMaps = mapsToSeed
                .Where(m => !existingMapNames.Contains(m.name))
                .Select(m => _mapFactory.Create(name: m.name, picturePath: m.picturePath, logoPath: m.logoPath))
                .ToList();

            if (newMaps.Any())
            {
                _context.Map.AddRange(newMaps);
                _context.SaveChanges();
            }
        }
    }
}