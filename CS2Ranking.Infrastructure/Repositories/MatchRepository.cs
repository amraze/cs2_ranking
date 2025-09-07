using CS2Ranking.Application.Interfaces.IRepositories;
using CS2Ranking.Domain.Entities;

namespace CS2Ranking.Infrastructure.Repositories
{
    public class MatchRepository : Repository<Match>, IMatchRepository
    {
        public MatchRepository(AppDbContext context) : base(context)
        {
        }
    }
}
