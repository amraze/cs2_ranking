using CS2Ranking.Domain.Entities;
using CS2Ranking.Domain.Interfaces;

namespace CS2Ranking.Infrastructure.Repositories
{
    public class RankRepository : Repository<Rank>, IRankRepository
    {
        public RankRepository(AppDbContext context) : base(context)
        {
        }
    }
}
