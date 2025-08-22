using CS2Ranking.Domain.Entities;
using CS2Ranking.Domain.Interfaces;

namespace CS2Ranking.Infrastructure.Repositories
{
    public class MatchRepository : Repository<Match>, IMatchRepository
    {
        public MatchRepository(AppDbContext context) : base(context)
        {
        }
    }
}
