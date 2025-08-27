using CS2Ranking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CS2Ranking.Infrastructure
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Map> Map { get; set; }
        public DbSet<Match> Match { get; set; }
        public DbSet<Season> Season { get; set; }
        public DbSet<Rank> Rank { get; set; }
    }
}
