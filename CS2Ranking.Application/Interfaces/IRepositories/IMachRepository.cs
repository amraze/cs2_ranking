using CS2Ranking.Domain.Entities;

namespace CS2Ranking.Application.Interfaces.IRepositories
{
    public interface IMatchRepository : IRepository<Match>
    {
        Task<IEnumerable<Match>> GetWithDetailsAsync(int? limit = null, int? offset = null);
    }
}
