using CS2Ranking.Domain.Entities;
using CS2Ranking.Application.Interfaces.IRepositories;

namespace CS2Ranking.Infrastructure.Repositories
{
    public class MapRepository : Repository<Map>, IMapRepository
    {
        public MapRepository(AppDbContext context) : base(context)
        {
        }
    }
}
