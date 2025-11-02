using CS2Ranking.Domain.Entities;
using CS2Ranking.Application.Interfaces.IRepositories;

namespace CS2Ranking.Infrastructure.Repositories
{
    public class SeasonRepository : Repository<Season>, ISeasonRepository
    {
        public SeasonRepository(AppDbContext context) : base(context)
        {
        }
    }
}
